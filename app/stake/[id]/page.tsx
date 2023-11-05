// see https://stackoverflow.com/a/77090142/12656707

import PageWrapper from "./wrapper";
import { getJailedValidators, getValidators } from '@/lib/contractInteract';

export async function generateStaticParams() {
  let validators = await getValidators()
  const jailedValidators = await getJailedValidators()
  validators = validators.concat(jailedValidators)
  validators = [...new Set(validators)]

  return validators.map((validator) => ({
    id: validator,
  }))
}

const Stake = ({ params }: { params: { id: string } }) => {
  return (
    <PageWrapper params={params} />
  );
};

export default Stake;
