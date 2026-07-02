import { SakerResponse } from './apiInternServiceDTOs';

export const dummySakerResponse: SakerResponse = {
  saker: [
    {
      sakId: '044245',
      lopenummer: 100241,
      aar: 2024,
      antallVedtak: 2,
      sakstype: 'AAP',
      regDato: '2024-01-15',
      avsluttetDato: null,
      statuskode: 'AKTIV',
      statusnavn: 'Aktiv',
    },
    {
      sakId: '044246',
      lopenummer: 100242,
      aar: 2023,
      antallVedtak: 4,
      sakstype: 'Yrkesrettet attføring',
      regDato: '2023-03-20',
      avsluttetDato: '2024-01-01',
      statuskode: 'INAKT',
      statusnavn: 'Inaktiv',
    },
    {
      sakId: '044247',
      lopenummer: 100243,
      aar: 2023,
      antallVedtak: 1,
      sakstype: 'Klage/Anke',
      regDato: '2023-09-05',
      avsluttetDato: '2023-12-15',
      statuskode: 'INAKT',
      statusnavn: 'Inaktiv',
    },
  ],
};
