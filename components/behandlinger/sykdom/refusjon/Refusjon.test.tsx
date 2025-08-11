import { describe, expect, it } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import { Refusjon } from 'components/behandlinger/sykdom/refusjon/Refusjon';
import { RefusjonskravGrunnlag } from 'lib/types/types';
import { userEvent } from '@testing-library/user-event';
import { addDays, format, subDays } from 'date-fns';

const user = userEvent.setup();

const gyldigRefusjonsGrunnlag: RefusjonskravGrunnlag = {
  gjeldendeVurderinger: [
    {
      fom: null,
      tom: null,
      harKrav: false,
      vurdertAv: { ansattnavn: 'Saksbehandler1', dato: '01.01.2026', enhetsnavn: 'Nav Løten', ident: '124567' },
    },
  ],
  gjeldendeVurdering: {
    fom: null,
    tom: null,
    harKrav: false,
    vurdertAv: { ansattnavn: 'Saksbehandler1', dato: '01.01.2026', enhetsnavn: 'Nav Løten', ident: '124567' },
  },
  harTilgangTilÅSaksbehandle: true,
  historiskeVurderinger: [],
};

describe('Refusjonskrav sosialstønad', () => {
  it('Skal ha korrekt overskrift', () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={gyldigRefusjonsGrunnlag} />);
    const heading = screen.getByText('Sosialstønad refusjonskrav');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for om det er refusjonskrav', () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={gyldigRefusjonsGrunnlag} />);
    const harRefusjonKrav = screen.getByRole('group', {
      name: 'Er det refusjonskrav fra Nav-kontor?',
    });
    expect(harRefusjonKrav).toBeVisible();
  });

  it('Viser felt for fradato om bruker har refusjonskrav', async () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={gyldigRefusjonsGrunnlag} />);

    expect(finnGruppeVelgRefusjonskrav()).toBeVisible();

    await velgJa(finnGruppeVelgRefusjonskrav());
    expect(finnTekstfeltForFradato()).toBeInTheDocument();
  });

  it('Viser felt for tildato om bruker har refusjonskrav', async () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={gyldigRefusjonsGrunnlag} />);

    expect(finnGruppeVelgRefusjonskrav()).toBeVisible();

    await velgJa(finnGruppeVelgRefusjonskrav());
    expect(finnTekstfeltForTildato()).toBeInTheDocument();
  });

  it('Viser felt for navkontor om bruker har refusjonskrav', async () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={gyldigRefusjonsGrunnlag} />);

    expect(finnGruppeVelgRefusjonskrav()).toBeVisible();

    await velgJa(finnGruppeVelgRefusjonskrav());
    expect(finnNavkontorListe()).toBeInTheDocument();
  });

  it('Viser ikke felt for fradato om bruker har refusjonskrav', async () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={gyldigRefusjonsGrunnlag} />);

    expect(finnGruppeVelgRefusjonskrav()).toBeVisible();

    await velgNei(finnGruppeVelgRefusjonskrav());
    expect(finnTekstfeltForFradato()).not.toBeInTheDocument();
  });

  it('Viser ikke felt for tildato om bruker har refusjonskrav', async () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={gyldigRefusjonsGrunnlag} />);

    expect(finnGruppeVelgRefusjonskrav()).toBeVisible();

    await velgNei(finnGruppeVelgRefusjonskrav());
    expect(finnTekstfeltForTildato()).not.toBeInTheDocument();
  });

  it('Viser ikke felt for navkontor om bruker har refusjonskrav', async () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={gyldigRefusjonsGrunnlag} />);

    expect(finnGruppeVelgRefusjonskrav()).toBeVisible();

    await velgNei(finnGruppeVelgRefusjonskrav());
    expect(finnNavkontorListe()).not.toBeInTheDocument();
  });

  it('Gir feilmelding ved feil format på fradato', async () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={gyldigRefusjonsGrunnlag} />);

    expect(finnGruppeVelgRefusjonskrav()).toBeVisible();

    await velgJa(finnGruppeVelgRefusjonskrav());
    await skrivInnDatoForNårVurderingenGjelderFra('21.153.2211');
    await trykkPåBekreft();
    const feilmelding = screen.getByText('Datoformatet er ikke gyldig. Dato må være på formatet dd.mm.åååå');
    expect(feilmelding).toBeVisible();
  });

  it('Gir ikke feilmelding ved manglende fra- og tildato', async () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={gyldigRefusjonsGrunnlag} />);

    expect(finnGruppeVelgRefusjonskrav()).toBeVisible();

    await velgJa(finnGruppeVelgRefusjonskrav());
    await trykkPåBekreft();
    const feilmelding = screen.queryByText('Datoformatet er ikke gyldig. Dato må være på formatet dd.mm.åååå');
    expect(feilmelding).not.toBeInTheDocument();
  });

  it('Gir feilmelding ved feil format på tildato', async () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={gyldigRefusjonsGrunnlag} />);

    expect(finnGruppeVelgRefusjonskrav()).toBeVisible();

    await velgJa(finnGruppeVelgRefusjonskrav());
    await skrivInnDatoForNårVurderingenGjelderTil('Tøysedato');
    await trykkPåBekreft();
    const feilmelding = screen.getByText('Datoformatet er ikke gyldig. Dato må være på formatet dd.mm.åååå');
    expect(feilmelding).toBeVisible();
  });

  it('Gir feilmelding ved for tidlig fradato', async () => {
    const ugyldigSøknadstidspunkt = subDays(new Date(), 4);
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={gyldigRefusjonsGrunnlag} />);

    expect(finnGruppeVelgRefusjonskrav()).toBeVisible();
    await velgJa(finnGruppeVelgRefusjonskrav());
    await skrivInnDatoForNårVurderingenGjelderFra(format(ugyldigSøknadstidspunkt, 'dd.MM.yyyy'));
    await trykkPåBekreft();
    const feilmelding = await screen.findByText('Vurderingen kan ikke gjelde fra før søknadstidspunkt');
    expect(feilmelding).toBeVisible();
  });

  it('Gir feilmelding ved tildato før fradato', async () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={gyldigRefusjonsGrunnlag} />);
    const gyldigFraDato = addDays(new Date(), 30);
    const ugyldigTilDato = subDays(gyldigFraDato, 2);
    expect(finnGruppeVelgRefusjonskrav()).toBeVisible();

    await velgJa(finnGruppeVelgRefusjonskrav());
    await skrivInnDatoForNårVurderingenGjelderFra(format(gyldigFraDato, 'dd.MM.yyyy'));
    await skrivInnDatoForNårVurderingenGjelderTil(format(ugyldigTilDato, 'dd.MM.yyyy'));
    await trykkPåBekreft();
    const feilmelding = await screen.findByText('Tildato kan ikke være før fradato');
    expect(feilmelding).toBeVisible();
  });

  it('Gir feilmelding ved manglende Nav-kontor', async () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={gyldigRefusjonsGrunnlag} />);

    expect(finnGruppeVelgRefusjonskrav()).toBeVisible();

    await velgJa(finnGruppeVelgRefusjonskrav());

    await trykkPåBekreft();
    const feilmelding = await screen.findByText('Du må velge et Nav-kontor');
    expect(feilmelding).toBeVisible();
  });

  const finnGruppeVelgRefusjonskrav = () => screen.getByRole('group', { name: 'Er det refusjonskrav fra Nav-kontor?' });

  const finnTekstfeltForFradato = () =>
    screen.queryByRole('textbox', {
      name: 'Refusjonen gjelder fra',
    });

  const finnTekstfeltForTildato = () =>
    screen.queryByRole('textbox', {
      name: 'Refusjonen gjelder til',
    });

  const finnNavkontorListe = () => screen.queryByRole('combobox', { name: 'Søk opp Nav-kontor' });

  const trykkPåBekreft = async () => await user.click(screen.getByRole('button', { name: 'Bekreft' }));

  const velgJa = async (group: HTMLElement) => {
    await user.click(within(group).getByRole('radio', { name: 'Ja' }));
  };

  const velgNei = async (group: HTMLElement) => {
    await user.click(within(group).getByRole('radio', { name: 'Nei' }));
  };

  const skrivInnDatoForNårVurderingenGjelderFra = async (dato: string) => {
    const datofelt = screen.getByRole('textbox', { name: 'Refusjonen gjelder fra' });
    await user.clear(datofelt);
    await user.type(datofelt, dato);
  };

  const skrivInnDatoForNårVurderingenGjelderTil = async (dato: string) => {
    const datofelt = screen.getByRole('textbox', { name: 'Refusjonen gjelder til' });
    await user.clear(datofelt);
    await user.type(datofelt, dato);
  };
});
