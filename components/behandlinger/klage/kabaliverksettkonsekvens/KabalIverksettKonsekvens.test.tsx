import { describe, expect, it } from 'vitest';
import { render, screen } from '../../../../lib/test/CustomRender';
import { KabalIverksettKonsekvens } from 'components/behandlinger/klage/kabaliverksettkonsekvens/KabalIverksettKonsekvens';

describe('KabalIverksettKonsekvens', () => {
  it('Skal ha en overskrift', () => {
    render(
      <KabalIverksettKonsekvens
        grunnlag={{
          gjeldendeVurdering: undefined,
          svarFraAndreinstans: {
            avsluttetTidspunkt: undefined,
            feilregistrertBegrunnelse: undefined,
            opprettetTidspunkt: undefined,
            type: 'KLAGEBEHANDLING_AVSLUTTET',
            utfall: undefined,
          },
        }}
      />
    );

    const heading = screen.getByText('Oppsummering');
    expect(heading).toBeVisible();
  });

  it('Skal vise info ved ingen endring', () => {
    render(
      <KabalIverksettKonsekvens
        grunnlag={{
          gjeldendeVurdering: {
            begrunnelse: 'kommentar',
            konsekvens: 'INGENTING',
            vurdertAv: 'indens',
            vilkårSomOmgjøres: [],
          },
          svarFraAndreinstans: {
            avsluttetTidspunkt: undefined,
            feilregistrertBegrunnelse: undefined,
            opprettetTidspunkt: undefined,
            type: 'KLAGEBEHANDLING_AVSLUTTET',
            utfall: undefined,
          },
        }}
      />
    );

    const text = screen.getByText('Vedtaket opprettholdes / ingen endring');
    expect(text).toBeVisible();
  });

  it('Skal vise info om klages må vurderes på nytt', () => {
    render(
      <KabalIverksettKonsekvens
        grunnlag={{
          gjeldendeVurdering: {
            begrunnelse: 'kommentar',
            konsekvens: 'BEHANDLE_PÅ_NYTT',
            vurdertAv: 'indens',
            vilkårSomOmgjøres: [],
          },
          svarFraAndreinstans: {
            avsluttetTidspunkt: undefined,
            feilregistrertBegrunnelse: undefined,
            opprettetTidspunkt: undefined,
            type: 'KLAGEBEHANDLING_AVSLUTTET',
            utfall: undefined,
          },
        }}
      />
    );

    const text = screen.getByText('Klagen må vurderes på nytt');
    expect(text).toBeVisible();
  });

  it('Skal vise hjemmler som skal gjøres hvis helt eller delvis omgjøring', () => {
    render(
      <KabalIverksettKonsekvens
        grunnlag={{
          gjeldendeVurdering: {
            begrunnelse: 'kommentar',
            konsekvens: 'OMGJØRING',
            vurdertAv: 'indens',
            vilkårSomOmgjøres: ['FOLKETRYGDLOVEN_11_2', 'FOLKETRYGDLOVEN_11_3'],
          },
          svarFraAndreinstans: {
            avsluttetTidspunkt: undefined,
            feilregistrertBegrunnelse: undefined,
            opprettetTidspunkt: undefined,
            type: 'KLAGEBEHANDLING_AVSLUTTET',
            utfall: undefined,
          },
        }}
      />
    );

    const text = screen.getByText('Vedtaket omgøres helt eller delvis');
    expect(text).toBeVisible();
    const hjemmelTekst = screen.getByText('§ 11-2, § 11-3');
    expect(hjemmelTekst).toBeVisible();
  });
});
