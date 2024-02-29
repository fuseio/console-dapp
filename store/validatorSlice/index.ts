import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AppState } from '../rootReducer'
import { fetchValidatorData, multicallContract, contractInterface } from '@/lib/contractInteract'
import Validators from '@/validators/validators.json'
import { fetchNodeByAddress, fetchTokenPrice, fetchTotalSupply } from '@/lib/api'
import { Address, formatEther } from 'viem'
import { CONFIG } from '@/lib/config'

export interface ValidatorType {
    address: Address
    stakeAmount: string
    fee: string
    delegatorsLength: string
    delegators: [Address, string][]
    selfStakeAmount?: string
    name?: string
    website?: string
    firstSeen?: string
    status?: string
    image?: string
    forDelegation?: boolean
    totalValidated?: number
    uptime?: number
    description?: string
    isPending?: boolean
}

export interface ValidatorStateType {
    totalStakeAmount: string
    myStakeAmount: string
    validatorMetadata: ValidatorType[]
    validators: Address[]
    isLoading: boolean
    isMetadataLoading: boolean
    isBalanceLoading: boolean
    isDelegatedAmountLoading: boolean
    isError: boolean
    errorMessage: string
    totalDelegators: number
    fuseTokenUSDPrice: number
    fuseTokenTotalSupply: number
    maxStakeAmount: string
    minStakeAmount: string
}

const INIT_STATE: ValidatorStateType = {
    totalDelegators: 0,
    totalStakeAmount: '0',
    myStakeAmount: '0',
    validatorMetadata: [],
    validators: [],
    isLoading: false,
    isMetadataLoading: false,
    isError: false,
    errorMessage: '',
    isBalanceLoading: false,
    fuseTokenUSDPrice: 0,
    fuseTokenTotalSupply: 0,
    isDelegatedAmountLoading: false,
    maxStakeAmount: '0',
    minStakeAmount: '0'
}

export const fetchValidators = createAsyncThunk(
    'validators/fetch',
    async (_, { rejectWithValue }) => {
        const methods = [
            'totalStakeAmount',
            'getValidators',
            'jailedValidators',
            'getMaxStake',
            'getMinStake'
        ];
        const calls = methods.map((method) =>
            [
                CONFIG.consensusAddress,
                contractInterface.encodeFunctionData(method, [])
            ]
        );

        try {
            const [[, results], totalSupply] = await Promise.all([
                multicallContract.aggregate(calls),
                fetchTotalSupply(),
            ]);

            const [totalStakeAmount, validators, jailedValidators, maxStake, minStake] = results.map((result: any, index: any) =>
                contractInterface.decodeFunctionResult(calls[index][1], result)[0]
            );

            const combinedValidators = validators.concat(jailedValidators);

            let price = 0;
            try {
                price = await fetchTokenPrice('fuse-network-token');
            } catch (error) {
                console.error('Error fetching token price:', error);
            }

            return {
                totalStakeAmount: formatEther(totalStakeAmount),
                validators: combinedValidators,
                price,
                fuseTokenTotalSupply: totalSupply,
                maxStake: formatEther(maxStake),
                minStake: formatEther(minStake)
            };
        } catch (error) {
            console.error('Error fetching validators:', error);
            return rejectWithValue('Failed to fetch validators information');
        }
    }
);

export const fetchValidatorMetadata = createAsyncThunk(
    'validators/fetchMetadata',
    async (validators: Address[], { rejectWithValue }) => {
        try {
            const methods = ['jailedValidators', 'pendingValidators'];
            const calls = methods.map((method) =>
                [CONFIG.consensusAddress, contractInterface.encodeFunctionData(method, [])]
            );
            const [[, results]] = await Promise.all([
                multicallContract.aggregate(calls),
            ]);
            const [jailedValidators, pendingValidators] = results.map((result: any, index: any) =>
                contractInterface.decodeFunctionResult(calls[index][1], result)[0]
            );
            const validatorMap = new Map<string, {
                name?: string,
                website?: string,
                image?: string,
                description?: string
            }>(Object.entries(Validators));

            let totalDelegators = 0;
            const validatorMetadata = await Promise.all(validators.map(async (validator) => {
                const status = jailedValidators.includes(validator.toLowerCase()) ? 'inactive' : 'active';
                const metadata = await fetchValidatorData(validator);
                const validatorData = validatorMap.get(validator);
                totalDelegators += parseInt(metadata.delegatorsLength, 10);

                const baseMetadata = {
                    ...metadata,
                    address: validator,
                    name: validatorData?.name || validator,
                    website: validatorData?.website,
                    image: validatorData?.image,
                    status,
                    isPending: pendingValidators.includes(validator.toLowerCase()),
                    description: validatorData?.description
                };

                if (status === 'inactive') {
                    return baseMetadata;
                } else {
                    try {
                        const { Node } = await fetchNodeByAddress(validator);
                        return {
                            ...baseMetadata,
                            firstSeen: Node?.firstSeen,
                            forDelegation: Node?.forDelegation,
                            totalValidated: Node?.totalValidated,
                            uptime: Node?.upTime
                        };
                    } catch (error) {
                        return baseMetadata;
                    }
                }
            }));

            return { validatorMetadata, totalDelegators };
        } catch (error) {
            console.error('Error fetching validator metadata:', error);
            return rejectWithValue('Failed to fetch validator metadata');
        }
    }
);

export const fetchSelfStake = createAsyncThunk(
    'validators/fetchSelfStake',
    async ({ address, validators }: { address: Address, validators: Address[] }, { rejectWithValue }) => {
        try {
            const calls = validators.map((validator) => [
                CONFIG.consensusAddress,
                contractInterface.encodeFunctionData('delegatedAmount', [address, validator]),
            ]);

            const [, results] = await multicallContract.aggregate(calls);

            const delegatedAmounts: [Address, string][] = results.map((result: any, index: number) => {
                const delegatedAmount = formatEther(contractInterface.decodeFunctionResult('delegatedAmount', result)[0]);
                return [validators[index], delegatedAmount];
            });

            const amount = delegatedAmounts.reduce((acc, [, delegatedAmount]) => acc + parseFloat(delegatedAmount), 0);

            return { delegatedAmounts, amount };
        } catch (error) {
            console.error('Error fetching self stake:', error);
            return rejectWithValue('Failed to fetch self stake information');
        }
    }
);

export const fetchDelegatedAmounts = createAsyncThunk(
    'VALIDATORS/FETCH_DELEGATED_AMOUNTS',
    async ({ address, delegators }: { address: Address, delegators: Address[] }, thunkAPI) => {
        try {
            const calls = delegators.map((delegator) => [
                CONFIG.consensusAddress,
                contractInterface.encodeFunctionData('delegatedAmount', [address, delegator]),
            ]);
            const [, results] = await multicallContract.aggregate(calls);
            const delegatedAmounts: [Address, string][] = results.map((result: any, index: number) => {
                const delegatedAmount = formatEther(contractInterface.decodeFunctionResult('delegatedAmount', result)[0]);
                return [delegators[index], delegatedAmount];
            });
            return { delegatedAmounts, address };
        } catch (error) {
            throw error;
        }
    }
);


const validatorSlice = createSlice({
    name: 'VALIDATOR_STATE',
    initialState: INIT_STATE,
    reducers: {},
    extraReducers: {
        [fetchValidators.pending.toString()]: (state) => {
            state.isLoading = true
        },
        [fetchValidators.fulfilled.toString()]: (state, { payload }) => {
            state.isLoading = false
            state.totalStakeAmount = payload.totalStakeAmount
            state.validators = payload.validators
            state.fuseTokenUSDPrice = payload.price
            state.fuseTokenTotalSupply = payload.fuseTokenTotalSupply
            state.maxStakeAmount = payload.maxStake
            state.minStakeAmount = payload.minStake
        },
        [fetchValidators.rejected.toString()]: (state, { error }) => {
            state.isLoading = false
            state.isError = true
            state.errorMessage = error.message
        },
        [fetchValidatorMetadata.pending.toString()]: (state) => {
            state.isMetadataLoading = true
        },
        [fetchValidatorMetadata.fulfilled.toString()]: (state, { payload }) => {
            state.isMetadataLoading = false
            state.validatorMetadata = payload.validatorMetadata
            state.totalDelegators = payload.totalDelegators
        },
        [fetchValidatorMetadata.rejected.toString()]: (state, { error }) => {
            state.isMetadataLoading = false
            state.isError = true
            state.errorMessage = error.message
        },
        [fetchSelfStake.pending.toString()]: (state) => {
            state.isBalanceLoading = true
        },
        [fetchSelfStake.fulfilled.toString()]: (state, { payload }) => {
            state.isBalanceLoading = false
            state.myStakeAmount = payload.amount
            state.validatorMetadata = state.validatorMetadata.map((validator) => {
                const delegatedAmount = payload.delegatedAmounts.filter((delegatedAmount: Array<string>) => delegatedAmount[0] === validator.address)[0]
                return {
                    ...validator,
                    selfStakeAmount: delegatedAmount ? delegatedAmount[1] : '0'
                }
            })
        },
        [fetchSelfStake.rejected.toString()]: (state, { error }) => {
            state.isBalanceLoading = false
            state.isError = true
            state.errorMessage = error.message
        },
        [fetchDelegatedAmounts.pending.toString()]: (state) => {
            state.isDelegatedAmountLoading = true
        },
        [fetchDelegatedAmounts.fulfilled.toString()]: (state, { payload }) => {
            let validator = state.validatorMetadata.filter((validator) => validator.address === payload.address)[0]
            validator.delegators = (payload.delegatedAmounts).sort((a: [Address, string], b: [Address, string]) => {
                return parseInt(b[1]) - parseInt(a[1]);
            })
            const index = state.validatorMetadata.findIndex((validator) => validator.address === payload.address)
            state.validatorMetadata[index] = validator
            state.isDelegatedAmountLoading = false
        },
        [fetchDelegatedAmounts.rejected.toString()]: (state, { error }) => {
            state.isDelegatedAmountLoading = false
            state.isError = true
            state.errorMessage = error.message
        }
    }
})

export const selectValidatorSlice = (state: AppState): ValidatorStateType => state.validator
export const selectMaxStake = (state: AppState): string => state.validator.maxStakeAmount
export const selectMinStake = (state: AppState): string => state.validator.minStakeAmount

export default validatorSlice.reducer