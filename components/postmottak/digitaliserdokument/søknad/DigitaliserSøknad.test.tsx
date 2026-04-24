import { describe, expect, it, vi } from 'vitest';
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

    const yrkeskadeRadio = screen.getByRole('radiogroup', {
      name: /yrkesskade/i,
    });
    expect(yrkeskadeRadio).toBeVisible();
  });
  it('erStudent vises', () => {
    render(<DigitaliserSøknad submit={() => {}} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    const studentRadio = screen.getByRole('radiogroup', {
      name: /Er søkeren student?/i,
    });
    expect(studentRadio).toBeVisible();
  });
  it('studentKommeTilbake hvis studie er avbrutt', async () => {
    render(<DigitaliserSøknad submit={() => {}} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    const studentRadio = screen.getByRole('radiogroup', {
      name: /Er søkeren student?/i,
    });
    await user.click(within(studentRadio).getByText('Avbrutt'));
    const studentAvbruttRadio = screen.getByRole('radiogroup', {
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

  it('fraDatoLocalDate og tilDatoLocalDate er satt i utenlandsopphold ved innsending', async () => {
    const submitMock = vi.fn();
    render(<DigitaliserSøknad submit={submitMock} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    // Søknadsdato
    await user.type(screen.getByRole('textbox', { name: /søknadsdato/i }), '01.01.2024');

    // Yrkesskade
    const yrkesSkadeGruppe = screen.getByRole('radiogroup', { name: /Har søker yrkesskade?/i });
    await user.click(within(yrkesSkadeGruppe).getByText('Nei'));

    // harBoddINorgeSiste5År = Ja → viser harArbeidetINorgeSiste5År og arbeidetUtenforNorgeFørSykdom
    const harBoddGruppe = screen.getByRole('radiogroup', { name: /Har søker bodd sammenhengende i Norge siste 5 år?/i });
    await user.click(within(harBoddGruppe).getByText('Ja'));

    const harArbeidetGruppe = screen.getByRole('radiogroup', {
      name: /Har søker arbeidet sammenhengende i Norge siste 5 år?/i,
    });
    await user.click(within(harArbeidetGruppe).getByText('Nei'));

    // arbeidetUtenforNorgeFørSykdom = Ja → viser "Legg til utenlandsopphold"
    const arbeidetUtenforGruppe = screen.getByRole('radiogroup', {
      name: /Arbeidet søker utenfor Norge de siste fem årene?/i,
    });
    await user.click(within(arbeidetUtenforGruppe).getByText('Ja'));

    // erStudent = Nei
    const erStudentGruppe = screen.getByRole('radiogroup', { name: /Er søkeren student?/i });
    await user.click(within(erStudentGruppe).getByText('Nei'));

    // Legg til utenlandsopphold
    await user.click(screen.getByRole('button', { name: /Legg til utenlandsopphold/i }));

    // Land (combobox)
    const landCombobox = screen.getByRole('combobox', { name: /Land/i });
    await user.click(landCombobox);
    await user.type(landCombobox, 'Sverige');
    await user.click(await screen.findByRole('option', { name: /Sverige/i }));

    // Fra dato
    await user.type(screen.getByRole('textbox', { name: /Fra dato/i }), '01.01.2020');

    // Til dato
    await user.type(screen.getByRole('textbox', { name: /Til dato/i }), '31.12.2020');

    // iArbeid
    const iArbeidGruppe = screen.getByRole('radiogroup', { name: /Var søker i arbeid i utlandet?/i });
    await user.click(within(iArbeidGruppe).getByText('Ja'));

    // Submit
    await user.click(screen.getByRole('button', { name: /Neste/i }));

    expect(submitMock).toHaveBeenCalledOnce();
    const submittedJson = submitMock.mock.calls[0][1];
    const submitted = JSON.parse(submittedJson);
    const opphold = submitted.medlemskap.utenlandsOpphold[0];
    expect(opphold.fraDatoLocalDate).toBe('2020-01-01');
    expect(opphold.tilDatoLocalDate).toBe('2020-12-31');
  });
});
