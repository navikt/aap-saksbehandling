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

export function mapGjelderTilTekst({
  behandlingstype,
  behandlingstema,
}: Pick<GosysOppgave, 'behandlingstype' | 'behandlingstema'>): string {
  const behandlingstypeTerm =
    gjelderVerdier.find((verdi) => verdi.behandlingstype === behandlingstype)?.behandlingstypeTerm ?? behandlingstype;
  const behandlingstemaTerm =
    gjelderVerdier.find((verdi) => verdi.behandlingstema === behandlingstema)?.behandlingstemaTerm ?? behandlingstema;

  return [behandlingstypeTerm, behandlingstemaTerm].filter(Boolean).join(' - ');
}

/**
 * Hentet fra https://github.com/navikt/gosys-oppgavebehandling/blob/6c5932975cb3a9343a206c9651b52092055d5d44/src/__mocks__/kodeverk.ts#L2390
 */
const gjelderVerdier = [
  {
    behandlingstype: 'ae0004',
    behandlingstypeTerm: 'Behandle vedtak',
  },
  {
    behandlingstema: 'ab0498',
    behandlingstemaTerm: 'Ferdig avklart mot arbeid',
  },
  {
    behandlingstema: 'ab0499',
    behandlingstemaTerm: 'Arbeidsutprøving',
  },
  {
    behandlingstema: 'ab0500',
    behandlingstemaTerm: 'Etablering',
  },
  {
    behandlingstema: 'ab0501',
    behandlingstemaTerm: 'Lærling',
  },
  {
    behandlingstema: 'ab0502',
    behandlingstemaTerm: 'Institusjonsopphold',
  },
  {
    behandlingstema: 'ab0504',
    behandlingstemaTerm: 'Refusjonskrav',
  },
  {
    behandlingstema: 'ab0465',
    behandlingstemaTerm: 'Etterbetaling ung ufør',
  },
  {
    behandlingstype: 'ae0266',
    behandlingstypeTerm: 'Samhandling AAP-SP-DP',
  },
  {
    behandlingstype: 'ae0007',
    behandlingstypeTerm: 'Utbetaling',
  },
  {
    behandlingstype: 'ae0046',
    behandlingstypeTerm: 'Anke',
  },
  {
    behandlingstype: 'ae0047',
    behandlingstypeTerm: 'Gjenopptak',
  },
  {
    behandlingstype: 'ae0058',
    behandlingstypeTerm: 'Klage',
  },
  {
    behandlingstype: 'ae0106',
    behandlingstypeTerm: 'Utland',
  },
  {
    behandlingstype: 'ae0114',
    behandlingstypeTerm: 'Tidligere hjemsendt sak',
  },
  {
    behandlingstype: 'ae0115',
    behandlingstypeTerm: 'Hjemsendt til ny behandling',
  },
  {
    behandlingstype: 'ae0116',
    behandlingstypeTerm: 'Meldekort',
  },
  {
    behandlingstype: 'ae0124',
    behandlingstypeTerm: 'Mangler opplysninger',
  },
  {
    behandlingstema: 'ab0269',
    behandlingstemaTerm: 'Medlemskap',
  },
  {
    behandlingstema: 'ab0297',
    behandlingstemaTerm: 'Reisestønader til arbeidssøkere',
  },
  {
    behandlingstema: 'ab0339',
    behandlingstemaTerm: 'Yrkesskade',
  },
  {
    behandlingstema: 'ab0362',
    behandlingstemaTerm: 'Studentbestemmelsen',
  },
  {
    behandlingstema: 'ab0364',
    behandlingstemaTerm: 'Sykepengeerstatning',
  },
  {
    behandlingstype: 'ae0032',
    behandlingstypeTerm: 'Stans',
  },
  {
    behandlingstype: 'ae0224',
    behandlingstypeTerm: 'Partsinnsyn',
  },
  {
    behandlingstema: 'ab0430',
    behandlingstemaTerm: 'Papirmeldekort',
  },
  {
    behandlingstype: 'ae0248',
    behandlingstypeTerm: 'Unntak',
  },
  {
    behandlingstema: 'ab0194',
    behandlingstemaTerm: 'Uføretrygd',
  },
  {
    behandlingstema: 'ab0507',
    behandlingstemaTerm: 'Ny maksdato sykepenger',
  },
  {
    behandlingstema: 'ab0048',
    behandlingstemaTerm: 'Barnetillegg',
  },
];
