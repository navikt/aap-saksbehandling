import { GosysOppgave } from 'lib/types/gosysTypes';
import { sorterEtterEldsteDato, sorterEtterNyesteDato } from 'lib/utils/date';

export interface GosysSortering {
  orderBy: 'opprettetTidspunkt' | 'fristFerdigstillelse';
  direction: 'ascending' | 'descending';
}

export function sorterGosysOppgaver(oppgaver: GosysOppgave[], sortering?: GosysSortering): GosysOppgave[] {
  if (!sortering) return oppgaver;

  return [...oppgaver].sort((a, b) => {
    const datoA = a[sortering.orderBy];
    const datoB = b[sortering.orderBy];

    if (!datoA) return datoB ? 1 : 0;
    if (!datoB) return -1;

    return sortering.direction === 'ascending'
      ? sorterEtterEldsteDato(datoA, datoB)
      : sorterEtterNyesteDato(datoA, datoB);
  });
}

export function mapOppgaveTypeTilTekst(oppgavetype: string): string {
  switch (oppgavetype) {
    case 'KONT_BRUK':
      return 'Kontakt bruker';
    case 'VUR_KONS_YTE':
      return 'Vurder konsekvens for ytelse';
    case 'INNH_DOK':
      return 'Innhent dokumentasjon';
    case 'JFR':
      return 'Journalføring';
    case 'VURD_HENV':
      return 'Vurder henvendelse';
    case 'BEH_SED':
      return 'Behandle SED';
    case 'RETUR':
      return 'Behandle returpost';
    case 'SVAR_IK_MOT':
      return 'Svar ikke mottatt';
    case 'VURD_NOTAT':
      return 'Vurder notat';
    case 'VUR_SVAR':
      return 'Vurder svar';
    case 'BEH_HENV':
      return 'Behandle henvendelse';
    default:
      return oppgavetype;
  }
}

export function mapGjelderTilTekst({ behandlingstema }: Pick<GosysOppgave, 'behandlingstype' | 'behandlingstema'>) {
  return gjelderVerdier.find((verdi) => verdi.kode === behandlingstema)?.term ?? behandlingstema;
}

/**
 * Hentet fra "opprett ny" modal i gosys.
 */
const gjelderVerdier = [
  { kode: 'ab0499', term: 'Arbeidsutprøving' },
  { kode: 'ab0570', term: 'Avbryte revurdering' },
  { kode: 'ab0048', term: 'Barnetillegg' },
  { kode: 'ab0500', term: 'Etablering' },
  { kode: 'ab0465', term: 'Etterbetaling ung ufør' },
  { kode: 'ab0532', term: 'Ferdig avklart mot uføretrygd' },
  { kode: 'ab0498', term: 'Ferdig avklart til arbeidssøker' },
  { kode: 'ab0502', term: 'Institusjonsopphold' },
  { kode: 'ab0269', term: 'Medlemskap' },
  { kode: 'ab0507', term: 'Ny maksdato sykepenger' },
  { kode: 'ab0430', term: 'Papirmeldekort' },
  { kode: 'ab0504', term: 'Refusjonskrav' },
  { kode: 'ab0297', term: 'Reisestønader til arbeidssøkere' },
  { kode: 'ab0563', term: 'Sluttavtale' },
  { kode: 'ab0362', term: 'Studentbestemmelsen' },
  { kode: 'ab0364', term: 'Sykepengeerstatning' },
  { kode: 'ab0339', term: 'Yrkesskade' },
];
