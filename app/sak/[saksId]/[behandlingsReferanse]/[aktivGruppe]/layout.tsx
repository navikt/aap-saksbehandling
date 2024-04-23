import { hentBehandling, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import styles from './layout.module.css';
import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { InformasjonsKolonne } from 'components/informasjonskolonne/InformasjonsKolonne';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { StegGruppe } from 'lib/types/types';

const Layout = async ({
  params,
  children,
}: {
  params: { behandlingsReferanse: string; aktivGruppe: string };
  children: ReactNode;
}) => {
  const behandling = await hentBehandling(params.behandlingsReferanse);
  if (behandling === undefined) {
    notFound();
  }

  const flytResponse = await hentFlyt(params.behandlingsReferanse);
  const ferdigeSteg = flytResponse.flyt.filter((steg) => steg.erFullført).map((steg) => steg.stegGruppe);

  if (!ferdigeSteg.includes(params.aktivGruppe as StegGruppe) && flytResponse.aktivGruppe != params.aktivGruppe) {
    // TODO: Undersøke hva brukere ønsker dersom de går til en gruppe de ikke kan vurdere enda
    notFound();
  }

  const stegSomSkalVises = getStegSomSkalVises(decodeURI(params.aktivGruppe) as StegGruppe, flytResponse);

  return (
    <>
      <InformasjonsKolonne stegSomSkalVises={stegSomSkalVises} className={styles.venstrekolonne} />
      {children}
    </>
  );
};

export default Layout;
