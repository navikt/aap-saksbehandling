'use client';

import { CheckmarkCircleIcon } from '@navikt/aksel-icons';
import styles from './Steg.module.css';
import { StegType } from '../../lib/types/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Props {
  navn: StegType;
  erFullført: boolean;
  aktivtSteg: boolean;
}

export const Steg = ({ navn, erFullført, aktivtSteg }: Props) => {
  const erFullførtStyle = erFullført ? styles.erFullført : '';
  const aktivtStegStyle = aktivtSteg ? styles.aktivtSteg : '';

  const params = useParams();

  return (
    <li className={`${aktivtStegStyle} ${styles.steg}`}>
      <Link href={`/sak/${params.saksId}/${params.behandlingsReferanse}/${navn}`}>{mapStegTypeToStegNavn(navn)}</Link>
      {erFullført && <CheckmarkCircleIcon title="Fullført" className={erFullførtStyle} />}
    </li>
  );
};

export function mapStegTypeToStegNavn(steg: StegType): string {
  switch (steg) {
    case 'AVKLAR_SYKDOM':
      return 'Sykdomsvurdering';
    case 'VURDER_ALDER':
      return 'Alder';
    case 'AVSLUTT_BEHANDLING':
      return 'Avslutt behandling';
    case 'FASTSETT_GRUNNLAG':
      return 'Fastsette grunnlag';
    case 'BEREGN_TILKJENT_YTELSE':
      return 'Beregn tilkjent ytelse';
    case 'FASTSETT_UTTAK':
      return 'Fastsette uttak';
    case 'FATTE_VEDTAK':
      return 'Fatte vedtak';
    case 'FORESLÅ_VEDTAK':
      return 'Foreslå vedtak';
    case 'INNGANGSVILKÅR':
      return 'Inngangsvilkår';
    case 'INNHENT_REGISTERDATA':
      return 'Innhente registerdata';
    case 'IVERKSETT_VEDTAK':
      return 'Iverksette vedtak';
    case 'SIMULERING':
      return 'Simulering';
    case 'START_BEHANDLING':
      return 'Start behandling';
    case 'UDEFINERT':
      return 'Udefinert';
  }
}
