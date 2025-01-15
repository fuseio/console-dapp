import axios, { AxiosResponse } from "axios";
import { CONFIG, NEXT_PUBLIC_AGENT_API_URL, NEXT_PUBLIC_AGENT_ID, NEXT_PUBLIC_COIN_GECKO_API_KEY, NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL, NEXT_PUBLIC_FUSE_API_BASE_URL } from './config'
import { DelegatedAmountsByDelegators, DelegatedAmountsRequest, Operator, OperatorContactDetail, Paymaster, SignData, TextResponse, ValidatorResponse } from "./types";
import { Address } from "viem";

export const fetchAllNodes = () =>
    axios.get(`${CONFIG.bootApi}/nodes`).then(response => response.data)

export const fetchOldNodes = () =>
    axios.get(`${CONFIG.bootApi}/oldNodes`).then(response => response.data)

export const fetchNodeByAddress = async (address: string) =>
    axios.get(`${CONFIG.bootApi}/node=${address}`).then(response => response.data)

export const fetchDelegatedNodes = () =>
    axios.get(`${CONFIG.bootApi}/delegatedNodes`).then(response => response.data)

export const fetchDelegatedNodesSorted = () =>
    axios.get(`${CONFIG.bootApi}/delegatedNodes_sorted`).then(response => response.data)

export const fetchFuseTokenData = () =>
    axios.get(`${CONFIG.bootApi}/stats/circulating`).then(response => response.data)

export const fetchTokenPrice = async (tokenId: string) => {
    const response = await axios.get(
        `https://pro-api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`,
        {
            headers: {
                "x-cg-pro-api-key": NEXT_PUBLIC_COIN_GECKO_API_KEY,
            }
        }
    );
    return response.data[`${tokenId}`].usd as number;
};

export const fetchTotalSupply = async () => {
    const response = await axios.get(`https://bot.fuse.io/api/v1/stats/total_supply_simple`)
    return response.data
}

export const checkOperatorExist = async (address: Address): Promise<AxiosResponse<any, any>> => {
    const response = await axios.head(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/operators/eoaAddress/${address}`
    )
    return response
}

export const postValidateOperator = (signData: SignData) => {
    return axios.post(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/operators/validate`,
        signData,
        {
            withCredentials: true
        }
    )
}

export const refreshOperatorToken = () => {
    return axios.post(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/operators/refresh-token`,
        {},
        {
            withCredentials: true
        }
    )
}

export const fetchCurrentOperator = async (): Promise<Operator> => {
    const response = await axios.get(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/operators/account`,
        {
            withCredentials: true
        }
    )
    return response.data
}

export const postCreateOperator = async (operatorContactDetail: OperatorContactDetail): Promise<Operator> => {
    const response = await axios.post(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/operators/account`,
        operatorContactDetail,
        {
            withCredentials: true
        }
    )
    return response.data
}


export const postCreateApiSecretKey = async (projectId: string): Promise<{ secretKey: string }> => {
    const response = await axios.post(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/projects/secret/${projectId}`,
        {},
        {
            withCredentials: true
        }
    )
    return response.data
}

export const updateApiSecretKey = async (projectId: string): Promise<{ secretKey: string }> => {
    const response = await axios.put(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/projects/secret/${projectId}`,
        {},
        {
            withCredentials: true
        }
    )
    return response.data
}

export const postCreatePaymaster = async (projectId: string): Promise<Paymaster[]> => {
    const response = await axios.post(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/paymaster/${projectId}`,
        {},
        {
            withCredentials: true
        }
    )
    return response.data
}

export const checkActivated = async (): Promise<AxiosResponse<any, any>> => {
    const response = await axios.get(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/operators/is-activated`,
        {
            withCredentials: true
        }
    )
    return response
}

export const fetchSponsoredTransactionCount = async (): Promise<{ sponsoredTransactions: number }> => {
    const response = await axios.get(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/operators/sponsored-transaction`,
        {
            withCredentials: true
        }
    )
    return response.data
}

export const fetchConsensusValidators = async (): Promise<ValidatorResponse> => {
    const response = await axios.get(`https://${NEXT_PUBLIC_FUSE_API_BASE_URL}/api/v0/consensus/validators`)
    return response.data
}

export const postConsensusDelegatedAmounts = async (delegatedAmounts: DelegatedAmountsRequest): Promise<{ delegatedAmountsByDelegators: DelegatedAmountsByDelegators }> => {
    const response = await axios.post(
        `https://${NEXT_PUBLIC_FUSE_API_BASE_URL}/api/v0/consensus/delegated_amounts`,
        delegatedAmounts
    )
    return response.data
}

export const postAiMessage = async (text: string): Promise<TextResponse> => {
    const response = await axios.post(`${NEXT_PUBLIC_AGENT_API_URL}/api/${NEXT_PUBLIC_AGENT_ID}/message`, {
        text,
        userId: "user", // You might want to get this from your auth system
        roomId: `default-room-${NEXT_PUBLIC_AGENT_ID}`, // You can implement room management later
    })
    return response.data
}
