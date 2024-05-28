import { appConfig } from "./config";

export const getTokenOnFuse = (tokenId: string) => {
    for (let token of appConfig.wrappedBridge.fuse.tokens) {
        if (token.coinGeckoId === tokenId) {
            return token;
        }
    }
};