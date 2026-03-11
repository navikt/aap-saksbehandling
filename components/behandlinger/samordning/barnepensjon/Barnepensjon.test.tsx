import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Barnepensjon } from 'components/behandlinger/samordning/barnepensjon/Barnepensjon';
import { customRender } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import { BarnepensjonGrunnlag } from 'lib/types/types';

const grunnlagUtenVurdering: BarnepensjonGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  historiskeVurderinger: [],
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
