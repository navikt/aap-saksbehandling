import { SamordningSosialhjelp } from 'components/behandlinger/underveis/samordningsosial/SamordningSosialhjelp';
import { hentRefusjonGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
}

export const SamordningSosialhjelpMedDatafetching = async ({ behandlingsreferanse }: Props) => {
  const grunnlag = await hentRefusjonGrunnlag(behandlingsreferanse);
  return <SamordningSosialhjelp grunnlag={grunnlag} />;
};
