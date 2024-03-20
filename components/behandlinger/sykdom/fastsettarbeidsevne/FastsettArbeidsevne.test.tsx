import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('FastsettArbeidsevne', () => {
  beforeEach(() => {
    render(<FastsettArbeidsevne behandlingsReferanse={'1234'} />);
  });
  const user = userEvent.setup();

  it('Skal ha riktig heading', () => {
    const heading = screen.getByText('Reduksjon ved delvis nedsatt arbeidsevne - § 11-23 2.ledd');
    expect(heading).toBeVisible();
  });

  it('Steget skal være default lukket', () => {
    const textbox = screen.queryByRole('textbox', {
      name: /Hvor stor er arbeidsevnen sett opp mot en arbeidsuke på 37,5 timer/i,
    });
    expect(textbox).toBeNull();
  });

  it('Skal ha synlig vilkårsveiledning', async () => {
    await åpneVilkårskort();
    const vilkårsveiledning = screen.getByText('Slik vurderes vilkåret');
    expect(vilkårsveiledning).toBeVisible();
  });

  it('Skal ha feltet begrunnelse', async () => {
    await åpneVilkårskort();
    const textbox = screen.getByRole('textbox', { name: /Vurder om brukeren har arbeidsevne/i });
    expect(textbox).toBeVisible();
  });
  it('Begrunnelse skal ha feilmelding dersom ikke fyllt ut', async () => {
    await åpneVilkårskort();
    await lagreArbeidsevnePeriode();

    const errorText = await screen.findByText('Du må begrunne avgjørelsen din.');
    expect(errorText).toBeVisible();

    const textbox = screen.getByRole('textbox', { name: /Vurder om brukeren har arbeidsevne/i });
    expect(textbox).toBeInvalid();
  });
  it('Skal ha feltet dokumenterBruktIVurderingen', async () => {
    await åpneVilkårskort();
    const checkboxGroup = await screen.findByRole('group', { name: 'Dokumenter funnet som er relevant for vurdering' });
    expect(checkboxGroup).toBeVisible();
  });
  it('Skal ha feltet arbeidsevne (timer)', async () => {
    await åpneVilkårskort();
    const textbox = screen.getByRole('textbox', {
      name: /Hvor stor er arbeidsevnen sett opp mot en arbeidsuke på 37,5 timer/i,
    });
    expect(textbox).toBeVisible();
  });
  it('Arbeidsevne skal ha feilmelding dersom ikke fyllt ut', async () => {
    await åpneVilkårskort();
    await lagreArbeidsevnePeriode();

    const errorText = await screen.findByText('Du må angi en arbeidsevne.');
    expect(errorText).toBeVisible();

    const textbox = screen.getByRole('textbox', {
      name: /Hvor stor er arbeidsevnen sett opp mot en arbeidsuke på 37,5 timer/i,
    });
    expect(textbox).toBeInvalid();
  });
  it('Skal ha feltet arbeidsevne (prosent)', async () => {
    await åpneVilkårskort();
    const toggle = screen.getByRole('radio', { name: /Prosent/i });
    await user.click(toggle);
    const textbox = screen.getByRole('textbox', {
      name: /Hvor stor er arbeidsevnen i prosent?/i,
    });
    expect(textbox).toBeVisible();
  });
  it('Skal ha feltet fraDato', async () => {
    await åpneVilkårskort();
    const textbox = screen.getByRole('textbox', { name: /Arbeidsevnen gjelder fra og med/i });
    expect(textbox).toBeVisible();
  });
  it('Fradato skal ha feilmelding dersom ikke fyllt ut', async () => {
    await åpneVilkårskort();
    await lagreArbeidsevnePeriode();

    const errorText = await screen.findByText('Du må angi når perioden med arbeidsevne starter.');
    expect(errorText).toBeVisible();

    const textbox = screen.getByRole('textbox', { name: /Arbeidsevnen gjelder fra og med/i });
    expect(textbox).toBeInvalid();
  });
  async function lagreArbeidsevnePeriode() {
    const button = screen.getByRole('button', { name: /lagre/i });
    await user.click(button);
  }
  async function åpneVilkårskort() {
    const region = screen.getByRole('region', { name: /Reduksjon ved delvis nedsatt arbeidsevne - § 11-23 2.ledd/i });
    const button = within(region).getByRole('button');
    await user.click(button);
  }
});
