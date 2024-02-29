// see https://stackoverflow.com/a/77090142/12656707

import { CONFIG } from "@/lib/config";
import PageWrapper from "./wrapper";
import { contractInterface, multicallContract } from '@/lib/contractInteract';

export async function generateStaticParams() {
  const calls = [
    'getValidators',
    'jailedValidators',
  ].map((method) =>
    [
      CONFIG.consensusAddress,
      contractInterface.encodeFunctionData(method, [])
    ]
  );

  const [[, results]] = await Promise.all([
    multicallContract.aggregate(calls),
  ]);

  const [validators, jailedValidators] = results.map((result: any, index: any) =>
    contractInterface.decodeFunctionResult(calls[index][1], result)[0]
  );

  const combinedValidators = [...new Set(validators.concat(jailedValidators))];

  return combinedValidators.map((validator: any) => ({
    id: validator.toLowerCase(),
  }))
}

const Stake = ({ params }: { params: { id: string } }) => {
  return (
    <PageWrapper params={params} />
  );
};

export default Stake;
