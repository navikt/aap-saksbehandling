import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { render, screen, waitFor } from 'lib/test/CustomRender';
import { Hjemmel } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { KlagebehandlingVurderingNay } from './klagebehandlingnay/KlagebehandlingVurderingNay';
import { KlagebehandlingVurderingKontor } from './klagebehandlingkontor/klagebehandlingkontor/KlagebehandlingVurderingKontor';
import * as løsAvklaringsbehovHook from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';

const hjemler: { hjemmel: Hjemmel; label: string }[] = [
  { hjemmel: 'FOLKETRYGDLOVEN_22_7', label: '§ 22-7' },
  { hjemmel: 'FOLKETRYGDLOVEN_22_8', label: '§ 22-8' },
  { hjemmel: 'FOLKETRYGDLOVEN_22_14_FJERDE_LEDD', label: '§ 22-14 fjerde ledd' },
];

async function velgHjemmel(user: ReturnType<typeof userEvent.setup>, feltnavn: string, hjemmel: string) {
  const combobox = screen.getByRole('combobox', { name: feltnavn });
  await user.type(combobox, hjemmel);
  await user.keyboard('{ArrowDown}{Enter}');
  return combobox;
}

describe.each([
  {
    navn: 'NAY',
    Komponent: KlagebehandlingVurderingNay,
    steg: 'KLAGEBEHANDLING_NAY' as const,
    behovstype: Behovstype.VURDER_KLAGE_NAY,
    vurderingsfelt: 'klagevurderingNay',
    knappOpprettholdelse: 'Send til klageinstans',
    knappOmgjøring: 'Send til beslutter',
  },
  {
    navn: 'Nav-kontor',
    Komponent: KlagebehandlingVurderingKontor,
    steg: 'KLAGEBEHANDLING_KONTOR' as const,
    behovstype: Behovstype.VURDER_KLAGE_KONTOR,
    vurderingsfelt: 'klagevurderingKontor',
    knappOpprettholdelse: 'Send til kvalitetssikrer',
    knappOmgjøring: 'Send til kvalitetssikrer',
  },
])(
  'Klage på nye hjemler hos $navn',
  ({ Komponent, steg, behovstype, vurderingsfelt, knappOpprettholdelse, knappOmgjøring }) => {
    const løsAvklaringsbehov = vi.fn();

    beforeEach(() => {
      løsAvklaringsbehov.mockClear();
      setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: steg });
      vi.spyOn(løsAvklaringsbehovHook, 'useLøsAvklaringsbehov').mockReturnValue({
        løsAvklaringsbehov,
        løsPeriodisertAvklaringsbehov: vi.fn(),
        løsAvklaringsbehovIsLoading: false,
        løsAvklaringsbehovStatus: undefined,
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it.each([
      { radio: 'Vedtak opprettholdes', innstilling: 'OPPRETTHOLD', delvisOmgjøring: false },
      { radio: 'Delvis omgjøring', innstilling: 'DELVIS_OMGJØR', delvisOmgjøring: true },
    ])(
      'Skal sende alle nye hjemler som opprettholdt ved $innstilling',
      async ({ radio, innstilling, delvisOmgjøring }) => {
        const user = userEvent.setup();
        render(
          <Komponent
            readOnly={false}
            behandlingVersjon={0}
            typeBehandling="Klage"
            grunnlag={{ harTilgangTilÅSaksbehandle: true, påklagetVedtakType: 'KELVIN_BEHANDLING' }}
          />
        );

        await user.type(screen.getByRole('textbox', { name: 'Vurder klage' }), 'Opprettholder de påklagde hjemlene');
        await user.click(screen.getByRole('radio', { name: radio }));

        if (delvisOmgjøring) {
          await velgHjemmel(user, 'Hvilke vilkår skal omgjøres?', '§ 11-5');
        }

        for (const { label } of hjemler) {
          await velgHjemmel(user, 'Hvilke vilkår er blitt vurdert til å opprettholdes?', label);
        }

        await user.click(screen.getByRole('button', { name: delvisOmgjøring ? knappOmgjøring : knappOpprettholdelse }));

        await waitFor(() =>
          expect(løsAvklaringsbehov).toHaveBeenCalledWith(
            expect.objectContaining({
              behov: expect.objectContaining({
                behovstype,
                [vurderingsfelt]: expect.objectContaining({
                  innstilling,
                  vilkårSomOpprettholdes: hjemler.map(({ hjemmel }) => hjemmel),
                  vilkårSomOmgjøres: delvisOmgjøring ? ['FOLKETRYGDLOVEN_11_5'] : [],
                }),
              }),
            }),
            expect.any(Function)
          )
        );
      }
    );

    it.each(
      hjemler.flatMap(({ label }) => [
        { label, radio: 'Vedtak omgjøres', delvisOmgjøring: false },
        { label, radio: 'Delvis omgjøring', delvisOmgjøring: true },
      ])
    )('Skal blokkere omgjøring av $label ved $radio', async ({ label, radio, delvisOmgjøring }) => {
      const user = userEvent.setup();
      render(
        <Komponent
          readOnly={false}
          behandlingVersjon={0}
          typeBehandling="Klage"
          grunnlag={{ harTilgangTilÅSaksbehandle: true, påklagetVedtakType: 'KELVIN_BEHANDLING' }}
        />
      );

      await user.type(screen.getByRole('textbox', { name: 'Vurder klage' }), 'Vurderer omgjøring');
      await user.click(screen.getByRole('radio', { name: radio }));
      const omgjorteHjemler = await velgHjemmel(user, 'Hvilke vilkår skal omgjøres?', label);

      if (delvisOmgjøring) {
        await velgHjemmel(user, 'Hvilke vilkår er blitt vurdert til å opprettholdes?', '§ 11-5');
      }

      await user.click(screen.getByRole('button', { name: knappOmgjøring }));

      expect(
        await screen.findByText(
          `Det er ikke mulig å opprette revurdering på ${label} enda. Sett klagen på vent og ta kontakt med team AAP.`
        )
      ).toBeVisible();
      expect(omgjorteHjemler).toHaveAttribute('aria-invalid', 'true');
      expect(løsAvklaringsbehov).not.toHaveBeenCalled();
    });
  }
);
