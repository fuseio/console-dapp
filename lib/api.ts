import axios from "axios";
import { CONFIG, NEXT_PUBLIC_FUSE_API_BASE_URL } from './config'
import { Operator, OperatorContactDetail, SignData } from "./types";

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
    `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
  );
  return response.data[`${tokenId}`].usd as number;
};

export const fetchTotalSupply = async () => {
    const response = await axios.get(`https://bot.fuse.io/api/v1/stats/total_supply_simple`)
    return response.data
}

export const postValidateOperator = async (signData: SignData): Promise<string> => {
    const response = await axios.post(
        `${NEXT_PUBLIC_FUSE_API_BASE_URL}/accounts/v1/auth/validate`,
        signData
    )
    return response.data
}

export const fetchAuthenticatedOperator = async (token: string): Promise<Operator> => {
    const response = await axios.get(
        `${NEXT_PUBLIC_FUSE_API_BASE_URL}/accounts/v1/operators/me`,
        {
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        }
    )
    return response.data
}

export const postCreateOperator = async (operatorContactDetail: OperatorContactDetail, token: string): Promise<Operator> => {
    const response = await axios.post(
        `${NEXT_PUBLIC_FUSE_API_BASE_URL}/accounts/v1/operators/create`,
        operatorContactDetail,
        {
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        }
    )
    return response.data
}
