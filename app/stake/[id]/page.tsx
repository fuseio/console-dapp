// see https://stackoverflow.com/a/77090142/12656707

import Validators from '@/validators/validators.json';
import PageWrapper from "./wrapper";

export async function generateStaticParams() {
  const validators = Object.keys(Validators);

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
