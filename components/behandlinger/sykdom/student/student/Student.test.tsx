import { render, screen } from '@testing-library/react';
import { Student } from 'components/behandlinger/sykdom/student/student/Student';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

describe('Student', () => {
  it('skal ha en overskrift', () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    const heading = screen.getByText('Student - § 11-14');
    expect(heading).toBeVisible();
  });

  it('viser informasjon om at bruker har svart at de studerer i søknaden', () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    expect(screen.getByText('Har søker oppgitt at hen har avbrutt studiet helt pga sykdom?')).toBeVisible();
  });

  it('har en liste over dokumenter som kan tilknyttes vurderingen', () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    const tilknyttedeDokumenterListe = screen.getByRole('group', {
      name: 'Dokumenter funnet som er relevante for vurdering av student §11-14',
    });
    expect(tilknyttedeDokumenterListe).toBeVisible();
  });

  it('listen over dokumenter som kan knyttes til saken har korrekt beskrivelse', () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    expect(screen.getByText('Les dokumentene og tilknytt minst ett dokument til 11-14 vurderingen.')).toBeVisible();
  });

  it('har et fritekstfelt for vurdering av vilkåret', () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    expect(screen.getByRole('textbox', { name: 'Vurder §11-14 og vilkårene i §7 i forskriften' })).toBeVisible();
  });

  it('har et valg for om søker har avbrutt et studie', () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    expect(
      screen.getByRole('group', { name: 'Har søker avbrutt et studie som er godkjent av Lånekassen?' })
    ).toBeVisible();
  });

  it('har et valg for om studie er avbrutt pga sykdom eller skade som krever behandling', () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    expect(
      screen.getByRole('group', { name: 'Er studie avbrutt pga sykdom eller skade som krever behandling?' })
    ).toBeVisible();
  });

  it('har et valg for om bruker har behov for behandling', () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    expect(screen.getByRole('group', { name: 'Har bruker behov for behandling?' })).toBeVisible();
  });

  it('har et felt for å sette når studieevnen ble nedsatt fra', () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    expect(
      screen.getByRole('textbox', { name: 'Når ble studieevnen 100% nedsatt / når ble studiet avbrutt?' })
    ).toBeVisible();
  });

  it('spør om avbruddet er forventet å vare mer enn 6 mnd', () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    expect(screen.getByRole('group', { name: 'Er avbruddet forventet å vare mer enn 6 mnd?' })).toBeVisible();
  });

  it('viser en feilmelding dersom det ikke er lagt inn en begrunnelse', async () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(await screen.findByText('Du må begrunne vurderingen.')).toBeVisible();
  });

  it('viser feilemdling hvis det ikke er svart på om studiet er avbrutt', async () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om søker har avbrutt studie.')).toBeVisible();
  });

  it('viser feilemdling hvis det ikke er svart på om studiet er avbrutt pga sykdom eller skade', async () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(
      await screen.findByText(
        'Du må svare på om søker har avbrutt studie på grunn av sykdom eller skade som krever behandling.'
      )
    ).toBeVisible();
  });

  it('viser feilmelding hvis det ikke er svart på om bruker trenger behandling', async () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(await screen.findByText('Du må svare på om søker har behov for behandling.')).toBeVisible();
  });

  it('viser feilmelding hvis det ikke er svart på når studieevnen ble nedsatt', async () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(
      await screen.findByText('Du må svare på når studieevnen ble 100% nedsatt, eller når studiet ble avbrutt.')
    ).toBeVisible();
  });

  it('viser feilmelding hvis det ikke er svart på om det er forventet at fraværet blir over 6 mnd', async () => {
    render(<Student readOnly={false} behandlingVersjon={0} />);
    const button = screen.getByRole('button', { name: /Bekreft/ });
    await user.click(button);

    expect(
      await screen.findByText('Du må svare på om avbruddet er forventet å vare i mer enn 6 måneder.')
    ).toBeVisible();
  });
});
