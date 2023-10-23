'use client';

import { CheckmarkIcon } from '@navikt/aksel-icons';
import styles from './GruppeElement.module.css';
import { StegGruppe } from 'lib/types/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Props {
  navn: StegGruppe;
  nummer: number;
  erFullført: boolean;
  aktivtSteg: boolean;
  kanNavigeresTil: boolean;
}

export const GruppeElement = ({ navn, nummer, erFullført, aktivtSteg, kanNavigeresTil }: Props) => {
  const erFullførtStyle = erFullført ? styles.erFullført : '';
  const aktivtStegStyle = aktivtSteg ? styles.aktivtSteg : styles.steg;
  const kanNavigeresTilStyle = kanNavigeresTil ? styles.kanNavigeresTil : '';
  const nummerStyle = aktivtSteg || erFullført ? styles.nummerAktiv : styles.nummer;

  const params = useParams();

  const label = mapGruppeTypeToGruppeNavn(navn);

  return (
    <li className={`${aktivtStegStyle} ${styles.steg} ${erFullførtStyle} ${kanNavigeresTilStyle}`}>
      <div className={nummerStyle}>{erFullført ? <CheckmarkIcon title="Fullført" /> : nummer}</div>

      {aktivtSteg || erFullført || kanNavigeresTil ? (
        <Link href={`/sak/${params.saksId}/${params.behandlingsReferanse}/${navn}`}>{label}</Link>
      ) : (
        <span>{label}</span>
      )}
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
    case 'VEDTAK':
      return 'Vedtak';
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
    case 'SYKEPENGEERSTATNING':
      return 'Sykepengeerstatning';
    case 'UDEFINERT':
      return 'Udefinert';
  }
}
