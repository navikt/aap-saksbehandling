import { BrevmalVelger } from 'components/brevmalvelger/BrevmalVelger';
import { hentAlleBrevmaler } from 'lib/services/sanityservice/sanityservice';

export const Brev = async () => {
  const brevmaler = await hentAlleBrevmaler();

  return <BrevmalVelger brevmaler={brevmaler} />;
};
