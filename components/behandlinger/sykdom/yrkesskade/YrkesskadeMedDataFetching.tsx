import { hentYrkesskadeGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Yrkesskade } from 'components/behandlinger/sykdom/yrkesskade/Yrkesskade';
import { SykdomsGrunnlag } from 'lib/types/types';
const dummy = async (): Promise<SykdomsGrunnlag> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(hentYrkesskadeGrunnlag());
    }, 2000);
  });
};
export const YrkesskadeMedDataFetching = async () => {
  const grunnlag = await dummy();
  return <Yrkesskade behandlingsReferanse={'123'} grunnlag={grunnlag} />;
};
