import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Studentvurdering } from 'components/behandlinger/sykdom/student/student/Studentvurdering';
import { userEvent } from '@testing-library/user-event';
import { addDays } from 'date-fns';
import { formaterDatoForFrontend } from 'lib/utils/date';

const user = userEvent.setup();

describe('Student', () => {
  it('skal ha en overskrift', () => {
    render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
    const heading = screen.getByText('Student - § 11-14');
    expect(heading).toBeVisible();
  });

  it('har et fritekstfelt for vurdering av vilkåret', () => {
    render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
    expect(screen.getByRole('textbox', { name: 'Vurder §11-14 og vilkårene i §7 i forskriften' })).toBeVisible();
  });

  it('har et valg for om søker har avbrutt et studie', () => {
    render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
    expect(screen.getByRole('group', { name: 'Har søker avbrutt et studie?' })).toBeVisible();
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

  it('har et valg for om bruker har behov for behandling', async () => {
    render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
    await velgAtSøkerHarAvbruttEtStudie();
    await velgAtStudieErGodkjentAvLånekassen();
    await velgAtStudieErAvbruttPgaSykdomEllerSkade();
    expect(
      screen.getByRole('group', { name: 'Har bruker behov for behandling for å gjenoppta studiet?' })
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
      screen.getByRole('group', { name: 'Er det forventet at søker kan gjenoppta studiet innen 6 måneder?' })
    ).toBeVisible();
  });

  it('viser en feilmelding dersom det ikke er lagt inn en begrunnelse', async () => {
    render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(await screen.findByText('Du må begrunne vurderingen.')).toBeVisible();
  });

  it('viser feilemdling hvis det ikke er svart på om studiet er avbrutt', async () => {
    render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om søker har avbrutt studie.')).toBeVisible();
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
      await screen.findByText('Du må svare på om søker har avbrutt studie på grunn av sykdom eller skade.')
    ).toBeVisible();
  });

  it('viser feilmelding hvis det ikke er svart på om bruker trenger behandling for å gjenoppta studiet', async () => {
    render(<Studentvurdering readOnly={false} behandlingVersjon={0} />);

    await velgAtSøkerHarAvbruttEtStudie();
    await velgAtStudieErGodkjentAvLånekassen();
    await velgAtStudieErAvbruttPgaSykdomEllerSkade();

    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(
      await screen.findByText('Du må svare på om søker har behov for behandling for å gjenoppta studiet.')
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
        grunnlag={{ oppgittStudent: { erStudentStatus: 'JA' } }}
      />
    );
    const tekst = screen.getByText('Er søker student: Ja, helt eller delvis');
    expect(tekst).toBeVisible();
  });

  it('skal vise korrekt informasjon fra søknaden dersom det har blitt besvart avbrutt i søknaden', async () => {
    render(
      <Studentvurdering
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={{ oppgittStudent: { erStudentStatus: 'AVBRUTT' } }}
      />
    );
    const tekst = screen.getByText('Er søker student: Ja, men har avbrutt studiet helt på grunn av sykdom');
    expect(tekst).toBeVisible();
  });

  it('skal vise korrekt informasjon fra søknaden dersom det har blitt besvart nei i søknaden', async () => {
    render(
      <Studentvurdering
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={{ oppgittStudent: { erStudentStatus: 'NEI' } }}
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
        grunnlag={{ oppgittStudent: { erStudentStatus: 'AVBRUTT' } }}
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
        grunnlag={{ oppgittStudent: { erStudentStatus: 'AVBRUTT' } }}
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

const velgAtSøkerHarAvbruttEtStudie = async () =>
  await user.click(
    within(screen.getByRole('group', { name: 'Har søker avbrutt et studie?' })).getByRole('radio', { name: 'Ja' })
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
    within(screen.getByRole('group', { name: 'Har bruker behov for behandling for å gjenoppta studiet?' })).getByRole(
      'radio',
      {
        name: 'Ja',
      }
    )
  );
const velgAtDetErForventetAtStudieKanGjenopptasInnen6Mnd = async () =>
  await user.click(
    within(
      screen.getByRole('group', { name: 'Er det forventet at søker kan gjenoppta studiet innen 6 måneder?' })
    ).getByRole('radio', {
      name: 'Ja',
    })
  );
