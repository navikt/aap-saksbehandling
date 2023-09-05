import { Detail, Label } from '@navikt/ds-react/esm/typography';
import { hentBehandling, hentSaksinfo } from 'lib/api';
import { ReactNode } from 'react';

import { Tag } from 'components/DsClient';
import { Steg } from 'components/steg/Steg';

import styles from './layout.module.css';
import { StegType } from '../../../../lib/types/types';

const StegNavn: StegType[] = [
  'START_BEHANDLING',
  'VURDER_ALDER',
  'AVKLAR_SYKDOM',
  'INNHENT_REGISTERDATA',
  'INNGANGSVILKÅR',
  'FASTSETT_GRUNNLAG',
  'FASTSETT_UTTAK',
  'BEREGN_TILKJENT_YTELSE',
  'SIMULERING',
  'FORESLÅ_VEDTAK',
  'FATTE_VEDTAK',
  'IVERKSETT_VEDTAK',
  'UDEFINERT',
  'AVSLUTT_BEHANDLING',
];

interface Props {
  children: ReactNode;
  params: { saksId: string; behandlingsReferanse: string };
}

const Layout = async ({ children, params }: Props) => {
  const saksInfo = await hentSaksinfo(params.saksId); // TODO: Litt metadata om søker, skal skrives om
  const behandling = await hentBehandling(params.behandlingsReferanse);

  return (
    <div>
      <div className={styles.saksinfoBanner}>
        <div className={styles.søkerinfo}>
          <div className={styles.ikon} />
          <Label size="small">{saksInfo.søker.navn}</Label>
          <span aria-hidden>/</span>
          <Detail>{saksInfo.søker.fnr}</Detail>
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
      <div>
        <ol type="1" className={styles.stegMeny}>
          {StegNavn.filter((steg) => ['VURDER_ALDER', 'AVKLAR_SYKDOM'].includes(steg)).map((steg) => (
            <Steg
              key={steg}
              navn={steg}
              erFullført={behandling?.aktivtSteg !== steg}
              aktivtSteg={behandling?.aktivtSteg === steg}
            />
          ))}
        </ol>
      </div>
      <div className={styles.space} />
      {children}
    </div>
  );
};

export default Layout;
