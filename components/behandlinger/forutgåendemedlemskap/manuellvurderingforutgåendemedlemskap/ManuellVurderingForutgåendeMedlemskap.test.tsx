import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ForutgåendeMedlemskapGrunnlag } from 'lib/types/types';
import { ManuellVurderingForutgåendeMedlemskap } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingforutgåendemedlemskap/ManuellVurderingForutgåendeMedlemskap';

const user = userEvent.setup();
const grunnlag: ForutgåendeMedlemskapGrunnlag = { historiskeManuelleVurderinger: [] };
describe('Lovvalg og medlemskap ved søknadstidspunkt', () => {
  it('Skal ha en overskrift', () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
      />
    );
    const heading = screen.getByText('§ 11-2 Forutgående medlemskap');
    expect(heading).toBeVisible();
  });

  it('Skal ha riktig overskrift ved overstyring', () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={true}
      />
    );
    const heading = screen.getByText('Overstyring § 11-2 Forutgående medlemskap');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
      />
    );
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' });
    expect(begrunnelse).toBeVisible();
  });

  it('Skal ha felt for forutgående medlemskap', () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
      />
    );
    const felt = screen.getByRole('group', {
      name: 'Har brukeren fem års forutgående medlemskap i folketrygden jamfør § 11-2?',
    });
    expect(felt).toBeVisible();
  });

  it('skjuler felt for unntaksvilkår hvis forutgående medlemskap er Ja', async () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
      />
    );
    const forutgående = screen.getByRole('group', {
      name: 'Har brukeren fem års forutgående medlemskap i folketrygden jamfør § 11-2?',
    });
    expect(forutgående).toBeVisible();
    await user.click(within(forutgående).getByRole('radio', { name: 'Ja' }));
    const lovvalgsland = screen.queryByRole('group', {
      name: 'Oppfyller brukeren noen av unntaksvilkårene?',
    });
    expect(lovvalgsland).not.toBeInTheDocument();
  });

  it('viser felt for unntaksvilkår hvis forutgående medlemskap er Nei', async () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
      />
    );
    const forutgående = screen.getByRole('group', {
      name: 'Har brukeren fem års forutgående medlemskap i folketrygden jamfør § 11-2?',
    });
    expect(forutgående).toBeVisible();
    await user.click(within(forutgående).getByRole('radio', { name: 'Nei' }));

    const lovvalgsland = screen.queryByRole('group', {
      name: 'Oppfyller brukeren noen av unntaksvilkårene?',
    });
    expect(lovvalgsland).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet for begrunnelse ikke er besvart', async () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
      />
    );
    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må gi en begrunnelse på brukerens forutgående medlemskap');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om forutgående medlemskap ikke er besvart', async () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
      />
    );
    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må velge om bruker har fem års forutgående medlemskap');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise feilmelding for unntaksvilkår hvis forutgående medlemskap er Nei og unntaksvilkår ikke er besvart', async () => {
    render(
      <ManuellVurderingForutgåendeMedlemskap
        overstyring={false}
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
      />
    );
    const forutgående = screen.getByRole('group', {
      name: 'Har brukeren fem års forutgående medlemskap i folketrygden jamfør § 11-2?',
    });
    expect(forutgående).toBeVisible();
    await user.click(within(forutgående).getByRole('radio', { name: 'Nei' }));

    await trykkPåBekreft();

    const feilmelding = screen.getByText('Du må svare på om bruker oppfyller noen av unntaksvilkårene');
    expect(feilmelding).toBeVisible();
  });
});

const trykkPåBekreft = async () => await user.click(screen.getByRole('button', { name: 'Bekreft' }));
