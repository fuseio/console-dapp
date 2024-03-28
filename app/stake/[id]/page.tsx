// see https://stackoverflow.com/a/77090142/12656707

import PageWrapper from "./wrapper";
import { getJailedValidators, getValidators } from '@/lib/contractInteract';

export async function generateStaticParams() {
  try {
    // Fetch validators and jailedValidators in parallel
    const [validators, jailedValidators] = await Promise.all([
      getValidators(),
      getJailedValidators(),
    ]);

    // Combine and deduplicate the validator lists using a Set
    const uniqueValidators = new Set([...validators, ...jailedValidators]);

    // Map the unique validators to the desired format
    return Array.from(uniqueValidators).map(validator => ({
      id: validator.toLowerCase(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return []; // Return an empty array or handle the error as needed
  }
}

const Stake = ({ params }: { params: { id: string } }) => {
  return (
    <PageWrapper params={params} />
  );
};

export default Stake;
