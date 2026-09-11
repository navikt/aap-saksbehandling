import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customRender, customRenderMedRoller } from 'lib/test/CustomRender';
import { DetaljertBehandling, FlytGruppe, FlytVisning, Roller } from 'lib/types/types';
import { describe, expect, it } from 'vitest';

import { SaksmenyDropdown } from 'components/saksinfobanner/SaksmenyDropdown';

const user = userEvent.setup();

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

function flytGruppe(stegGruppe: FlytGruppe['stegGruppe'], skalVises: boolean): FlytGruppe {
  return { stegGruppe, skalVises, erFullført: false, steg: [] };
}

async function åpneMeny() {
  await user.click(screen.getByRole('button', { name: 'Saksmeny' }));
}

describe('SaksmenyDropdown', () => {
  it('viser knapp for å åpne saksmenyen', () => {
    customRender(<SaksmenyDropdown behandling={behandling} visning={visning} />);
    expect(screen.getByRole('button', { name: 'Saksmeny' })).toBeVisible();
  });

  it('viser alltid valg for å sette behandling på vent', async () => {
    customRender(<SaksmenyDropdown behandling={behandling} visning={visning} />);
    await åpneMeny();
    expect(screen.getByRole('button', { name: 'Sett behandling på vent' })).toBeVisible();
  });

  describe('Trekk søknad', () => {
    it('vises for førstegangsbehandling når bruker kan saksbehandle', async () => {
      customRenderMedRoller(<SaksmenyDropdown behandling={behandling} visning={visning} />, [
        Roller.SAKSBEHANDLER_NASJONAL,
      ]);
      await åpneMeny();
      expect(screen.getByRole('button', { name: 'Trekk søknad' })).toBeVisible();
    });

    it('vises ikke når innlogget bruker ikke kan saksbehandle', async () => {
      customRender(<SaksmenyDropdown behandling={behandling} visning={visning} />);
      await åpneMeny();
      expect(screen.queryByRole('button', { name: 'Trekk søknad' })).not.toBeInTheDocument();
    });

    it('vises ikke for revurdering', async () => {
      customRenderMedRoller(
        <SaksmenyDropdown behandling={behandling} visning={{ ...visning, typeBehandling: 'Revurdering' }} />,
        [Roller.SAKSBEHANDLER_NASJONAL]
      );
      await åpneMeny();
      expect(screen.queryByRole('button', { name: 'Trekk søknad' })).not.toBeInTheDocument();
    });

    it('vises ikke dersom behandlingen allerede behandler trekk av søknad', async () => {
      customRenderMedRoller(
        <SaksmenyDropdown
          behandling={behandling}
          visning={visning}
          flyt={[flytGruppe('SØKNAD', true)]}
        />,
        [Roller.SAKSBEHANDLER_NASJONAL]
      );
      await åpneMeny();
      expect(screen.queryByRole('button', { name: 'Trekk søknad' })).not.toBeInTheDocument();
    });
  });

  describe('Avbryt revurdering', () => {
    const revurdering = { ...visning, typeBehandling: 'Revurdering' as const };

    it('vises for beslutter på revurdering som ikke er iverksatt', async () => {
      customRenderMedRoller(
        <SaksmenyDropdown behandling={behandling} visning={revurdering} />,
        [Roller.SAKSBEHANDLER_NASJONAL, Roller.BESLUTTER]
      );
      await åpneMeny();
      expect(screen.getByRole('button', { name: 'Avbryt behandling' })).toBeVisible();
    });

    it('vises ikke for bruker som ikke er beslutter', async () => {
      customRenderMedRoller(<SaksmenyDropdown behandling={behandling} visning={revurdering} />, [
        Roller.SAKSBEHANDLER_NASJONAL,
      ]);
      await åpneMeny();
      expect(screen.queryByRole('button', { name: 'Avbryt behandling' })).not.toBeInTheDocument();
    });

    it('vises ikke når behandlingen er iverksatt', async () => {
      customRenderMedRoller(
        <SaksmenyDropdown behandling={{ ...behandling, status: 'IVERKSETTES' }} visning={revurdering} />,
        [Roller.SAKSBEHANDLER_NASJONAL, Roller.BESLUTTER]
      );
      await åpneMeny();
      expect(screen.queryByRole('button', { name: 'Avbryt behandling' })).not.toBeInTheDocument();
    });

    it('vises ikke dersom revurderingen allerede skal avbrytes', async () => {
      customRenderMedRoller(
        <SaksmenyDropdown
          behandling={behandling}
          visning={revurdering}
          flyt={[flytGruppe('AVBRYT_REVURDERING', true)]}
        />,
        [Roller.SAKSBEHANDLER_NASJONAL, Roller.BESLUTTER]
      );
      await åpneMeny();
      expect(screen.queryByRole('button', { name: 'Avbryt behandling' })).not.toBeInTheDocument();
    });
  });

  describe('Avbryt aktivitetspliktbehandling', () => {
    const aktivitetsplikt = { ...visning, typeBehandling: 'Aktivitetsplikt' as const };

    it('vises for saksbehandler på aktivitetspliktbehandling som ikke er iverksatt', async () => {
      customRenderMedRoller(<SaksmenyDropdown behandling={behandling} visning={aktivitetsplikt} />, [
        Roller.SAKSBEHANDLER_NASJONAL,
      ]);
      await åpneMeny();
      expect(screen.getByRole('button', { name: 'Avbryt behandling' })).toBeVisible();
    });

    it('vises ikke når behandlingen er iverksatt', async () => {
      customRenderMedRoller(
        <SaksmenyDropdown behandling={{ ...behandling, status: 'IVERKSETTES' }} visning={aktivitetsplikt} />,
        [Roller.SAKSBEHANDLER_NASJONAL]
      );
      await åpneMeny();
      expect(screen.queryByRole('button', { name: 'Avbryt behandling' })).not.toBeInTheDocument();
    });

    it('vises ikke dersom behandlingen allerede skal avbrytes', async () => {
      customRenderMedRoller(
        <SaksmenyDropdown
          behandling={behandling}
          visning={aktivitetsplikt}
          flyt={[flytGruppe('AVBRYT_AKTIVITETSPLIKTBEHANDLING', true)]}
        />,
        [Roller.SAKSBEHANDLER_NASJONAL]
      );
      await åpneMeny();
      expect(screen.queryByRole('button', { name: 'Avbryt behandling' })).not.toBeInTheDocument();
    });
  });

  describe('Trekk klage', () => {
    const klageBehandling: DetaljertBehandling = { ...behandling, type: 'Klage' };

    it('vises for klagebehandling når bruker kan saksbehandle', async () => {
      customRenderMedRoller(<SaksmenyDropdown behandling={klageBehandling} visning={visning} />, [
        Roller.SAKSBEHANDLER_NASJONAL,
      ]);
      await åpneMeny();
      expect(screen.getByRole('button', { name: 'Trekk klage' })).toBeVisible();
    });

    it('vises ikke for behandlinger som ikke er klage', async () => {
      customRenderMedRoller(<SaksmenyDropdown behandling={behandling} visning={visning} />, [
        Roller.SAKSBEHANDLER_NASJONAL,
      ]);
      await åpneMeny();
      expect(screen.queryByRole('button', { name: 'Trekk klage' })).not.toBeInTheDocument();
    });

    it('vises ikke dersom klagen allerede skal trekkes', async () => {
      customRenderMedRoller(
        <SaksmenyDropdown
          behandling={klageBehandling}
          visning={visning}
          flyt={[flytGruppe('TREKK_KLAGE', true)]}
        />,
        [Roller.SAKSBEHANDLER_NASJONAL]
      );
      await åpneMeny();
      expect(screen.queryByRole('button', { name: 'Trekk klage' })).not.toBeInTheDocument();
    });
  });

  describe('Overstyr starttidspunkt (§ 22-13 syvende ledd)', () => {
    it('vises for førstegangsbehandling som ikke er iverksatt', async () => {
      customRenderMedRoller(<SaksmenyDropdown behandling={behandling} visning={visning} />, [
        Roller.SAKSBEHANDLER_NASJONAL,
      ]);
      await åpneMeny();
      expect(screen.getByRole('button', { name: 'Vurder § 22-13 syvende ledd' })).toBeVisible();
    });

    it('vises for revurdering som ikke er iverksatt', async () => {
      customRenderMedRoller(
        <SaksmenyDropdown behandling={behandling} visning={{ ...visning, typeBehandling: 'Revurdering' }} />,
        [Roller.SAKSBEHANDLER_NASJONAL]
      );
      await åpneMeny();
      expect(screen.getByRole('button', { name: 'Vurder § 22-13 syvende ledd' })).toBeVisible();
    });

    it('vises ikke når behandlingen er iverksatt', async () => {
      customRenderMedRoller(
        <SaksmenyDropdown behandling={{ ...behandling, status: 'IVERKSETTES' }} visning={visning} />,
        [Roller.SAKSBEHANDLER_NASJONAL]
      );
      await åpneMeny();
      expect(screen.queryByRole('button', { name: 'Vurder § 22-13 syvende ledd' })).not.toBeInTheDocument();
    });

    it('vises ikke når bruker ikke kan saksbehandle', async () => {
      customRender(<SaksmenyDropdown behandling={behandling} visning={visning} />);
      await åpneMeny();
      expect(screen.queryByRole('button', { name: 'Vurder § 22-13 syvende ledd' })).not.toBeInTheDocument();
    });
  });

  describe('Marker som haster', () => {
    it('vises når bruker kan saksbehandle', async () => {
      customRenderMedRoller(<SaksmenyDropdown behandling={behandling} visning={visning} />, [
        Roller.SAKSBEHANDLER_NASJONAL,
      ]);
      await åpneMeny();
      expect(screen.getByRole('button', { name: 'Marker som haster' })).toBeVisible();
    });

    it('vises ikke når bruker ikke kan saksbehandle', async () => {
      customRender(<SaksmenyDropdown behandling={behandling} visning={visning} />);
      await åpneMeny();
      expect(screen.queryByRole('button', { name: 'Marker som haster' })).not.toBeInTheDocument();
    });
  });

  describe('Vurder avslag § 11-27', () => {
    it('vises for førstegangsbehandling som ikke er iverksatt', async () => {
      customRenderMedRoller(<SaksmenyDropdown behandling={behandling} visning={visning} />, [
        Roller.SAKSBEHANDLER_NASJONAL,
      ]);
      await åpneMeny();
      expect(screen.getByRole('button', { name: 'Vurder avslag § 11-27' })).toBeVisible();
    });

    it('vises ikke når behandlingen er iverksatt', async () => {
      customRenderMedRoller(
        <SaksmenyDropdown behandling={{ ...behandling, status: 'IVERKSETTES' }} visning={visning} />,
        [Roller.SAKSBEHANDLER_NASJONAL]
      );
      await åpneMeny();
      expect(screen.queryByRole('button', { name: 'Vurder avslag § 11-27' })).not.toBeInTheDocument();
    });

    it('vises ikke dersom avslag allerede er valgt', async () => {
      customRenderMedRoller(
        <SaksmenyDropdown
          behandling={behandling}
          visning={visning}
          flyt={[flytGruppe('AVSLAG_11_27', true)]}
        />,
        [Roller.SAKSBEHANDLER_NASJONAL]
      );
      await åpneMeny();
      expect(screen.queryByRole('button', { name: 'Vurder avslag § 11-27' })).not.toBeInTheDocument();
    });
  });

  it('åpner modal for å sette behandling på vent når menyvalget trykkes', async () => {
    customRender(<SaksmenyDropdown behandling={behandling} visning={visning} />);
    await åpneMeny();
    await user.click(screen.getByRole('button', { name: 'Sett behandling på vent' }));
    expect(screen.getByRole('heading', { name: /vent/i })).toBeVisible();
  });
});
