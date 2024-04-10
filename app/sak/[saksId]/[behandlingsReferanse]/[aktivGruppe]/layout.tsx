import { hentBehandling, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { HGrid } from 'components/DsClient';
import styles from './layout.module.css';
import { ReactNode } from 'react';
import { GruppeElement } from 'components/gruppeelement/GruppeElement';
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
  const flytResponse = await hentFlyt(params.behandlingsReferanse);

  if (behandling === undefined) {
    notFound();
  }

  const stegSomSkalVises = getStegSomSkalVises(decodeURI(params.aktivGruppe) as StegGruppe, flytResponse);

  return (
    <>
      <div>
        <ol type="1" className={styles.stegMeny}>
          {flytResponse?.flyt
            .filter((gruppe) =>
              [
                'SYKDOM',
                'VEDTAK',
                'ALDER',
                'GRUNNLAG',
                'MEDLEMSKAP',
                'LOVVALG',
                'UTTAK',
                'TILKJENT_YTELSE',
                'SIMULERING',
                'BARNETILLEGG',
                'BREV',
                'FATTE_VEDTAK',
              ].includes(gruppe.stegGruppe)
            )
            .map((gruppe, index) => {
              return (
                <GruppeElement
                  key={gruppe.stegGruppe}
                  navn={gruppe.stegGruppe}
                  nummer={index + 1}
                  erFullført={gruppe.erFullført}
                  aktivtSteg={decodeURI(params.aktivGruppe) === gruppe.stegGruppe}
                  kanNavigeresTil={gruppe.erFullført || flytResponse.aktivGruppe === gruppe.stegGruppe}
                />
              );
            })}
        </ol>
      </div>
      <HGrid columns={'1fr 3fr 1fr'} className={styles.kolonner}>
        <InformasjonsKolonne
          stegSomSkalVises={stegSomSkalVises}
          className={`${styles.kolonne} ${styles.venstrekolonne}`}
        />
        {children}
        <div className={`${styles.kolonne} ${styles.høyrekolonne}`} />
      </HGrid>
    </>
  );
};

export default Layout;
