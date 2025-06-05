import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import { userEvent } from '@testing-library/user-event';
import { BeregningTidspunktGrunnlag } from 'lib/types/types';
import { addDays, format } from 'date-fns';

const grunnlag: BeregningTidspunktGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  skalVurdereYtterligere: true,
};

const user = userEvent.setup();

describe('Generelt', () => {
  it('skal ha korrekt heading for vilkårskortet dersom det ikke skal vurderes ytterligere nedsatt arbeidsevne', () => {
    render(
      <FastsettBeregning
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={{ ...grunnlag, skalVurdereYtterligere: false }}
      />
    );
    const heading = screen.getByText('§ 11-19 Tidspunktet for når arbeidsevnen ble nedsatt, jf. § 11-5');
    expect(heading).toBeVisible();
  });

  it('skal ha korrekt heading for vilkårskortet dersom det skal vurderes ytterligere nedsatt arbeidsevne', () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlag} />);
    const heading = screen.getByText('§ 11-19 Tidspunktet for når arbeidsevnen ble nedsatt, jf. § 11-5 og § 11-28');
    expect(heading).toBeVisible();
  });

  it('skal ha en overskrift for ytterlige nedsatt arbeidsevne', () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlag} />);
    const heading = screen.getByText('Tidspunkt arbeidsevne ble ytterligere nedsatt § 11-28');
    expect(heading).toBeVisible();
  });
});

describe('Felt for å skrive begrunnelse for nedsatt arbeidsevne', () => {
  it('skal være synlig', () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlag} />);
    const felt = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    expect(felt).toBeVisible();
  });

  it('skal vise feilmelding hvis ikke besvart', async () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlag} />);
    await velgBekreft();
    const feilmelding = screen.getByText('Du må skrive en begrunnelse for når bruker fikk nedsatt arbeidsevne');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise feilmelding hvis satt frem i tid', async () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlag} />);

    const nedsattDato = screen.getByRole('textbox', { name: 'Dato når arbeidsevnen ble nedsatt' });

    const imorgen = format(addDays(Date.now(), 1), 'dd.MM.yyyy');
    await user.type(nedsattDato, imorgen);

    await velgBekreft();
    const feilmelding = screen.getByText('Du kan ikke registrere tidspunkt frem i tid.');
    expect(feilmelding).toBeVisible();
  });
});

describe('Felt for å sette dato for nedsatt arbeidsevne', () => {
  it('skal være synlig', () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlag} />);
    const felt = screen.getByRole('textbox', { name: 'Dato når arbeidsevnen ble nedsatt' });
    expect(felt).toBeVisible();
  });

  it('skal vise feilmelding hvis ikke besvart', async () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlag} />);
    await velgBekreft();
    const feilmelding = screen.getAllByText('Du må sette en dato')[0];
    expect(feilmelding).toBeVisible();
  });
});

describe('Felt for å skrive begrunnelse for ytterligere nedsatt arbeidsevne', () => {
  it('skal være synlig dersom flagget for å vurdere ytterligere nedsatt arbeidsevne er satt til true', () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlag} />);
    const felt = screen.getByRole('textbox', { name: 'Vurder når bruker fikk ytterligere nedsatt arbeidsevne' });
    expect(felt).toBeVisible();
  });

  it('skal vise feilmelding hvis ikke besvart', async () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlag} />);
    await velgBekreft();
    const feilmelding = screen.getByText(
      'Du må skrive en begrunnelse for når bruker fikk ytterligere nedsatt arbeidsevne'
    );
    expect(feilmelding).toBeVisible();
  });
});
describe('Felt for å sette dato for ytterligere nedsatt arbeidsevne', () => {
  it('skal være synlig dersom flagget for å vurdere ytterligere nedsatt arbeidsevne er satt til true', () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlag} />);
    const felt = screen.getByRole('textbox', { name: 'Dato arbeidsevnen ble ytterligere nedsatt' });
    expect(felt).toBeVisible();
  });

  it('skal vise feilmelding hvis ikke besvart', async () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlag} />);
    await velgBekreft();
    const feilmelding = screen.getAllByText('Du må sette en dato')[0];
    expect(feilmelding).toBeVisible();
  });

  it('skal vise feilmelding dersom ytterligere nedsatt dato er før datoen arbeidsevnen ble nedsatt', async () => {
    render(<FastsettBeregning readOnly={false} behandlingVersjon={0} grunnlag={grunnlag} />);
    const nedsattDato = screen.getByRole('textbox', { name: 'Dato når arbeidsevnen ble nedsatt' });
    await user.type(nedsattDato, '11.11.2011');

    const ytterligereNedsattDato = screen.getByRole('textbox', { name: 'Dato arbeidsevnen ble ytterligere nedsatt' });
    await user.type(ytterligereNedsattDato, '11.11.2010');

    await velgBekreft();
    const feilmelding = screen.getByText('Ytterligere nedsatt dato kan ikke være før datoen arbeidsevnen ble nedsatt');
    expect(feilmelding).toBeVisible();
  });
});

async function velgBekreft() {
  const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
  await user.click(bekreftKnapp);
}
