import {userEvent} from "@testing-library/user-event";
import { describe, expect, it} from "vitest";
import {render, screen, within} from "@testing-library/react";
import {
  LovvalgVedSøknadstidspunkt
} from "components/behandlinger/lovvalg/lovvalgvedsøknadstidspunkt/LovvalgVedSøknadstidspunkt";

const user = userEvent.setup();
describe('Lovvalg ved søknadstidspunkt', () => {
  it('Skal ha en overskrift', () => {
    render(<LovvalgVedSøknadstidspunkt readOnly={false} behandlingVersjon={0} />);
    const heading = screen.getByText('Lovvalg ved søknadstidspunkt');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(<LovvalgVedSøknadstidspunkt readOnly={false} behandlingVersjon={0} />);
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder riktig lovvalg ved søknadstidspunkt' });
    expect(begrunnelse).toBeVisible();
  });


  it('Skal ha felt for lovvalg', () => {
    render(<LovvalgVedSøknadstidspunkt readOnly={false} behandlingVersjon={0} />);
    const felt = screen.getByRole('group', {
      name: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
    });
    expect(felt).toBeVisible();
  });


  it('skjuler felt for lovvalgsland hvis lovvalg ikke er Annet land med avtale', async () => {
    render(<LovvalgVedSøknadstidspunkt readOnly={false} behandlingVersjon={0} />);
    const lovvalg = screen.getByRole('group', {
      name: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
    });
    expect(lovvalg).toBeVisible();
    await user.click(within(lovvalg).getByRole('radio', { name: 'Norge' }));
    const lovvalgsland = screen.queryByRole('group', {
      name: 'Velg land som vi vurderer som lovvalgsland',
    });
    expect(lovvalgsland).not.toBeInTheDocument();
  });

  it('viser felt for lovvalgsland hvis lovvalg er Annet land med avtale', async () => {
    render(<LovvalgVedSøknadstidspunkt readOnly={false} behandlingVersjon={0} />);
    const lovvalg = screen.getByRole('group', {
      name: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
    });
    expect(lovvalg).toBeVisible();
    await user.click(within(lovvalg).getByRole('radio', { name: 'Annet land med avtale' }));

    const lovvalgsland = screen.queryByRole('group', {
      name: 'Velg land som vi vurderer som lovvalgsland',
    });
    expect(lovvalgsland).not.toBeInTheDocument();
  });

  it('Skal vise feilmelding dersom feltet for begrunnelse ikke er besvart', async () => {
    render(<LovvalgVedSøknadstidspunkt readOnly={false} behandlingVersjon={0} />);
    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må gi en begrunnelse på lovvalg ved søknadstidspunkt');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om lovvalg ikke er besvart', async () => {
    render(<LovvalgVedSøknadstidspunkt readOnly={false} behandlingVersjon={0} />);
    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må velge riktig lovvalg ved søknadstidspunkt');
    expect(feilmelding).toBeVisible();
  });

});

const trykkPåBekreft = async () => await user.click(screen.getByRole('button', { name: 'Bekreft' }));
