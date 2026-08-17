import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { RelevantKrav, SøknadUtenKrav } from 'lib/types/types';
import { customRender } from 'lib/test/CustomRender';
import { byggInitielleVurderinger } from 'components/behandlinger/krav/kravutils';
import { KravBoks, KravBoksInnhold } from 'components/behandlinger/krav/kravboks/KravBoks';
import { KravFormFields } from 'components/behandlinger/krav/vurderkrav/VurderKravV2';

const user = userEvent.setup();

function relevantKrav(overrides: Partial<RelevantKrav> = {}): RelevantKrav {
  return {
    type: 'RELEVANT_KRAV',
    referanse: 'krav-1',
    journalpostId: { identifikator: 'jp-1' },
    begrunnelse: 'Opprinnelig begrunnelse',
    opprettet: '2025-04-01T10:30:00Z',
    muligRettFra: '2025-04-15',
    søknadsdato: { dato: '2025-04-01', årsak: 'SøknadMottatt' },
    vurdertAv: 'Z000000',
    vurdertIBehandling: { id: 1 },
    ...overrides,
  };
}

function søknadUtenKrav(overrides: Partial<SøknadUtenKrav> = {}): SøknadUtenKrav {
  return {
    journalpostId: { identifikator: 'jp-ny' },
    mottattTidspunkt: '2025-05-10T09:00:00',
    ...overrides,
  };
}

/** Testharness som setter opp samme skjemakontekst som VurderKravV2 gir KravBoks i praksis. */
function KravBoksHarness({ innhold, onLukk = vi.fn() }: { innhold: KravBoksInnhold; onLukk?: () => void }) {
  const referanse = innhold.kilde === 'EKSISTERENDE' ? innhold.krav.referanse : innhold.søknad.journalpostId.identifikator;
  const vurdering = innhold.kilde === 'EKSISTERENDE' ? innhold.krav : undefined;
  const søknad = innhold.kilde === 'NY_SØKNAD' ? innhold.søknad : undefined;

  const form = useForm<KravFormFields>({
    defaultValues: {
      valgteKrav: [referanse],
      vurderinger: byggInitielleVurderinger({
        harTilgangTilÅSaksbehandle: true,
        nyeVurderinger: vurdering ? [vurdering] : [],
        vedtatteVurderinger: [],
        søknader: [],
        søknaderUtenKravvurdering: søknad ? [søknad] : [],
      }),
    },
  });

  return (
    <FormProvider {...form}>
      <KravBoks innhold={innhold} erVedtatt={false} onLukk={onLukk} />
    </FormProvider>
  );
}

describe('KravBoks - visning av innhold', () => {
  it('viser krav-referanse, søknadsdato og kravtype for et eksisterende krav', () => {
    const krav = relevantKrav();
    customRender(<KravBoksHarness innhold={{ kilde: 'EKSISTERENDE', krav }} />);

    expect(screen.getByText('Vurder krav krav-1')).toBeVisible();
    expect(screen.getByText('Søknadsdato: 01.04.2025')).toBeVisible();
    expect(screen.getAllByText('Relevant krav').length).toBeGreaterThan(0);
    expect(screen.queryByText('Må vurderes')).not.toBeInTheDocument();
  });

  it('viser "Må vurderes"-tag og "Ny søknad"-tittel for en søknad uten kravvurdering', () => {
    const søknad = søknadUtenKrav();
    customRender(<KravBoksHarness innhold={{ kilde: 'NY_SØKNAD', søknad }} />);

    expect(screen.getByText('Ny søknad jp-ny')).toBeVisible();
    expect(screen.getByText('Må vurderes')).toBeVisible();
    expect(screen.getByText('Søknadsdato: 10.05.2025')).toBeVisible();
  });

  it('viser "-" for mulig rett fra når kravet ikke har et slikt felt (f.eks. en ny søknad)', () => {
    const søknad = søknadUtenKrav();
    customRender(<KravBoksHarness innhold={{ kilde: 'NY_SØKNAD', søknad }} />);

    expect(screen.getByText('-')).toBeVisible();
  });
});

describe('KravBoks - åpne/lukke bolker', () => {
  it('åpner Kravtype-bolken ved klikk, og viser select-feltet', async () => {
    const krav = relevantKrav();
    customRender(<KravBoksHarness innhold={{ kilde: 'EKSISTERENDE', krav }} />);

    expect(screen.queryByRole('combobox', { name: 'Kravtype' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Vurder om krav er relevant' }));

    expect(screen.getByRole('combobox', { name: 'Kravtype' })).toBeVisible();
  });

  it('viser Kravtype-bolken forhåndsåpnet for en ny søknad, slik at saksbehandler må ta stilling til kravtype', () => {
    const søknad = søknadUtenKrav();
    customRender(<KravBoksHarness innhold={{ kilde: 'NY_SØKNAD', søknad }} />);

    expect(screen.getByRole('combobox', { name: 'Kravtype' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Avbryt vurder om krav er relevant' })).toBeVisible();
  });

  it('viser Kravtype-bolken lukket for et eksisterende krav (skal ikke forhåndsåpnes)', () => {
    const krav = relevantKrav();
    customRender(<KravBoksHarness innhold={{ kilde: 'EKSISTERENDE', krav }} />);

    expect(screen.queryByRole('combobox', { name: 'Kravtype' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vurder om krav er relevant' })).toBeVisible();
  });

  it('nullstiller kravtype til opprinnelig verdi når bolken lukkes igjen uten å lagre', async () => {
    const krav = relevantKrav();
    customRender(<KravBoksHarness innhold={{ kilde: 'EKSISTERENDE', krav }} />);

    await user.click(screen.getByRole('button', { name: 'Vurder om krav er relevant' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Kravtype' }), 'KLAGE');
    expect(screen.getByRole('combobox', { name: 'Kravtype' })).toHaveValue('KLAGE');

    await user.click(screen.getByRole('button', { name: 'Avbryt vurder om krav er relevant' }));
    expect(screen.queryByRole('combobox', { name: 'Kravtype' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Vurder om krav er relevant' }));
    expect(screen.getByRole('combobox', { name: 'Kravtype' })).toHaveValue('RELEVANT_KRAV');
  });

  it('nullstiller søknadsdato-feltene til opprinnelig verdi når bolken lukkes igjen uten å lagre', async () => {
    const krav = relevantKrav();
    customRender(<KravBoksHarness innhold={{ kilde: 'EKSISTERENDE', krav }} />);

    await user.click(screen.getByRole('button', { name: 'Vurder §22-13 5.ledd' }));
    const søknadsdatoFelt = screen.getByRole('textbox', { name: 'Søknadsdato' });
    await user.clear(søknadsdatoFelt);
    await user.type(søknadsdatoFelt, '15.06.2025');
    expect(søknadsdatoFelt).toHaveValue('15.06.2025');

    await user.click(screen.getByRole('button', { name: 'Avbryt Vurder §22-13 5.ledd' }));
    await user.click(screen.getByRole('button', { name: 'Vurder §22-13 5.ledd' }));

    expect(screen.getByRole('textbox', { name: 'Søknadsdato' })).toHaveValue('01.04.2025');
  });

  it('nullstiller overstyr mulig rett fra til opprinnelig verdi når bolken lukkes igjen uten å lagre', async () => {
    const krav = relevantKrav({
      overstyrMuligRettFra: { dato: '2025-07-01', årsak: 'MisvisendeOpplysninger' },
    });
    customRender(<KravBoksHarness innhold={{ kilde: 'EKSISTERENDE', krav }} />);

    await user.click(screen.getByRole('button', { name: 'Vurder §22-13 7.ledd' }));
    const overstyrFelt = screen.getByRole('textbox', { name: 'Overstyr mulig rett fra' });
    expect(overstyrFelt).toHaveValue('01.07.2025');

    await user.clear(overstyrFelt);
    await user.type(overstyrFelt, '20.08.2025');
    expect(overstyrFelt).toHaveValue('20.08.2025');

    await user.click(screen.getByRole('button', { name: 'Avbryt vurder §22-13 7.ledd' }));
    await user.click(screen.getByRole('button', { name: 'Vurder §22-13 7.ledd' }));

    expect(screen.getByRole('textbox', { name: 'Overstyr mulig rett fra' })).toHaveValue('01.07.2025');
  });
});

describe('KravBoks - Lukk-knapp og begrunnelse', () => {
  it('kaller onLukk når toppnivå Lukk-knappen klikkes', async () => {
    const onLukk = vi.fn();
    const krav = relevantKrav();
    customRender(<KravBoksHarness innhold={{ kilde: 'EKSISTERENDE', krav }} onLukk={onLukk} />);

    await user.click(screen.getByRole('button', { name: 'Lukk' }));

    expect(onLukk).toHaveBeenCalledOnce();
  });

  it('viser begrunnelsesfeltet forhåndsutfylt med eksisterende begrunnelse for et allerede vurdert krav', () => {
    const krav = relevantKrav({ begrunnelse: 'En begrunnelse fra før' });
    customRender(<KravBoksHarness innhold={{ kilde: 'EKSISTERENDE', krav }} />);

    expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toHaveValue('En begrunnelse fra før');
  });

  it('viser tomt begrunnelsesfelt for en ny søknad uten kravvurdering', () => {
    const søknad = søknadUtenKrav();
    customRender(<KravBoksHarness innhold={{ kilde: 'NY_SØKNAD', søknad }} />);

    expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toHaveValue('');
  });
});
