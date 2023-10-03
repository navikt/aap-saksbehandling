'use client';

import { CheckmarkCircleIcon } from '@navikt/aksel-icons';
import styles from './GruppeElement.module.css';
import { StegGruppe } from 'lib/types/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Props {
  navn: StegGruppe;
  erFullført: boolean;
  aktivtSteg: boolean;
}

export const GruppeElement = ({ navn, erFullført, aktivtSteg }: Props) => {
  const erFullførtStyle = erFullført ? styles.erFullført : '';
  const aktivtStegStyle = aktivtSteg ? styles.aktivtSteg : '';

  const params = useParams();

  return (
    <li className={`${aktivtStegStyle} ${styles.steg}`}>
      <Link href={`/sak/${params.saksId}/${params.behandlingsReferanse}/${navn}`}>
        {mapGruppeTypeToGruppeNavn(navn)}
      </Link>
      {erFullført && <CheckmarkCircleIcon title="Fullført" className={erFullførtStyle} />}
    </li>
  );
};

export function mapGruppeTypeToGruppeNavn(steg: StegGruppe): string {
  switch (steg) {
    case 'MEDLEMSKAP':
      return 'Medlemskap';
    case 'SYKDOM':
      return 'Sykdom';
    case 'UTTAK':
      return 'Uttak';
    case 'TILKJENT_YTELSE':
      return 'Tilkjent ytelse';
    case 'FATTE_VEDTAK':
      return 'Fatte vedtak';
    case 'FORESLÅ_VEDTAK':
      return 'Foreslå vedtak';
    case 'IVERKSETT_VEDTAK':
      return 'Iverksette vedtak';
    case 'SIMULERING':
      return 'Simulering';
    case 'START_BEHANDLING':
      return 'Start behandling';
    case 'BARNETILLEGG':
      return 'Barnetillegg';
    case 'SAMORDNING':
      return 'Samordning';
    case 'ALDER':
      return 'Alder';
    case 'GRUNNLAG':
      return 'Grunnlag';
    case 'LOVVALG':
      return 'Lovvalg';
    case 'UDEFINERT':
      return 'Udefinert';
  }
}
