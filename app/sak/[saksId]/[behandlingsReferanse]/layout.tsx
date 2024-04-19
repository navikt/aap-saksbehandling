import { ReactNode } from 'react';
import { Detail, Label } from '@navikt/ds-react';
import { hentSaksinfo } from 'lib/clientApi';
import { hentFlyt, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { hentPersonInformasjonForIdent } from 'lib/services/pdlservice/pdlService';
import { HGrid, Tag } from 'components/DsClient';

import styles from './layout.module.css';
import { StegGruppeIndikator } from 'components/steggruppeindikator/StegGruppeIndikator';
import { ToTrinnsvurderingMedDataFetching } from 'components/totrinnsvurdering/ToTrinnsvurderingMedDataFetching';

interface Props {
  children: ReactNode;
  params: { saksId: string; behandlingsReferanse: string };
}

const Layout = async ({ children, params }: Props) => {
  const saksInfo = await hentSaksinfo();
  const sak = await hentSak(params.saksId);
  const personInformasjon = await hentPersonInformasjonForIdent(sak.ident);
  const flytResponse = await hentFlyt(params.behandlingsReferanse);

  return (
    <div>
      <div className={styles.saksinfoBanner}>
        <div className={styles.søkerinfo}>
          <div className={styles.ikon} />
          <Label size="small">{personInformasjon.navn}</Label>
          <span aria-hidden>/</span>
          <Detail>{sak?.ident}</Detail>
          {saksInfo.labels.map((label) => (
            <Tag variant="info" size="xsmall" key={label.type}>
              {label.type}
            </Tag>
          ))}
        </div>

        <Detail className={styles.endretAv}>
          Sist endret av {saksInfo.sistEndret.navn} den {saksInfo.sistEndret.tidspunkt}
        </Detail>
      </div>
      <StegGruppeIndikator flytRespons={flytResponse} />

      <HGrid columns={'3fr 1fr'} className={styles.kolonner}>
        {children}
        <div className={`${styles.kolonne}`}>
          <ToTrinnsvurderingMedDataFetching behandlingsReferanse={params.behandlingsReferanse} />
        </div>
      </HGrid>
    </div>
  );
};

export default Layout;
