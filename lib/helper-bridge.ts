import { find } from 'lodash';
import { appConfig } from "./config";

export const getTokenOnFuse = (tokenId: string) =>
    find(appConfig.wrappedBridge.fuse.tokens, { coinGeckoId: tokenId });