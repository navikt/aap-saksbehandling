import { hentYrkesskadeGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Yrkesskade } from 'components/behandlinger/sykdom/yrkesskade/Yrkesskade';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';

// const dummy = async (): Promise<SykdomsGrunnlag> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(hentYrkesskadeGrunnlag());
//     }, 2000);
//   });
// };

interface Props {
  behandlingsReferanse: string;
}

export const YrkesskadeMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentYrkesskadeGrunnlag(behandlingsReferanse, getToken(headers()));

  return <Yrkesskade behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} />;
};
