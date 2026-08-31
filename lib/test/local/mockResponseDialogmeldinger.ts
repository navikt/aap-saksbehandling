import { DialogmeldingLeveringStatus, InnkommendeUtgaaende } from 'lib/types/dialogmelding';

export const mockResponseDokumenter = {
  type: 'SUCCESS',
  status: 200,
  data: [
    {
      dialogmelding: {
        innkommendeUtgaaende: InnkommendeUtgaaende.UTGÅENDE,
        meldingFraNavn: 'Nav, Kari Normann',
        opprettetTidspunkt: new Date('2026-08-10'),
        dokumentasjonsType: 'MELDING_FRA_NAV',
        tekst: 'Hei, kan dere sende over legeerklæring for pasienten?',
        meldingStatus: DialogmeldingLeveringStatus.SENDT,
        journalpostId: '454048894',
      },
      dokumentIdListe: [],
    },
    {
      dialogmelding: {
        innkommendeUtgaaende: InnkommendeUtgaaende.INNKOMMENDE,
        meldingFraNavn: 'Dr. Sonja Paracet',
        opprettetTidspunkt: new Date('2026-08-21'),
        dokumentasjonsType: 'L40',
        tekst: '',
        meldingStatus: null,
        journalpostId: '454156422',
      },
      dokumentIdListe: [
        {
          dokumentInfoId: '99999',
          tittel: 'Mitt dokument',
        },
      ],
    },
  ],
};
