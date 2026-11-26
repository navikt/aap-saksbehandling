import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { KravVurderingForSøknad, RelevantKrav } from 'lib/types/types';
import { KravTabellRadInnhold } from 'components/behandlinger/krav/kravtabell/KravTabellRadInnhold';

function relevantKrav(overrides: Partial<RelevantKrav> = {}): RelevantKrav {
  return {
    type: 'RELEVANT_KRAV',
    referanse: 'krav-1',
    journalpostId: { identifikator: 'jp-1' },
    begrunnelse: 'Begrunnelse for kravet',
    opprettet: '2025-04-01T10:30:00Z',
    muligRettFra: '2025-04-15',
    søknadsdato: { dato: '2025-04-01', årsak: 'SøknadMottatt', begrunnelse: '' },
    vurdertAv: 'Z000000',
    vurdertIBehandling: { id: 1 },
    ...overrides,
  };
}

function annenKravtype(type: 'KLAGE' | 'TILLEGGSOPPLYSNING' | 'TRUKKET_SØKNAD'): KravVurderingForSøknad {
  return {
    type,
    referanse: 'krav-2',
    journalpostId: { identifikator: 'jp-2' },
    begrunnelse: 'Begrunnelse for kravet',
    opprettet: '2025-04-01T10:30:00Z',
    vurdertAv: 'Z000000',
    vurdertIBehandling: { id: 1 },
  };
}

describe('KravTabellRadInnhold', () => {
  it('viser alle tre bolkene for et RELEVANT_KRAV', () => {
    render(<KravTabellRadInnhold rad={relevantKrav()} />);

    expect(screen.getByText('Type krav')).toBeVisible();
    expect(screen.getByText('Søknadsdato', { selector: 'label' })).toBeVisible();
    expect(screen.getByText('Mulig rett fra', { selector: 'label' })).toBeVisible();
    expect(screen.getByText(/Begrunnelse for kravet/)).toBeVisible();
  });

  it.each(['KLAGE', 'TILLEGGSOPPLYSNING', 'TRUKKET_SØKNAD'] as const)('viser kun "Type krav" for %s', (type) => {
    render(<KravTabellRadInnhold rad={annenKravtype(type)} />);

    expect(screen.getByText('Type krav')).toBeVisible();
    expect(screen.queryByText('Søknadsdato', { selector: 'label' })).not.toBeInTheDocument();
    expect(screen.queryByText('Mulig rett fra', { selector: 'label' })).not.toBeInTheDocument();
  });

  it('viser "Nei" for både endret søknadsdato og tilbakedatering når ingenting er overstyrt', () => {
    render(<KravTabellRadInnhold rad={relevantKrav()} />);

    expect(screen.getAllByText(/Nei$/)).toHaveLength(2);
    expect(screen.queryByText(/Tidligst rett til AAP fra/)).not.toBeInTheDocument();
  });

  it('viser valgt årsak og begrunnelse når søknadsdato er endret', () => {
    render(
      <KravTabellRadInnhold
        rad={relevantKrav({
          søknadsdato: {
            dato: '2025-03-01',
            årsak: 'BrukerHarSøktTidligere',
            begrunnelse: 'Søkte via telefon',
          },
        })}
      />
    );

    expect(screen.getByText(/Ja, bruker har søkt tidligere enn første registrerte søknad/)).toBeVisible();
    expect(screen.getByText(/Søkte via telefon/)).toBeVisible();
    expect(screen.getByText(/01\.03\.2025/)).toBeVisible();
  });

  it('viser tidligst rett fra, årsak og begrunnelse når mulig rett fra er overstyrt', () => {
    render(
      <KravTabellRadInnhold
        rad={relevantKrav({
          overstyrMuligRettFra: {
            dato: '2025-01-10',
            årsak: 'MisvisendeOpplysninger',
            begrunnelse: 'NAV ga feil informasjon',
          },
        })}
      />
    );

    expect(screen.getByText(/Tidligst rett til AAP fra/)).toBeVisible();
    expect(screen.getByText(/10\.01\.2025/)).toBeVisible();
    expect(screen.getByText(/trygdens organer har gitt misvisende opplysninger/)).toBeVisible();
    expect(screen.getByText(/NAV ga feil informasjon/)).toBeVisible();
  });
});
