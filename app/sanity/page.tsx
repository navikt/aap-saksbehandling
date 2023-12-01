import { hentAlleBrevmaler } from 'lib/services/sanityservice/sanityservice';
import { BrevmalVelger } from 'components/brevmalvelger/BrevmalVelger';

export default async function Page() {
  const brevmaler = await hentAlleBrevmaler();

  return <BrevmalVelger brevmaler={brevmaler} />;
}
