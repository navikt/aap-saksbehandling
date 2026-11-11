import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { Barnepensjon } from 'components/behandlinger/samordning/barnepensjon/Barnepensjon';
import { customRender } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import { BarnepensjonGrunnlag } from 'lib/types/types';

const grunnlagUtenVurdering: BarnepensjonGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  historiskeVurderinger: [],
  vedtattePerioder: [],
};

describe('Barnepensjon', () => {
  const user = userEvent.setup();

  it('Skal ha et begrunnelsesfelt', async () => {
    customRender(<Barnepensjon behandlingVersjon={1} readOnly={false} grunnlag={grunnlagUtenVurdering} />);
    const felt = screen.getByRole('textbox', { name: 'Vurder samordning med barnepensjon' });
    await trykkPåEndreKnapp();
    expect(felt).toBeVisible();
  });

  it('Skal bli lagt til en rad hvis bruker trykker på "legg til"', async () => {
    customRender(<Barnepensjon behandlingVersjon={1} readOnly={false} grunnlag={grunnlagUtenVurdering} />);
    await trykkPåEndreKnapp();

    expect(screen.queryByRole('cell', { name: 'Barnepensjon' })).not.toBeInTheDocument();
    await leggTilNyPeriode();
    expect(screen.getByRole('cell', { name: 'Barnepensjon' })).toBeVisible();
  });

  it('Skal fjerne raden hvis bruker trykk på "fjern periode"', async () => {
    customRender(<Barnepensjon behandlingVersjon={1} readOnly={false} grunnlag={grunnlagUtenVurdering} />);
    await trykkPåEndreKnapp();
    await leggTilNyPeriode();

    expect(screen.getByRole('cell', { name: 'Barnepensjon' })).toBeVisible();
    const fjernKnapp = screen.getByRole('button', { name: 'Fjern periode' });
    await user.click(fjernKnapp);

    expect(screen.queryByRole('cell', { name: 'Barnepensjon' })).not.toBeInTheDocument();
  });

  it('Skal kreve bekreftelse før en vedtatt rad slettes, men ikke for nye rader', async () => {
    const tidligereVurdering = {
      begrunnelse: 'Tidligere vedtatt samordning',
      perioder: [{ fom: '2025-01', tom: '2025-12', månedsbeløp: { verdi: 1000 } }],
      vurderingerMeta: {},
    };
    const { unmount } = customRender(
      <Barnepensjon
        behandlingVersjon={1}
        readOnly={false}
        grunnlag={{
          ...grunnlagUtenVurdering,
          vurdering: tidligereVurdering,
          vedtattePerioder: tidligereVurdering.perioder,
        }}
      />
    );
    await trykkPåEndreKnapp();
    await leggTilNyPeriode();
    await user.click(screen.getAllByRole('button', { name: 'Fjern periode' })[1]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: 'Barnepensjon' })).toHaveLength(1);

    const tilOgMed = screen.getByRole('textbox', { name: 'Til og med dato for barnepensjon' });
    await user.clear(tilOgMed);
    await user.type(tilOgMed, '06.2025');
    await user.tab();
    await user.click(screen.getByRole('button', { name: 'Fjern periode' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: 'Barnepensjon' })).not.toBeInTheDocument();

    unmount();
    customRender(
      <Barnepensjon
        behandlingVersjon={2}
        readOnly={false}
        grunnlag={{
          ...grunnlagUtenVurdering,
          vedtattePerioder: tidligereVurdering.perioder,
          vurdering: {
            ...tidligereVurdering,
            perioder: [
              ...tidligereVurdering.perioder,
              { fom: '2026-01', tom: '2026-12', månedsbeløp: { verdi: 2000 } },
            ],
          },
        }}
      />
    );
    await trykkPåEndreKnapp();
    await user.click(screen.getAllByRole('button', { name: 'Fjern periode' })[1]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: 'Barnepensjon' })).toHaveLength(1);

    await user.clear(screen.getByRole('spinbutton', { name: 'Hvilken månedsytelse' }));
    await user.type(screen.getByRole('spinbutton', { name: 'Hvilken månedsytelse' }), '2000');
    const rad = screen.getByRole('cell', { name: 'Barnepensjon' });
    await user.click(screen.getByRole('button', { name: 'Fjern periode' }));
    const dialog = screen.getByRole('dialog', { name: 'Slett samordningsperiode' });
    expect(
      within(dialog).getByText(
        'Merk at dette vilkåret gjelder for hele saksperioden. Ikke slett perioder som fremdeles skal være gjeldene tilbake i tid.'
      )
    ).toBeVisible();
    expect(rad).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Avbryt' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Barnepensjon' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Fjern periode' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Slett' }));
    expect(screen.queryByRole('cell', { name: 'Barnepensjon' })).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('Skal ha et felt for å sette fra og med dato for barnepensjon', async () => {
    customRender(<Barnepensjon behandlingVersjon={1} readOnly={false} grunnlag={grunnlagUtenVurdering} />);
    await trykkPåEndreKnapp();
    await leggTilNyPeriode();

    const felt = screen.getByRole('textbox', {
      name: 'Fra og med dato for barnepensjon',
    });

    expect(felt).toBeVisible();
  });

  it('Skal ha et felt for å sette til og med dato for barnepensjon', async () => {
    customRender(<Barnepensjon behandlingVersjon={1} readOnly={false} grunnlag={grunnlagUtenVurdering} />);
    await trykkPåEndreKnapp();
    await leggTilNyPeriode();

    const felt = screen.getByRole('textbox', {
      name: 'Til og med dato for barnepensjon',
    });

    expect(felt).toBeVisible();
  });

  it('Skal ha et felt for å sette månedsytelsen for barnepensjon', async () => {
    customRender(<Barnepensjon behandlingVersjon={1} readOnly={false} grunnlag={grunnlagUtenVurdering} />);
    await trykkPåEndreKnapp();
    await leggTilNyPeriode();

    const felt = screen.getByRole('spinbutton', {
      name: 'Hvilken månedsytelse',
    });

    expect(felt).toBeVisible();
  });

  it('Skal regne ut dagsats basert på månedsytelsen', async () => {
    customRender(<Barnepensjon behandlingVersjon={1} readOnly={false} grunnlag={grunnlagUtenVurdering} />);
    await trykkPåEndreKnapp();
    await leggTilNyPeriode();
    const felt = screen.getByRole('spinbutton', {
      name: 'Hvilken månedsytelse',
    });

    await user.type(felt, '30000');

    const dagSats = screen.getByText('1 385 kr');
    expect(dagSats).toBeVisible();
  });

  describe('validering', () => {
    it('Skal vise en feilmelding hvis begrunnelse ikke er besvart', async () => {
      customRender(<Barnepensjon behandlingVersjon={1} readOnly={false} grunnlag={grunnlagUtenVurdering} />);
      await trykkPåEndreKnapp();
      await trykkPåBekreft();
      screen.logTestingPlaygroundURL();
      const feilmelding = screen.getByRole('link', { name: 'Du må vurdere samordning med barnepensjon.' });
      expect(feilmelding).toBeVisible();
    });

    it('Skal vise feilmelding hvis feltet for fra og med dato ikke er fylt ut', async () => {
      customRender(<Barnepensjon behandlingVersjon={1} readOnly={false} grunnlag={grunnlagUtenVurdering} />);
      await trykkPåEndreKnapp();
      await leggTilNyPeriode();

      await trykkPåBekreft();
      const feilmelding = screen.getByRole('link', { name: 'Du må sette en fra og med dato' });
      expect(feilmelding).toBeVisible();
    });

    it('Skal vise feilmelding hvis feltet for til og med dato ikke er fylt ut', async () => {
      customRender(<Barnepensjon behandlingVersjon={1} readOnly={false} grunnlag={grunnlagUtenVurdering} />);
      await trykkPåEndreKnapp();
      await leggTilNyPeriode();

      await trykkPåBekreft();
      const feilmelding = screen.getByRole('link', { name: 'Du må sette en til og med dato.' });
      expect(feilmelding).toBeVisible();
    });

    it('Skal vise feilmelding hvis feltet for månedsytelse ikke er fylt ut', async () => {
      customRender(<Barnepensjon behandlingVersjon={1} readOnly={false} grunnlag={grunnlagUtenVurdering} />);
      await trykkPåEndreKnapp();
      await leggTilNyPeriode();

      await trykkPåBekreft();
      const feilmelding = screen.getByText('Du må fylle ut månedsytelsen');
      expect(feilmelding).toBeVisible();
    });
  });

  async function trykkPåEndreKnapp() {
    const knapp = screen.getByRole('button', { name: 'Endre' });
    await user.click(knapp);
  }

  async function leggTilNyPeriode() {
    const knapp = screen.getByRole('button', { name: 'Legg til' });
    await user.click(knapp);
  }

  async function trykkPåBekreft() {
    const knapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(knapp);
  }
});
