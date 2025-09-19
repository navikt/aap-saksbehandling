import { describe, expect, it } from 'vitest';
import { DigitaliserSøknad } from './DigitaliserSøknad';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DigitaliseringsGrunnlag } from 'lib/types/postmottakTypes';

const grunnlag: DigitaliseringsGrunnlag = {
  erPapir: false,
  klagebehandlinger: [],
  vurdering: {
    kategori: 'SØKNAD',
    strukturertDokumentJson: '{}',
  },
};
describe('DigitaliserSøknad', () => {
  const user = userEvent.setup();

  it('yrkesskade vises', () => {
    render(<DigitaliserSøknad submit={() => {}} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    const yrkeskadeRadio = screen.getByRole('group', {
      name: /yrkesskade/i,
    });
    expect(yrkeskadeRadio).toBeVisible();
  });
  it('erStudent vises', () => {
    render(<DigitaliserSøknad submit={() => {}} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    const studentRadio = screen.getByRole('group', {
      name: /Er søkeren student?/i,
    });
    expect(studentRadio).toBeVisible();
  });
  it('studentKommeTilbake hvis studie er avbrutt', async () => {
    render(<DigitaliserSøknad submit={() => {}} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    const studentRadio = screen.getByRole('group', {
      name: /Er søkeren student?/i,
    });
    await user.click(within(studentRadio).getByText('Avbrutt'));
    const studentAvbruttRadio = screen.getByRole('group', {
      name: /Skal søkeren tilbake til studiet?/i,
    });
    expect(studentAvbruttRadio).toBeVisible();
  });
  it('legg til barn og sjekk at felter dukker opp', async () => {
    render(<DigitaliserSøknad submit={() => {}} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    const leggTilBarnKnapp = screen.getByRole('button', { name: /legg til/i });
    await user.click(leggTilBarnKnapp);

    expect(screen.getByRole('textbox', { name: /fødselsnummer/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /fornavn/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /etternavn/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /fødselsdato/i })).toBeVisible();
    expect(screen.getByRole('combobox', { name: /relasjon/i })).toBeVisible();
  });

  it('input-felt for ident skal forsvinne når mangler ident-checkbox er huket av', async () => {
    render(<DigitaliserSøknad submit={() => {}} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    const leggTilBarnKnapp = screen.getByRole('button', { name: /legg til/i });
    await user.click(leggTilBarnKnapp);

    const manglerIdentButton = screen.getByText('Barn mangler fødselsnummer og D-nummer');
    await user.click(manglerIdentButton);

    expect(screen.queryByText('Fødselsnummer eller D-nummer')).not.toBeInTheDocument();

    await user.click(manglerIdentButton);
    expect(screen.getByText('Fødselsnummer eller D-nummer')).toBeVisible();
  });

  it('legg til barn og sjekk at det kan slettes igjen', async () => {
    render(<DigitaliserSøknad submit={() => {}} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    const leggTilBarnKnapp = screen.getByRole('button', { name: /legg til/i });
    await user.click(leggTilBarnKnapp);

    const slettKnapp = screen.getByRole('img', { name: /Fjern barn/i });
    await user.click(slettKnapp);
  });
});
