import {userEvent} from "@testing-library/user-event";
import { describe, expect, it} from "vitest";
import {render, screen} from "@testing-library/react";
import {
  MedlemskapVedSøknadstidspunkt
} from "components/behandlinger/lovvalg/medlemskapvedsøknadstidspunkt/MedlemskapVedSøknadstidspunkt";

const user = userEvent.setup();
describe('Medlemskap ved søknadstidspunkt', () => {
  it('Skal ha en overskrift', () => {
    render(<MedlemskapVedSøknadstidspunkt readOnly={false} behandlingVersjon={0} />);
    const heading = screen.getByText('Medlemskap ved søknadstidspunkt');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(<MedlemskapVedSøknadstidspunkt readOnly={false} behandlingVersjon={0} />);
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder brukerens medlemskap på søknadstidspunktet' });
    expect(begrunnelse).toBeVisible();
  });


  it('Skal ha felt for lovvalg', () => {
    render(<MedlemskapVedSøknadstidspunkt readOnly={false} behandlingVersjon={0} />);
    const felt = screen.getByRole('group', {
      name: 'Var brukeren medlem av folketrygden ved søknadstidspunktet?',
    });
    expect(felt).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet for begrunnelse ikke er besvart', async () => {
    render(<MedlemskapVedSøknadstidspunkt readOnly={false} behandlingVersjon={0} />);
    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må begrunne medlemskap på søknadstidspunktet');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om medlemskap ikke er besvart', async () => {
    render(<MedlemskapVedSøknadstidspunkt readOnly={false} behandlingVersjon={0} />);
    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må velg om brukeren var medlem av folketrygden på søknadstidspunkt');
    expect(feilmelding).toBeVisible();
  });

});

const trykkPåBekreft = async () => await user.click(screen.getByRole('button', { name: 'Bekreft' }));
