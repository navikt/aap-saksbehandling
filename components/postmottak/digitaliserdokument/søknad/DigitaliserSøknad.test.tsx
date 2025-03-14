import { describe, expect, it } from 'vitest';
import { DigitaliserSøknad } from './DigitaliserSøknad';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DigitaliseringsGrunnlag } from 'lib/types/postmottakTypes';

const grunnlag: DigitaliseringsGrunnlag = {
  erPapir: false,
  vurdering: {
    kategori: 'SØKNAD',
    strukturertDokumentJson: '{}',
  },
};
describe('DigitaliserSøknad', () => {
  const user = userEvent.setup();

  it('yrkesskade vises', () => {
    render(<DigitaliserSøknad submit={() => {}} grunnlag={grunnlag} readOnly={false} />);

    const yrkeskadeRadio = screen.getByRole('group', {
      name: /yrkesskade/i,
    });
    expect(yrkeskadeRadio).toBeVisible();
  });
  it('erStudent vises', () => {
    render(<DigitaliserSøknad submit={() => {}} grunnlag={grunnlag} readOnly={false} />);

    const studentRadio = screen.getByRole('group', {
      name: /Er brukeren student?/i,
    });
    expect(studentRadio).toBeVisible();
  });
  it('studentKommeTilbake hvis studie er avbrutt', async () => {
    render(<DigitaliserSøknad submit={() => {}} grunnlag={grunnlag} readOnly={false} />);

    const studentRadio = screen.getByRole('group', {
      name: /Er brukeren student?/i,
    });
    await user.click(within(studentRadio).getByText('Avbrutt'));
    const studentAvbruttRadio = screen.getByRole('group', {
      name: /Skal studenten tilbake til studiet?/i,
    });
    expect(studentAvbruttRadio).toBeVisible();
  });
  it('legg til barn og sjekk at felter dukker opp', async () => {
    render(<DigitaliserSøknad submit={() => {}} grunnlag={grunnlag} readOnly={false} />);

    const leggTilBarnKnapp = screen.getByRole('button', { name: /legg til/i });
    await user.click(leggTilBarnKnapp);

    expect(screen.getByRole('textbox', { name: /fødselsnummer/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /fornavn/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /etternavn/i })).toBeVisible();
    expect(screen.getByRole('combobox', { name: /relasjon/i })).toBeVisible();
  });

  it('legg til barn og sjekk at det kan slettes igjen', async () => {
    render(<DigitaliserSøknad submit={() => {}} grunnlag={grunnlag} readOnly={false} />);

    const leggTilBarnKnapp = screen.getByRole('button', { name: /legg til/i });
    await user.click(leggTilBarnKnapp);

    const slettKnapp = screen.getByRole('img', { name: /Slett/i });
    await user.click(slettKnapp);
  });
});
