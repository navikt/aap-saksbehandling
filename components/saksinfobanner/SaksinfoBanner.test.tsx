import { NoNavAapOppgaveReturInformasjonDtoStatus } from '@navikt/aap-oppgave-typescript-types';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customRender, customRenderMedRoller } from 'lib/test/CustomRender';
import { OppgaveVisningsinformasjon } from 'lib/types/oppgaveTypes';
import { DetaljertBehandling, FlytVisning, Roller, SaksInfo } from 'lib/types/types';
import { beforeEach, describe, expect, it } from 'vitest';

import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';

const user = userEvent.setup();

const sak: SaksInfo = {
  ident: '12345678910',
  behandlinger: [],
  opprettetTidspunkt: '12. mai',
  saksnummer: '12345',
  status: 'OPPRETTET',
  periode: { fom: '12 mai', tom: '27 mai' },
};

const avsluttetSak: SaksInfo = {
  ident: '12345678910',
  behandlinger: [],
  opprettetTidspunkt: '12. mai',
  saksnummer: '12345',
  status: 'AVSLUTTET',
  periode: { fom: '12 mai', tom: '27 mai' },
};

const oppgaveVisningsinfo: OppgaveVisningsinformasjon = {
  harUlesteDokumenter: false,
  skjermingInfo: { erSkjermet: false, harFortroligAdresse: false, harStrengtFortroligAdresse: false },
  id: 123,
  versjon: 0,
  markeringer: [],
  reservertAvIdent: 'navIdent',
};

const visning: FlytVisning = {
  beslutterReadOnly: false,
  brukerHarBesluttet: false,
  brukerHarKvalitetssikret: false,
  kvalitetssikringReadOnly: false,
  resultatKode: null,
  saksbehandlerReadOnly: true,
  typeBehandling: 'Førstegangsbehandling',
  visBeslutterKort: false,
  visBrevkort: false,
  visKvalitetssikringKort: false,
  visVentekort: false,
};

describe('Saksinfobanner på sak siden', () => {
  beforeEach(() => {
    customRender(<SaksinfoBanner sak={sak} />);
  });

  it('skal vise navn på bruker', () => {
    expect(screen.getByText('Peder Ås')).toBeVisible();
  });

  it('skal vise ident på bruker', () => {
    expect(screen.getByText('12345678910')).toBeVisible();
  });

  it('skal ikke vise saksnummer', () => {
    expect(screen.queryByText('12345')).not.toBeInTheDocument();
  });

  it('skal ikke vise hvilken type behandling', () => {
    expect(screen.queryByText('Førstegangsbehandling')).not.toBeInTheDocument();
  });

  it('skal ikke ha en knapp for å åpne saksmenyen', () => {
    const knapp = screen.queryByRole('button', { name: 'Saksmeny' });
    expect(knapp).not.toBeInTheDocument();
  });
});

const behandling: DetaljertBehandling = {
  aktivtSteg: 'AVKLAR_SYKDOM',
  avklaringsbehov: [],
  opprettet: '',
  referanse: '123',
  skalForberede: false,
  status: 'UTREDES',
  type: 'Førstegangsbehandling',
  versjon: 0,
  vilkår: [],
  virkningstidspunkt: '2025-01-02',
  vurderingsbehovOgÅrsaker: [],
};

const avsluttetBehandling: DetaljertBehandling = {
  aktivtSteg: 'AVKLAR_SYKDOM',
  avklaringsbehov: [],
  opprettet: '',
  referanse: '123',
  skalForberede: false,
  status: 'AVSLUTTET',
  type: 'Førstegangsbehandling',
  versjon: 0,
  vilkår: [],
  virkningstidspunkt: '2025-01-02',
  vurderingsbehovOgÅrsaker: [],
};

describe('SaksinfoBanner på behandling siden', () => {
  it('skal vise navn på bruker', () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} visning={visning} />);
    expect(screen.getByText('Peder Ås')).toBeVisible();
  });

  it('skal vise ident på bruker', () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} visning={visning} />);
    expect(screen.getByText('12345678910')).toBeVisible();
  });

  it('skal vise saksnummer derosm brukeren er på behandlingsiden', () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} visning={visning} />);
    expect(screen.getByText(/^Sak$/));
    expect(screen.getByRole('button', { name: /^12345$/ }));
  });

  it('skal vise hvilken type behandling', () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} visning={visning} />);
    expect(screen.getByText('Førstegangsbehandling')).toBeVisible();
  });

  it('skal vise status', () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} visning={visning} />);
    expect(screen.getByText('Utredes')).toBeVisible();
  });

  it('skal ha en knapp for å åpne saksmeny', () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} visning={visning} />);
    const knapp = screen.getByRole('button', { name: 'Saksmeny' });
    expect(knapp).toBeVisible();
  });

  it('menyvalg for å trekke søknad vises for førstegangsbehandling', async () => {
    customRenderMedRoller(<SaksinfoBanner sak={sak} behandling={behandling} visning={visning} />, [
      Roller.SAKSBEHANDLER_NASJONAL,
    ]);
    await user.click(screen.getByRole('button', { name: 'Saksmeny' }));
    expect(screen.getByRole('button', { name: 'Trekk søknad' })).toBeVisible();
  });

  it('menyvalg for å trekke søknad vises ikke hvis bruker ikke har saksbehandlertilgang', async () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} visning={visning} />);
    await user.click(screen.getByRole('button', { name: 'Saksmeny' }));
    expect(screen.queryByRole('button', { name: 'Trekk søknad' })).not.toBeInTheDocument();
  });

  it('menyvalg for å trekke søknad vises ikke for en avsluttet førstegangsbehandling', async () => {
    customRenderMedRoller(<SaksinfoBanner sak={avsluttetSak} behandling={avsluttetBehandling} visning={visning} />, [
      Roller.SAKSBEHANDLER_OPPFØLGING,
    ]);
    await user.click(screen.getByRole('button', { name: 'Saksmeny' }));
    expect(screen.queryByRole('button', { name: 'Trekk søknad' })).not.toBeInTheDocument();
  });

  it('menyvalg for å trekke søknad vises ikke for revurdering', async () => {
    customRender(
      <SaksinfoBanner sak={sak} behandling={behandling} visning={{ ...visning, typeBehandling: 'Revurdering' }} />
    );
    await user.click(screen.getByRole('button', { name: 'Saksmeny' }));
    expect(screen.queryByRole('button', { name: 'Trekk søknad' })).not.toBeInTheDocument();
  });

  it('menyvalg for å overstyre startstidspunkt vises ikke hvis behandling er iverksatt', async () => {
    customRenderMedRoller(
      <SaksinfoBanner sak={sak} behandling={{ ...behandling, status: 'IVERKSETTES' }} visning={visning} />,
      [Roller.SAKSBEHANDLER_OPPFØLGING]
    );

    await user.click(screen.getByRole('button', { name: 'Saksmeny' }));
    expect(screen.queryByRole('button', { name: 'Vurder § 22-13 syvende ledd' })).not.toBeInTheDocument();
  });

  it('menyvalg for å sette markeringer på behandling vises', async () => {
    customRenderMedRoller(
      <SaksinfoBanner sak={sak} behandling={{ ...behandling, status: 'IVERKSETTES' }} visning={visning} />,
      [Roller.SAKSBEHANDLER_OPPFØLGING]
    );

    await user.click(screen.getByRole('button', { name: 'Saksmeny' }));
    expect(screen.getByText('Marker som haster')).toBeVisible();
  });

  it('skal ikke vise Arena-tag når brukeren ikke har AAP-Arena-historikk', () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} oppgaveVisninginfo={oppgaveVisningsinfo} />);
    const returTag = screen.queryByText('Arenahistorikk');
    expect(returTag).not.toBeInTheDocument();
  });

  it('skal vise Arena-tag når brukeren har AAP-Arena-historikk', () => {
    sak.behandlinger;
    customRender(
      <SaksinfoBanner
        sak={sak}
        behandling={{
          ...behandling,
          arenaStatus: {
            harArenaHistorikk: true,
          },
        }}
        oppgaveVisninginfo={oppgaveVisningsinfo}
      />
    );
    const returTag = screen.queryByText('Arenahistorikk');
    expect(returTag).toBeInTheDocument();
  });
});

describe('Sak status', () => {
  it('skal vise en tag som viser om saken er satt på vent dersom den er det', () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} visning={{ ...visning, visVentekort: true }} />);

    const påVentTag = screen.getByText('På vent');
    expect(påVentTag).toBeVisible();
  });

  it('skal ikke vise en tag som viser om saken er satt på vent dersom den ikke er det', () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} visning={visning} />);

    const påVentTag = screen.queryByText('På vent');
    expect(påVentTag).not.toBeInTheDocument();
  });

  it('skal vise saksbehandlers navn på tildelt-tag dersom oppgaven er reservert', () => {
    customRender(
      <SaksinfoBanner
        sak={sak}
        behandling={behandling}
        oppgaveVisninginfo={{ ...oppgaveVisningsinfo, reservertAvNavn: 'Test Testesen' }}
        visning={visning}
      />
    );

    const tildeltTag = screen.getByText('Tildelt: Test Testesen');
    expect(tildeltTag).toBeVisible();
  });

  it('skal vise saksbehandlers ident på tildelt-tag dersom oppgaven er tildelt og navn ikke finnes', () => {
    customRender(
      <SaksinfoBanner sak={sak} behandling={behandling} oppgaveVisninginfo={oppgaveVisningsinfo} visning={visning} />
    );

    const tildeltTagIdent = screen.getByText('Tildelt: navIdent');
    expect(tildeltTagIdent).toBeVisible();
  });

  it('skal vise en tag som viser om behandlingen er tildelt dersom innnlogget bruker har resertvert den', () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} oppgaveVisninginfo={oppgaveVisningsinfo} />);

    const reservertTag = screen.getByText('Tildelt: navIdent');
    expect(reservertTag).toBeVisible();
  });

  it('skal ikke vise en tag som viser om behandlingen er reservert dersom ingen har reservert den', () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} />);

    const reservertTag = screen.queryByText('Tildelt: Test Testesen');
    expect(reservertTag).not.toBeInTheDocument();
  });

  it('viser ikke trukket-tag for en søknad som ikke er trukket', () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} />);
    expect(screen.queryByText('Trukket')).not.toBeInTheDocument();
  });

  it('viser at en søknad er trukket', () => {
    const trukketSøknad = { ...sak, søknadErTrukket: true };
    customRender(<SaksinfoBanner sak={trukketSøknad} behandling={behandling} />);
    expect(screen.getByText('Trukket')).toBeVisible();
  });

  it('skal vise ledig-tag når en oppgaveVisningsinfo ikke er tildelt noen', () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} />);
    const ledigTag = screen.getByText('Ledig');
    expect(ledigTag).toBeVisible();
  });

  it('skal vise retur-tag når behandling er sendt tilbake fra kvalitetssikrer', () => {
    customRender(
      <SaksinfoBanner
        sak={sak}
        behandling={behandling}
        oppgaveVisninginfo={{
          ...oppgaveVisningsinfo,
          returInformasjon: {
            begrunnelse: 'Underkjent',
            endretAv: 'Kvalitetssikrer',
            status: NoNavAapOppgaveReturInformasjonDtoStatus.RETUR_FRA_KVALITETSSIKRER,
            årsaker: [],
          },
        }}
      />
    );
    const returTag = screen.getByText('Retur fra kvalitetssikrer');
    expect(returTag).toBeVisible();
  });

  it('skal vise retur-tag når behandling er sendt tilbake til kvalitetssikrer', () => {
    customRender(
      <SaksinfoBanner
        sak={sak}
        behandling={behandling}
        oppgaveVisninginfo={{
          ...oppgaveVisningsinfo,
          returInformasjon: {
            begrunnelse: 'Underkjent',
            endretAv: 'Kvalitetssikrer',
            status: NoNavAapOppgaveReturInformasjonDtoStatus.RETUR_FRA_VEILEDER,
            årsaker: [],
          },
        }}
      />
    );
    const returTag = screen.getByText('Retur fra veileder');
    expect(returTag).toBeVisible();
  });

  it('skal ikke vise retur-tag når oppgaveVisningsinfo ikke har retur-status', () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} oppgaveVisninginfo={oppgaveVisningsinfo} />);
    const returTag = screen.queryByText('Retur');
    expect(returTag).not.toBeInTheDocument();
  });

  it('skal vise frist utløpt-tag når oppgaveVisningsinfo har utløpt ventefrist', async () => {
    customRender(
      <SaksinfoBanner
        sak={sak}
        behandling={behandling}
        oppgaveVisninginfo={{
          ...oppgaveVisningsinfo,
          utløptVenteInfo: {
            påVentTil: '2026-01-04',
            påVentÅrsak: 'VENTER_PÅ_OPPLYSNINGER',
            venteBegrunnelse: 'Venter på dokumentasjon',
          },
        }}
      />
    );

    const fristKnapp = screen.getByRole('button', { name: /Ventefrist utløpt.*04\.01\.2026/ });
    expect(fristKnapp).toBeVisible();

    await user.click(fristKnapp);

    expect(screen.getByText('Frist utløpt 04.01.2026')).toBeVisible();
    expect(screen.getByText('Årsak')).toBeVisible();
    expect(screen.getByText('Venter på opplysninger')).toBeVisible();
    expect(screen.getByText('Begrunnelse')).toBeVisible();
    expect(screen.getByText('Venter på dokumentasjon')).toBeVisible();
  });

  it('skal ikke vise frist utløpt-tag når oppgaveVisningsinfo ikke har utløpt ventefrist', () => {
    customRender(<SaksinfoBanner sak={sak} behandling={behandling} oppgaveVisninginfo={oppgaveVisningsinfo} />);
    const fristTag = screen.queryByText('Frist utløpt 04.01.2026');
    expect(fristTag).not.toBeInTheDocument();
  });
});
