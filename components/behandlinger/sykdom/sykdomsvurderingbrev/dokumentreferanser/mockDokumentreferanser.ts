export interface Dokumentreferanse {
  id: string;
  tittel: string;
  type: 'Inngående' | 'Utgående';
  brevkode?: string;
  journalført: string;
  erMeldekort: boolean;
}

export const mockDokumentreferanser: Dokumentreferanse[] = [
  {
    id: 'mock-annen-dokumentasjon',
    tittel: 'Annen dokumentasjon',
    type: 'Inngående',
    journalført: '2026-01-24',
    erMeldekort: false,
  },
  {
    id: 'mock-legeerklaering',
    tittel: 'Legeerklæring',
    type: 'Inngående',
    brevkode: 'L7-legeerklæring',
    journalført: '2026-01-20',
    erMeldekort: false,
  },
  {
    id: 'mock-soeknad',
    tittel: 'Søknad om arbeidsavklaringspenger',
    type: 'Inngående',
    brevkode: 'NAV 11-13.05',
    journalført: '2026-01-01',
    erMeldekort: false,
  },
  {
    id: 'mock-utgaaende-brev',
    tittel: 'Forespørsel om dokumentasjon',
    type: 'Utgående',
    brevkode: 'AAP-forespørsel',
    journalført: '2025-12-29',
    erMeldekort: false,
  },
  {
    id: 'mock-meldekort',
    tittel: 'Meldekort for perioden 12.01.2026–25.01.2026',
    type: 'Inngående',
    brevkode: 'Meldekort',
    journalført: '2026-01-26',
    erMeldekort: true,
  },
];
