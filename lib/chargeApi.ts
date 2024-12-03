import axios from "axios";
import {
  NEXT_PUBLIC_CHARGE_BLOCKCHAIN_API_BASE_URL,
  NEXT_PUBLIC_CHARGE_PAYMENTS_API_BASE_URL,
  NEXT_PUBLIC_CHARGE_PAYMENTS_API_KEY,
} from "./config";
import { Address } from "abitype";

export interface BridgeResponseType {
  walletAddress: Address;
  tokenAddress: Address;
  chainId: number;
  tokenDecimals: number;
  paymentId: string;
  startTime: number;
  endTime: number;
  amount: string;
  gasFee: number;
  totalAmount: string;
}

const ChargePaymentsAPI = axios.create({
  baseURL: NEXT_PUBLIC_CHARGE_PAYMENTS_API_BASE_URL,
  params: {
    apiKey: NEXT_PUBLIC_CHARGE_PAYMENTS_API_KEY,
  },
});

const ChargeBlockchainAPI = axios.create({
  baseURL: NEXT_PUBLIC_CHARGE_BLOCKCHAIN_API_BASE_URL,
});

export const fetchSupportedBridgeTokensByChain = (chainId: number) =>
  ChargePaymentsAPI.get(`/payments/bridge/supported-tokens/${chainId}`).then(
    (response) => response.data
  );

export const fetchSupportedWithdrawTokensByChain = (chainId: number) =>
  ChargePaymentsAPI.get(`/payments/withdraw/supported-tokens/${chainId}`).then(
    (response) => response.data
  );

export const fetchTransactionStatus = (id: string) =>
  ChargeBlockchainAPI.get(`/chain/status/${id}`).then(
    (response) => response.data
  );

export const fetchTransactionHistory = (address: string) =>
  ChargePaymentsAPI.get(`/payments/payment/bridge-payments`, {
    params: {
      wallet: address,
    },
  }).then((response) => response.data);

export const initiateBridge = async (
  chainId: string,
  token: string,
  amount: string,
  destinationWallet: string
): Promise<BridgeResponseType> => {
  return new Promise((resolve, reject) => {
    const data = {
      chainId,
      token,
      amount,
      destinationWallet,
    };
    ChargePaymentsAPI.post(`/payments/bridge/create-new`, data)
      .then((response) => {
        resolve(response.data as BridgeResponseType);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const initiateWithdraw = async (
  chainId: string,
  token: string,
  amount: string,
  destinationWallet: string
): Promise<BridgeResponseType> => {
  return new Promise((resolve, reject) => {
    const data = {
      chainId,
      token,
      amount,
      destinationWallet,
    };
    ChargePaymentsAPI.post(`/payments/withdraw/create-new`, data)
      .then((response) => {
        resolve(response.data as BridgeResponseType);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
