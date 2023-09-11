import axios from "axios";

export const fetchTokenPrice = async (tokenId: string) => {
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
  );
  return response.data[`${tokenId}`].usd as number;
};
