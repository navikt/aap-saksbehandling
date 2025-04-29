import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import { LovvalgOgMedlemskapVedSKnadstidspunkt } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunkt';
import { LovvalgMedlemskapGrunnlag } from 'lib/types/types';

const user = userEvent.setup();
const grunnlag: LovvalgMedlemskapGrunnlag = { harTilgangTilÅSaksbehandle: true, historiskeManuelleVurderinger: [] };
describe('Lovvalg og medlemskap ved søknadstidspunkt', () => {
  it('Skal ha en overskrift', () => {
    render(
      <LovvalgOgMedlemskapVedSKnadstidspunkt
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
      />
    );
    const heading = screen.getByText('Lovvalg og medlemskap ved søknadstidspunkt');
    expect(heading).toBeVisible();
  });

  it('Skal ha riktig overskrift ved overstyring', () => {
    render(
      <LovvalgOgMedlemskapVedSKnadstidspunkt
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={true}
      />
    );
    const heading = screen.getByText('Overstyring av lovvalg og medlemskap ved søknadstidspunkt');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(
      <LovvalgOgMedlemskapVedSKnadstidspunkt
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
      />
    );
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder riktig lovvalg ved søknadstidspunkt' });
    expect(begrunnelse).toBeVisible();
  });

  it('Skal ha felt for lovvalg', () => {
    render(
      <LovvalgOgMedlemskapVedSKnadstidspunkt
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
      />
    );
    const felt = screen.getByRole('group', {
      name: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
    });
    expect(felt).toBeVisible();
  });

  it('skjuler felt for lovvalgsland hvis lovvalg ikke er Annet land med avtale', async () => {
    render(
      <LovvalgOgMedlemskapVedSKnadstidspunkt
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
      />
    );
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
    render(
      <LovvalgOgMedlemskapVedSKnadstidspunkt
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
      />
    );
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
    render(
      <LovvalgOgMedlemskapVedSKnadstidspunkt
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
      />
    );
    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må gi en begrunnelse på lovvalg ved søknadstidspunkt');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om lovvalg ikke er besvart', async () => {
    render(
      <LovvalgOgMedlemskapVedSKnadstidspunkt
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
      />
    );
    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må velge riktig lovvalg ved søknadstidspunkt');
    expect(feilmelding).toBeVisible();
  });

  it('viser felt medlemskapbegrunnelse og vurdering hvis Norge er valgt', async () => {
    render(
      <LovvalgOgMedlemskapVedSKnadstidspunkt
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
      />
    );
    const lovvalg = screen.getByRole('group', {
      name: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
    });
    expect(lovvalg).toBeVisible();
    await user.click(within(lovvalg).getByRole('radio', { name: 'Norge' }));

    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder brukerens medlemskap på søknadstidspunktet' });
    const medlemskap = screen.getByRole('group', {
      name: 'Var brukeren medlem av folketrygden ved søknadstidspunktet?',
    });
    expect(begrunnelse).toBeVisible();
    expect(medlemskap).toBeVisible();
  });

  it('skjuler felt for medlemskapsbegrunnelse hvis lovvalgsland er Annet land med avtale', async () => {
    render(
      <LovvalgOgMedlemskapVedSKnadstidspunkt
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
      />
    );
    const lovvalg = screen.getByRole('group', {
      name: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
    });
    expect(lovvalg).toBeVisible();
    await user.click(within(lovvalg).getByRole('radio', { name: 'Annet land med avtale' }));
    const begrunnelse = screen.queryByRole('textbox', { name: 'Vurder brukerens medlemskap på søknadstidspunktet' });
    const medlemskap = screen.queryByRole('group', {
      name: 'Var brukeren medlem av folketrygden ved søknadstidspunktet?',
    });
    expect(begrunnelse).not.toBeInTheDocument();
    expect(medlemskap).not.toBeInTheDocument();
  });

  it('Skal vise feilmelding dersom feltet for begrunnelse ikke er besvart', async () => {
    render(
      <LovvalgOgMedlemskapVedSKnadstidspunkt
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
      />
    );
    const lovvalg = screen.getByRole('group', {
      name: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
    });
    await user.click(within(lovvalg).getByRole('radio', { name: 'Norge' }));
    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må begrunne medlemskap på søknadstidspunktet');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om medlemskap ikke er besvart', async () => {
    render(
      <LovvalgOgMedlemskapVedSKnadstidspunkt
        erAktivtSteg={true}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
      />
    );
    const lovvalg = screen.getByRole('group', {
      name: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
    });
    await user.click(within(lovvalg).getByRole('radio', { name: 'Norge' }));
    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må velg om brukeren var medlem av folketrygden på søknadstidspunkt');
    expect(feilmelding).toBeVisible();
  });
});

const trykkPåBekreft = async () => await user.click(screen.getByRole('button', { name: 'Bekreft' }));
