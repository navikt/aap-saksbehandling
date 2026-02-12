import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Studentvurdering } from 'components/behandlinger/sykdom/student/student/Studentvurdering';
import { userEvent } from '@testing-library/user-event';
import { addDays } from 'date-fns';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { render, screen, within } from 'lib/test/CustomRender';
import { MellomlagretVurderingResponse, StudentGrunnlag } from 'lib/types/types';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlagMedVurdering: StudentGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  nyeVurderinger: [],
  sisteVedtatteVurderinger: [],
  behøverVurderinger: [],
  kanVurderes: [],
  studentvurdering: {
    fom: '2025-01-01',
    begrunnelse: 'en god begrunnelse',
    harAvbruttStudie: true,
    vurdertAv: {
      dato: '2025-11-03',
      ident: 'Saksbehandler',
    },
  },
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'AVKLAR_STUDENT' });
});

describe('Student', () => {
  describe('Generelt', () => {
    it('skal ha en overskrift', () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
      const heading = screen.getByText('§ 11-14 Student');
      expect(heading).toBeVisible();
    });

    it('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
      setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'AVKLAR_SYKDOM' });

      render(<Studentvurdering grunnlag={grunnlagMedVurdering} readOnly={false} behandlingVersjon={0} />);

      const endreKnapp = screen.getByRole('button', { name: 'Endre' });
      await user.click(endreKnapp);

      const begrunnelseFelt = screen.getByRole('textbox', { name: 'Vurder §11-14 og vilkårene i §7 i forskriften' });
      await user.clear(begrunnelseFelt);
      await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');
      expect(begrunnelseFelt).toHaveValue('Dette er en ny begrunnelse');

      const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
      await user.click(avbrytKnapp);

      const begrunnelseFeltEtterAvbryt = screen.getByRole('textbox', {
        name: 'Vurder §11-14 og vilkårene i §7 i forskriften',
      });
      expect(begrunnelseFeltEtterAvbryt).toHaveValue('en god begrunnelse');
    });
  });

  describe('Felter', () => {
    it('har et fritekstfelt for vurdering av vilkåret', () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
      expect(screen.getByRole('textbox', { name: 'Vurder §11-14 og vilkårene i §7 i forskriften' })).toBeVisible();
    });

    it('har et valg for om brukeren har avbrutt et studie', () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
      expect(screen.getByRole('group', { name: 'Har brukeren avbrutt et studie?' })).toBeVisible();
    });

    it('har et valg for om studiet er godkjent av Lånekassen', async () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
      await velgAtSøkerHarAvbruttEtStudie();
      expect(screen.getByRole('group', { name: 'Er studiet godkjent av Lånekassen?' })).toBeVisible();
    });

    it('har et valg for om studie er avbrutt pga sykdom eller skade', async () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
      await velgAtSøkerHarAvbruttEtStudie();
      await velgAtStudieErGodkjentAvLånekassen();
      expect(screen.getByRole('group', { name: 'Er studie avbrutt pga sykdom eller skade?' })).toBeVisible();
    });

    it('har et valg for om brukeren har behov for behandling', async () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
      await velgAtSøkerHarAvbruttEtStudie();
      await velgAtStudieErGodkjentAvLånekassen();
      await velgAtStudieErAvbruttPgaSykdomEllerSkade();
      expect(
        screen.getByRole('group', { name: 'Har brukeren behov for behandling for å gjenoppta studiet?' })
      ).toBeVisible();
    });

    it('har et felt for å sette når studieevnen ble nedsatt fra', async () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
      await velgAtSøkerHarAvbruttEtStudie();
      await velgAtStudieErGodkjentAvLånekassen();
      await velgAtStudieErAvbruttPgaSykdomEllerSkade();
      await velgAtBrukerHarBehovForBehandling();
      await velgAtDetErForventetAtStudieKanGjenopptasInnen6Mnd();
      expect(
        screen.getByRole('textbox', { name: 'Når ble studieevnen 100% nedsatt / når ble studiet avbrutt?' })
      ).toBeVisible();
    });

    it('spør om avbruddet er forventet å vare mer enn 6 mnd', async () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
      await velgAtSøkerHarAvbruttEtStudie();
      await velgAtStudieErGodkjentAvLånekassen();
      await velgAtStudieErAvbruttPgaSykdomEllerSkade();
      await velgAtBrukerHarBehovForBehandling();
      expect(
        screen.getByRole('group', { name: 'Er det forventet at brukeren kan gjenoppta studiet innen 6 måneder?' })
      ).toBeVisible();
    });

    it('viser en feilmelding dersom det ikke er lagt inn en begrunnelse', async () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
      const button = screen.getByRole('button', { name: /Bekreft/ });
      await user.click(button);

      expect(await screen.findByText('Du må gjøre en vilkårsvurdering')).toBeVisible();
    });

    it('viser feilemdling hvis det ikke er svart på om studiet er avbrutt', async () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
      const button = screen.getByRole('button', { name: /Bekreft/ });
      await user.click(button);

      expect(await screen.findByText('Du må svare på om brukeren har avbrutt studie.')).toBeVisible();
    });

    it('viser feilmelding hvis det ikke er svart på om studiet er godkjent av Lånekassen', async () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
      await velgAtSøkerHarAvbruttEtStudie();
      const button = screen.getByRole('button', { name: /Bekreft/ });
      await user.click(button);

      expect(await screen.findByText('Du må svare på om studiet er godkjent av Lånekassen.')).toBeVisible();
    });

    it('viser feilemdling hvis det ikke er svart på om studiet er avbrutt pga sykdom eller skade', async () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
      await velgAtSøkerHarAvbruttEtStudie();
      await velgAtStudieErGodkjentAvLånekassen();

      const button = screen.getByRole('button', { name: /Bekreft/ });
      await user.click(button);

      expect(
        await screen.findByText('Du må svare på om brukeren har avbrutt studie på grunn av sykdom eller skade.')
      ).toBeVisible();
    });

    it('viser feilmelding hvis det ikke er svart på om brukeren trenger behandling for å gjenoppta studiet', async () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);

      await velgAtSøkerHarAvbruttEtStudie();
      await velgAtStudieErGodkjentAvLånekassen();
      await velgAtStudieErAvbruttPgaSykdomEllerSkade();

      const button = screen.getByRole('button', { name: /Bekreft/ });
      await user.click(button);

      expect(
        await screen.findByText('Du må svare på om brukeren har behov for behandling for å gjenoppta studiet.')
      ).toBeVisible();
    });

    it('viser feilmelding hvis det ikke er svart på når studieevnen ble nedsatt', async () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
      await velgAtSøkerHarAvbruttEtStudie();
      await velgAtStudieErGodkjentAvLånekassen();
      await velgAtStudieErAvbruttPgaSykdomEllerSkade();
      await velgAtBrukerHarBehovForBehandling();
      await velgAtDetErForventetAtStudieKanGjenopptasInnen6Mnd();

      const button = screen.getByRole('button', { name: /Bekreft/ });
      await user.click(button);

      expect(
        await screen.findByText('Du må svare på når studieevnen ble 100% nedsatt, eller når studiet ble avbrutt.')
      ).toBeVisible();
    });

    it('viser feilmelding hvis det ikke er svart på om det er forventet at fraværet blir over 6 mnd', async () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
      await velgAtSøkerHarAvbruttEtStudie();
      await velgAtStudieErGodkjentAvLånekassen();
      await velgAtStudieErAvbruttPgaSykdomEllerSkade();
      await velgAtBrukerHarBehovForBehandling();

      const button = screen.getByRole('button', { name: /Bekreft/ });
      await user.click(button);

      expect(
        await screen.findByText('Du må svare på om avbruddet er forventet å vare i mer enn 6 måneder.')
      ).toBeVisible();
    });

    it('skal vise korrekt informasjon fra søknaden dersom det har blitt besvart ja i søknaden', async () => {
      render(
        <Studentvurdering
          behandlingVersjon={0}
          readOnly={false}
          grunnlag={{
            harTilgangTilÅSaksbehandle: true,
            oppgittStudent: { erStudentStatus: 'JA' },
            nyeVurderinger: [],
            sisteVedtatteVurderinger: [],
            behøverVurderinger: [],
            kanVurderes: [],
          }}
        />
      );
      const tekst = screen.getByText('Er brukeren student: Ja, helt eller delvis');
      expect(tekst).toBeVisible();
    });

    it('skal vise korrekt informasjon fra søknaden dersom det har blitt besvart avbrutt i søknaden', async () => {
      render(
        <Studentvurdering
          behandlingVersjon={0}
          readOnly={false}
          grunnlag={{
            harTilgangTilÅSaksbehandle: true,
            oppgittStudent: { erStudentStatus: 'AVBRUTT' },
            nyeVurderinger: [],
            sisteVedtatteVurderinger: [],
            behøverVurderinger: [],
            kanVurderes: [],
          }}
        />
      );
      const tekst = screen.getByText('Er brukeren student: Ja, men har avbrutt studiet helt på grunn av sykdom');
      expect(tekst).toBeVisible();
    });

    it('skal vise korrekt informasjon fra søknaden dersom det har blitt besvart nei i søknaden', async () => {
      render(
        <Studentvurdering
          behandlingVersjon={0}
          readOnly={false}
          grunnlag={{
            harTilgangTilÅSaksbehandle: true,
            oppgittStudent: { erStudentStatus: 'NEI' },
            nyeVurderinger: [],
            sisteVedtatteVurderinger: [],
            behøverVurderinger: [],
            kanVurderes: [],
          }}
        />
      );

      const tekst = screen.getAllByText('Nei')[0]; //TODO Finnes det en smartere måte å gjøre dette på?
      expect(tekst).toBeVisible();
    });

    it('viser feilmelding dersom dato for avbrutt studie settes frem i tid', async () => {
      render(
        <Studentvurdering
          behandlingVersjon={0}
          readOnly={false}
          grunnlag={{
            harTilgangTilÅSaksbehandle: true,
            oppgittStudent: { erStudentStatus: 'AVBRUTT' },
            nyeVurderinger: [],
            sisteVedtatteVurderinger: [],
            behøverVurderinger: [],
            kanVurderes: [],
          }}
        />
      );
      await velgAtSøkerHarAvbruttEtStudie();
      await velgAtStudieErGodkjentAvLånekassen();
      await velgAtStudieErAvbruttPgaSykdomEllerSkade();
      await velgAtBrukerHarBehovForBehandling();
      await velgAtDetErForventetAtStudieKanGjenopptasInnen6Mnd();
      const datoinput = screen.getByRole('textbox', {
        name: 'Når ble studieevnen 100% nedsatt / når ble studiet avbrutt?',
      });
      const imorgen = addDays(new Date(), 1);
      await user.type(datoinput, formaterDatoForFrontend(imorgen));

      const button = screen.getByRole('button', { name: /Bekreft/ });
      await user.click(button);

      expect(
        screen.getByText('Dato for når stuideevnen ble 100% nedsatt / avbrutt kan ikke være frem i tid.')
      ).toBeVisible();
    });

    it('viser feilmelding dersom dato for avbrutt studie er ugyldig', async () => {
      render(
        <Studentvurdering
          behandlingVersjon={0}
          readOnly={false}
          grunnlag={{
            harTilgangTilÅSaksbehandle: true,
            oppgittStudent: { erStudentStatus: 'AVBRUTT' },
            nyeVurderinger: [],
            sisteVedtatteVurderinger: [],
            behøverVurderinger: [],
            kanVurderes: [],
          }}
        />
      );

      await velgAtSøkerHarAvbruttEtStudie();
      await velgAtStudieErGodkjentAvLånekassen();
      await velgAtStudieErAvbruttPgaSykdomEllerSkade();
      await velgAtBrukerHarBehovForBehandling();
      await velgAtDetErForventetAtStudieKanGjenopptasInnen6Mnd();

      const datoinput = screen.getByRole('textbox', {
        name: 'Når ble studieevnen 100% nedsatt / når ble studiet avbrutt?',
      });
      await user.type(datoinput, '19.2022');

      const button = screen.getByRole('button', { name: /Bekreft/ });
      await user.click(button);

      expect(screen.getByText('Datoformatet er ikke gyldig. Dato må være på formatet dd.mm.åååå')).toBeVisible();
    });
  });

  describe('mellomlagring', () => {
    const mellomlagring: MellomlagretVurderingResponse = {
      mellomlagretVurdering: {
        avklaringsbehovkode: '5006',
        behandlingId: { id: 1 },
        data: '{"begrunnelse":"Dette er min vurdering som er mellomlagret"}',
        vurdertDato: '2025-08-21T12:00:00.000',
        vurdertAv: 'Jan T. Loven',
      },
    };

    const grunnlagMedVurdering: StudentGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      nyeVurderinger: [],
      sisteVedtatteVurderinger: [],
      behøverVurderinger: [],
      kanVurderes: [],
      studentvurdering: {
        fom: '2025-01-01',
        begrunnelse: 'Dette er min vurdering som er bekreftet',
        harAvbruttStudie: false,
        vurdertAv: {
          ansattnavn: 'Kjell T. Ringen',
          dato: '2025-08-21',
          enhetsnavn: undefined,
          ident: '',
        },
      },
    };

    const grunnlagUtenVurdering: StudentGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      nyeVurderinger: [],
      sisteVedtatteVurderinger: [],
      behøverVurderinger: [],
      kanVurderes: [],
    };

    it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
      render(
        <Studentvurdering
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );
      const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
      expect(tekst).toBeVisible();
    });

    it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);

      await user.type(
        screen.getByRole('textbox', { name: 'Vurder §11-14 og vilkårene i §7 i forskriften' }),
        'Her har jeg begynt å skrive en vurdering..'
      );
      expect(screen.queryByText('Utkast lagret 21.08.2025 00:00 (Jan T. Loven)')).not.toBeInTheDocument();

      const mockFetchResponseLagreMellomlagring: FetchResponse<MellomlagretVurderingResponse> = {
        type: 'SUCCESS',
        data: mellomlagring,
        status: 200,
      };
      fetchMock.mockResponse(JSON.stringify(mockFetchResponseLagreMellomlagring));

      const lagreKnapp = screen.getByRole('button', { name: 'Lagre utkast' });
      await user.click(lagreKnapp);
      const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
      expect(tekst).toBeVisible();
    });

    it('Skal ikke vise tekst om hvem som har gjort mellomlagring dersom bruker trykker på slett mellomlagring', async () => {
      render(
        <Studentvurdering
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      expect(screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)')).toBeVisible();

      const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
      fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));

      const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });
      await user.click(slettKnapp);

      expect(screen.queryByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)')).not.toBeInTheDocument();
    });

    it('Skal bruke mellomlagring som defaultValue i skjema dersom det finnes', () => {
      render(
        <Studentvurdering
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagMedVurdering}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );
      const begrunnelseFelt = screen.getByRole('textbox', {
        name: 'Vurder §11-14 og vilkårene i §7 i forskriften',
      });

      expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
    });

    it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
      render(<Studentvurdering readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedVurdering} />);

      const begrunnelseFelt = screen.getByRole('textbox', {
        name: 'Vurder §11-14 og vilkårene i §7 i forskriften',
      });

      expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
    });

    it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
      render(
        <Studentvurdering
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagUtenVurdering}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      await user.type(
        screen.getByRole('textbox', { name: 'Vurder §11-14 og vilkårene i §7 i forskriften' }),
        ' her er ekstra tekst'
      );

      expect(screen.getByRole('textbox', { name: 'Vurder §11-14 og vilkårene i §7 i forskriften' })).toHaveValue(
        'Dette er min vurdering som er mellomlagret her er ekstra tekst'
      );

      const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

      await user.click(slettKnapp);

      expect(screen.getByRole('textbox', { name: 'Vurder §11-14 og vilkårene i §7 i forskriften' })).toHaveValue('');
    });

    it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
      render(
        <Studentvurdering
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlagMedVurdering}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );
      await user.type(
        screen.getByRole('textbox', { name: 'Vurder §11-14 og vilkårene i §7 i forskriften' }),
        ' her er ekstra tekst'
      );

      expect(screen.getByRole('textbox', { name: 'Vurder §11-14 og vilkårene i §7 i forskriften' })).toHaveValue(
        'Dette er min vurdering som er mellomlagret her er ekstra tekst'
      );

      const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

      await user.click(slettKnapp);

      expect(screen.getByRole('textbox', { name: 'Vurder §11-14 og vilkårene i §7 i forskriften' })).toHaveValue(
        'Dette er min vurdering som er bekreftet'
      );
    });

    it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
      render(
        <Studentvurdering
          readOnly={true}
          behandlingVersjon={0}
          grunnlag={grunnlagMedVurdering}
          initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        />
      );

      const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
      expect(lagreKnapp).not.toBeInTheDocument();
      const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
      expect(slettKnapp).not.toBeInTheDocument();
    });
  });
});

const velgAtSøkerHarAvbruttEtStudie = async () =>
  await user.click(
    within(screen.getByRole('group', { name: 'Har brukeren avbrutt et studie?' })).getByRole('radio', { name: 'Ja' })
  );

const velgAtStudieErGodkjentAvLånekassen = async () =>
  await user.click(
    within(screen.getByRole('group', { name: 'Er studiet godkjent av Lånekassen?' })).getByRole('radio', {
      name: 'Ja',
    })
  );

const velgAtStudieErAvbruttPgaSykdomEllerSkade = async () =>
  await user.click(
    within(screen.getByRole('group', { name: 'Er studie avbrutt pga sykdom eller skade?' })).getByRole('radio', {
      name: 'Ja',
    })
  );

const velgAtBrukerHarBehovForBehandling = async () =>
  await user.click(
    within(screen.getByRole('group', { name: 'Har brukeren behov for behandling for å gjenoppta studiet?' })).getByRole(
      'radio',
      {
        name: 'Ja',
      }
    )
  );
const velgAtDetErForventetAtStudieKanGjenopptasInnen6Mnd = async () =>
  await user.click(
    within(
      screen.getByRole('group', { name: 'Er det forventet at brukeren kan gjenoppta studiet innen 6 måneder?' })
    ).getByRole('radio', {
      name: 'Ja',
    })
  );
