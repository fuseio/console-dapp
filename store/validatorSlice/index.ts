import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AppState } from '../rootReducer'
import { multicallContract, contractInterface } from '@/lib/contractInteract'
import { fetchConsensusValidators, fetchTokenPrice, postConsensusDelegatedAmounts } from '@/lib/api'
import { Address, formatEther } from 'viem'
import { CONFIG } from '@/lib/config'
import { ValidatorType } from '@/lib/types'

export interface ValidatorStateType {
    totalStakeAmount: string
    myStakeAmount: string
    validatorMetadata: ValidatorType[]
    validators: Address[]
    isLoading: boolean
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
        try {
            const {
                totalStakeAmount,
                totalSupply,
                maxStake,
                minStake,
                totalDelegators,
                allValidators,
                validatorsMetadata
            } = await fetchConsensusValidators();

            const validatorMetadata = Object.values(validatorsMetadata).map((metadata) => {
                const delegators: [Address, string][] = Object.values(metadata.delegators).map((delegatedAmount) => {
                    return [delegatedAmount.address, delegatedAmount.amountFormatted]
                })

                return {
                    ...metadata,
                    delegators
                }
            })

            let price = 0
            try {
                price = await fetchTokenPrice('fuse-network-token')
            } catch (error) {
                console.error('Error fetching token price:', error)
            }

            return {
                totalStakeAmount,
                validators: allValidators,
                price,
                fuseTokenTotalSupply: totalSupply,
                maxStake,
                minStake,
                validatorMetadata,
                totalDelegators
            }
        } catch (error) {
            console.error('Error fetching validators:', error)
            return rejectWithValue('Failed to fetch validators information')
        }
    }
)

export const fetchSelfStake = createAsyncThunk(
    'validators/fetchSelfStake',
    async ({ address, validators }: { address: Address, validators: Address[] }, { rejectWithValue }) => {
        try {
            const calls = validators.map((validator) => [
                CONFIG.consensusAddress,
                contractInterface.encodeFunctionData('delegatedAmount', [address, validator]),
            ])

            const [, results] = await multicallContract.aggregate(calls)

            const delegatedAmounts: [Address, string][] = results.map((result: any, index: number) => {
                const delegatedAmount = formatEther(contractInterface.decodeFunctionResult('delegatedAmount', result)[0])
                return [validators[index], delegatedAmount]
            })

            const amount = delegatedAmounts.reduce((acc, [, delegatedAmount]) => acc + parseFloat(delegatedAmount), 0)

            return { delegatedAmounts, amount }
        } catch (error) {
            console.error('Error fetching self stake:', error)
            return rejectWithValue('Failed to fetch self stake information')
        }
    }
)

export const fetchDelegatedAmounts = createAsyncThunk(
    'VALIDATORS/FETCH_DELEGATED_AMOUNTS',
    async ({ address, delegators }: { address: Address, delegators: Address[] }) => {
        try {
            const consensusDelegatedAmounts = await postConsensusDelegatedAmounts({ validator: address, delegators });
            const delegatedAmountsByDelegators = consensusDelegatedAmounts.delegatedAmountsByDelegators;
            const delegatedAmounts: [Address, string][] = Object.values(delegatedAmountsByDelegators).map((delegatedAmount) => {
                return [delegatedAmount.address, delegatedAmount.amountFormatted]
            })
            return { delegatedAmounts, address }
        } catch (error) {
            throw error
        }
    }
)

const validatorSlice = createSlice({
    name: 'VALIDATOR_STATE',
    initialState: INIT_STATE,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchValidators.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchValidators.fulfilled, (state, { payload }) => {
                state.isLoading = false
                state.totalStakeAmount = payload.totalStakeAmount
                state.validators = payload.validators
                state.fuseTokenUSDPrice = payload.price
                state.fuseTokenTotalSupply = payload.fuseTokenTotalSupply
                state.maxStakeAmount = payload.maxStake
                state.minStakeAmount = payload.minStake
                state.validatorMetadata = payload.validatorMetadata
                state.totalDelegators = payload.totalDelegators
            })
            .addCase(fetchValidators.rejected, (state, { error }) => {
                state.isLoading = false
                state.isError = true
                state.errorMessage = error.message || 'Failed to fetch validators information'
            })
            .addCase(fetchSelfStake.pending, (state) => {
                state.isBalanceLoading = true
            })
            .addCase(fetchSelfStake.fulfilled, (state, { payload }) => {
                state.isBalanceLoading = false
                state.myStakeAmount = payload.amount.toString()
                state.validatorMetadata = state.validatorMetadata.map((validator) => {
                    const delegatedAmount = payload.delegatedAmounts.find(delegatedAmount => delegatedAmount[0] === validator.address)
                    return {
                        ...validator,
                        selfStakeAmount: delegatedAmount ? delegatedAmount[1] : '0'
                    }
                })
            })
            .addCase(fetchSelfStake.rejected, (state, { error }) => {
                state.isBalanceLoading = false
                state.isError = true
                state.errorMessage = error.message || 'Failed to fetch self stake information'
            })
            .addCase(fetchDelegatedAmounts.pending, (state) => {
                state.isDelegatedAmountLoading = true
            })
            .addCase(fetchDelegatedAmounts.fulfilled, (state, { payload }) => {
                const validatorIndex = state.validatorMetadata.findIndex((validator) => validator.address === payload.address)
                if (validatorIndex !== -1) {
                    let validator = state.validatorMetadata[validatorIndex]
                    validator.delegators = payload.delegatedAmounts.sort((a, b) => parseInt(b[1]) - parseInt(a[1]))
                    state.validatorMetadata[validatorIndex] = validator
                }
                state.isDelegatedAmountLoading = false
            })
            .addCase(fetchDelegatedAmounts.rejected, (state, { error }) => {
                state.isDelegatedAmountLoading = false
                state.isError = true
                state.errorMessage = error.message || 'Failed to fetch delegated amounts'
            })
    }
})

export const selectValidatorSlice = (state: AppState): ValidatorStateType => state.validator
export const selectMaxStake = (state: AppState): string => state.validator.maxStakeAmount
export const selectMinStake = (state: AppState): string => state.validator.minStakeAmount

export default validatorSlice.reducer