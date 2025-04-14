import axios, { AxiosResponse } from "axios";
import { CONFIG, NEXT_PUBLIC_AGENT_API_URL, NEXT_PUBLIC_AGENT_ID, NEXT_PUBLIC_AIRDROP_API_BASE_URL, NEXT_PUBLIC_AVAIL_MONITORING_API_URL, NEXT_PUBLIC_CHARGE_PAYMENTS_API_BASE_URL, NEXT_PUBLIC_COIN_GECKO_API_KEY, NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL, NEXT_PUBLIC_FUSE_API_BASE_URL, NEXT_PUBLIC_AVAIL_REWARD_API_URL } from './config'
import { AirdropLeaderboard, AirdropUser, CreateAirdropUser, DelegatedAmountsByDelegators, DelegatedAmountsRequest, Invoice, Operator, OperatorCheckoutSession, OperatorCheckout, OperatorContactDetail, OperatorWallet, Paymaster, SignData, ValidatorResponse, ChargeBridgeSupportedTokens, ChargeBridge, ChargeBridgeResponse, TextResponse } from "./types";
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

export const postCreateOperatorWallet = async (operatorWallet: OperatorWallet): Promise<OperatorWallet> => {
    const response = await axios.post(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/operators/wallet`,
        operatorWallet,
        {
            withCredentials: true
        }
    )
    return response.data
}

export const postMigrateOperatorWallet = async (operatorWallet: OperatorWallet): Promise<OperatorWallet> => {
    const response = await axios.post(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/operators/migrate-wallet`,
        operatorWallet,
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

export const postOperatorSubscription = async (): Promise<Invoice> => {
    const response = await axios.post(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/operators/subscriptions`,
        {},
        {
            withCredentials: true
        }
    )
    return response.data
}

export const postOperatorCheckout = async (operatorCheckout: OperatorCheckout): Promise<string> => {
    const response = await axios.post(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/operators/checkout/sessions`,
        operatorCheckout,
        {
            withCredentials: true
        }
    )
    return response.data
}

export const fetchOperatorCheckoutSessions = async (): Promise<OperatorCheckoutSession[]> => {
    const response = await axios.get(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/operators/checkout/sessions`,
        {
            withCredentials: true
        }
    )
    return response.data
}

export const fetchOperatorSubscriptionInvoices = async (): Promise<Invoice[]> => {
    const response = await axios.get(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/operators/subscriptions`,
        {
            withCredentials: true
        }
    )
    return response.data
}

export const fetchChargeBridgeSupportedTokens = async (): Promise<ChargeBridgeSupportedTokens> => {
    const response = await axios.get(`${NEXT_PUBLIC_CHARGE_PAYMENTS_API_BASE_URL}/payments/bridge/supported-tokens`)
    return response.data
}

export const postChargeBridge = async (chargeBridge: ChargeBridge): Promise<ChargeBridgeResponse> => {
    const response = await axios.post(
        `${NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL}/accounts/v1/operators/bridge`,
        chargeBridge,
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

export const postAuthenticateAirdropUser = async (eoaAddress: Address): Promise<{ jwt: string }> => {
    const response = await axios.post(
        `${NEXT_PUBLIC_AIRDROP_API_BASE_URL}/auth`,
        {
            eoaAddress
        }
    )
    return response.data
}

export const postCreateAirdropUser = async (createUserDetail: CreateAirdropUser, token: string): Promise<AirdropUser> => {
    const response = await axios.post(
        `${NEXT_PUBLIC_AIRDROP_API_BASE_URL}/user`,
        createUserDetail,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    )
    return response.data
}

export const fetchAirdropUser = async (token: string): Promise<AirdropUser> => {
    const response = await axios.get(
        `${NEXT_PUBLIC_AIRDROP_API_BASE_URL}/user`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    )
    return response.data
}


export const fetchAirdropLeaderboard = async (queryParams: Record<string, string>, token: string): Promise<AirdropLeaderboard> => {
    const url = new URL(`${NEXT_PUBLIC_AIRDROP_API_BASE_URL}/leaderboard`);
    const searchParams = new URLSearchParams(queryParams);
    url.search = searchParams.toString();
    const endpointUrl = url.toString();

    const response = await axios.get(
        endpointUrl,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    )
    return response.data
}

export const fetchAirdropTwitterAuthUrl = async (token: string, redirectDomain: string): Promise<{ authUrl: string }> => {
    const response = await axios.get(
        `${NEXT_PUBLIC_AIRDROP_API_BASE_URL}/twitter/generate-auth-url`,
        {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Redirect-Domain": redirectDomain
            }
        }
    )
    return response.data
}

export const postVerifyAirdropQuest = async (token: string, rewardType: string): Promise<{ message: string }> => {
    const response = await axios.post(
        `${NEXT_PUBLIC_AIRDROP_API_BASE_URL}/layer3/verify-one-time-quest`,
        { rewardType },
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    )
    return response.data
}

export const postJoinAirdropWaitlist = async (token: string, email: string): Promise<{ message: string }> => {
    const response = await axios.post(
        `${NEXT_PUBLIC_AIRDROP_API_BASE_URL}/join-waitlist`,
        { email },
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    )
    return response.data
}

export const postClaimTestnetFuse = async (walletAddress: Address): Promise<{ msg: string }> => {
    const response = await axios.post(
        'https://faucet.flash.fuse.io/api/claim',
        { address: walletAddress },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
    return response.data
}

export const fetchReferralCount = async (token: string): Promise<{ count: number }> => {
    const response = await axios.get(
        `${NEXT_PUBLIC_AIRDROP_API_BASE_URL}/referral-count`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    )
    return response.data
}

export const postAuthenticatedAirdrop = async (token: string, endpoint: string): Promise<{ message: string }> => {
    const response = await axios.post(
        `${NEXT_PUBLIC_AIRDROP_API_BASE_URL}/${endpoint}`,
        {},
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    )
    return response.data
}

export const fetchNodesClients = async () => {
    const response = await axios.get(`${NEXT_PUBLIC_AVAIL_MONITORING_API_URL}/clients`)
    return response.data
}

export const fetchUserDelegations = async (address: Address) => {
    const response = await axios.get(`${NEXT_PUBLIC_AVAIL_MONITORING_API_URL}/delegations?address=${address}`)
    return response.data
}
export const fetchUserPoints = async (address: Address) => {
    const response = await axios.get(`${NEXT_PUBLIC_AVAIL_REWARD_API_URL}/rewards/unclaimed?address=${address}`)
    return response.data
}
