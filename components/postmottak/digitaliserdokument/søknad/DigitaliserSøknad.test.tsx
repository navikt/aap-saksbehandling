import { describe, expect, it, vi, vitest } from 'vitest';
import { DigitaliserSøknad } from './DigitaliserSøknad';
import { userEvent } from '@testing-library/user-event';
import { DigitaliseringsGrunnlag } from 'lib/types/postmottakTypes';
import { render, screen, within } from 'lib/test/CustomRender';

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
  const velgSvar = async (spørsmål: string, svar: string) => {
    const radiogruppe = screen.getByRole('radiogroup', { name: spørsmål });
    await user.click(within(radiogruppe).getByText(svar));
  };

  it('yrkesskade vises', () => {
    render(<DigitaliserSøknad submit={vitest.fn()} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    const yrkeskadeRadio = screen.getByRole('radiogroup', {
      name: 'Har brukeren oppgitt at de har en relevant yrkesskade?',
    });
    expect(yrkeskadeRadio).toBeVisible();
  });
  it('erStudent vises', () => {
    render(<DigitaliserSøknad submit={vitest.fn()} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    const studentRadio = screen.getByRole('radiogroup', {
      name: 'Har brukeren oppgitt at de er student?',
    });
    expect(studentRadio).toBeVisible();
  });
  it('studentKommeTilbake hvis studie er avbrutt', async () => {
    render(<DigitaliserSøknad submit={vitest.fn()} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    const studentRadio = screen.getByRole('radiogroup', {
      name: 'Har brukeren oppgitt at de er student?',
    });
    await user.click(within(studentRadio).getByText('Ja, og at de har avbrutt studiet'));
    const studentAvbruttRadio = screen.getByRole('radiogroup', {
      name: /Skal søkeren tilbake til studiet?/i,
    });
    expect(studentAvbruttRadio).toBeVisible();
  });

  it('legg til barn og sjekk at felter dukker opp', async () => {
    render(<DigitaliserSøknad submit={vitest.fn()} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    const leggTilBarnKnapp = screen.getByRole('button', { name: 'Legg til barn' });
    await user.click(leggTilBarnKnapp);

    expect(screen.getByRole('textbox', { name: /fødselsnummer/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /fornavn/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /etternavn/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /fødselsdato/i })).toBeVisible();
    expect(screen.getByRole('combobox', { name: /relasjon/i })).toBeVisible();
  });

  it('input-felt for ident skal forsvinne når mangler ident-checkbox er huket av', async () => {
    render(<DigitaliserSøknad submit={vitest.fn()} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    const leggTilBarnKnapp = screen.getByRole('button', { name: /legg til/i });
    await user.click(leggTilBarnKnapp);

    const manglerIdentButton = screen.getByText('Barn mangler fødselsnummer og D-nummer');
    await user.click(manglerIdentButton);

    expect(screen.queryByText('Fødselsnummer eller D-nummer')).not.toBeInTheDocument();

    await user.click(manglerIdentButton);
    expect(screen.getByText('Fødselsnummer eller D-nummer')).toBeVisible();
  });

  it('spør om arbeid utenfor Norge når brukeren har bodd i Norge', async () => {
    render(<DigitaliserSøknad submit={vitest.fn()} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    await velgSvar('Har brukeren oppgitt at de har bodd sammenhengende i Norge siste 5 år?', 'Ja');

    expect(
      screen.getByRole('radiogroup', { name: 'Har brukeren oppgitt at de har arbeidet utenfor Norge siste 5 år?' })
    ).toBeVisible();
    expect(
      screen.queryByRole('radiogroup', {
        name: 'Har brukeren oppgitt at de har arbeidet sammenhengende i Norge siste 5 år?',
      })
    ).not.toBeInTheDocument();
  });

  it('spør om arbeid i Norge når brukeren ikke har bodd i Norge', async () => {
    render(<DigitaliserSøknad submit={vitest.fn()} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    await velgSvar('Har brukeren oppgitt at de har bodd sammenhengende i Norge siste 5 år?', 'Nei');

    expect(
      screen.getByRole('radiogroup', {
        name: 'Har brukeren oppgitt at de har arbeidet sammenhengende i Norge siste 5 år?',
      })
    ).toBeVisible();
    expect(
      screen.queryByRole('radiogroup', { name: 'Har brukeren oppgitt at de har arbeidet utenfor Norge siste 5 år?' })
    ).not.toBeInTheDocument();
  });

  it('spør om arbeid utenfor Norge i tillegg når brukeren har arbeidet i Norge', async () => {
    render(<DigitaliserSøknad submit={vitest.fn()} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    await velgSvar('Har brukeren oppgitt at de har bodd sammenhengende i Norge siste 5 år?', 'Nei');
    await velgSvar('Har brukeren oppgitt at de har arbeidet sammenhengende i Norge siste 5 år?', 'Ja');
    await velgSvar('Har søker i tillegg jobbet utenfor Norge i de siste fem årene?', 'Ja');

    expect(screen.getByRole('button', { name: /Legg til utenlandsopphold/i })).toBeVisible();
  });

  it('viser utenlandsopphold når arbeid utenfor Norge er oppgitt', async () => {
    render(<DigitaliserSøknad submit={vitest.fn()} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    await velgSvar('Har brukeren oppgitt at de har bodd sammenhengende i Norge siste 5 år?', 'Ja');
    await velgSvar('Har brukeren oppgitt at de har arbeidet utenfor Norge siste 5 år?', 'Ja');

    expect(screen.getByRole('button', { name: /Legg til utenlandsopphold/i })).toBeVisible();
  });

  it('viser utenlandsopphold når brukeren ikke har arbeidet sammenhengende i Norge', async () => {
    render(<DigitaliserSøknad submit={vitest.fn()} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    await velgSvar('Har brukeren oppgitt at de har bodd sammenhengende i Norge siste 5 år?', 'Nei');
    await velgSvar('Har brukeren oppgitt at de har arbeidet sammenhengende i Norge siste 5 år?', 'Nei');

    expect(screen.getByRole('button', { name: /Legg til utenlandsopphold/i })).toBeVisible();
  });

  it('legg til barn og sjekk at det kan slettes igjen', async () => {
    render(<DigitaliserSøknad submit={vitest.fn()} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

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
    const yrkesSkadeGruppe = screen.getByRole('radiogroup', {
      name: 'Har brukeren oppgitt at de har en relevant yrkesskade?',
    });
    await user.click(within(yrkesSkadeGruppe).getByText('Nei'));

    // Har bodd i Norge → spør om arbeid utenfor Norge.
    const harBoddGruppe = screen.getByRole('radiogroup', {
      name: 'Har brukeren oppgitt at de har bodd sammenhengende i Norge siste 5 år?',
    });
    await user.click(within(harBoddGruppe).getByText('Ja'));

    const arbeidetUtenforGruppe = screen.getByRole('radiogroup', {
      name: 'Har brukeren oppgitt at de har arbeidet utenfor Norge siste 5 år?',
    });
    await user.click(within(arbeidetUtenforGruppe).getByText('Ja'));

    // erStudent = Nei
    const erStudentGruppe = screen.getByRole('radiogroup', { name: 'Har brukeren oppgitt at de er student?' });
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
    const iArbeidGruppe = screen.getByRole('radiogroup', { name: 'Har brukeren oppgitt at de arbeidet i landet?' });
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

  it('sender ikke svar fra medlemskapsspørsmål som er skjult etter endring av svar', async () => {
    const submitMock = vi.fn();
    render(<DigitaliserSøknad submit={submitMock} grunnlag={grunnlag} readOnly={false} isLoading={false} />);

    await user.type(screen.getByRole('textbox', { name: /søknadsdato/i }), '01.01.2024');
    await velgSvar('Har brukeren oppgitt at de har en relevant yrkesskade?', 'Nei');
    await velgSvar('Har brukeren oppgitt at de har bodd sammenhengende i Norge siste 5 år?', 'Nei');
    await velgSvar('Har brukeren oppgitt at de har arbeidet sammenhengende i Norge siste 5 år?', 'Ja');
    await velgSvar('Har søker i tillegg jobbet utenfor Norge i de siste fem årene?', 'Ja');
    await velgSvar('Har brukeren oppgitt at de har bodd sammenhengende i Norge siste 5 år?', 'Ja');
    await velgSvar('Har brukeren oppgitt at de har arbeidet utenfor Norge siste 5 år?', 'Nei');
    await velgSvar('Har brukeren oppgitt at de er student?', 'Nei');
    await user.click(screen.getByRole('button', { name: 'Neste' }));

    expect(submitMock).toHaveBeenCalledOnce();
    const submitted = JSON.parse(submitMock.mock.calls[0][1]);
    expect(submitted.medlemskap.harBoddINorgeSiste5År).toBe('ja');
    expect(submitted.medlemskap.arbeidetUtenforNorgeFørSykdom).toBe('nei');
    expect(submitted.medlemskap).not.toHaveProperty('harArbeidetINorgeSiste5År');
    expect(submitted.medlemskap).not.toHaveProperty('iTilleggArbeidUtenforNorge');
  });
});
