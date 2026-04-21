import { Button, Dropdown } from '@navikt/ds-react';
import { DetaljertBehandling, FlytGruppe, FlytVisning } from 'lib/types/types';
import { useState } from 'react';
import { SettBehandlingPåVentModal } from 'components/settbehandlingpåventmodal/SettBehandlingPåVentModal';
import { ChevronDownIcon } from '@navikt/aksel-icons';

import styles from './SaksinfoBanner.module.css';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';
import { TrekkSøknadModal } from 'components/saksinfobanner/trekksøknadmodal/TrekkSøknadModal';
import { VurderRettighetsperiodeModal } from './rettighetsperiodemodal/VurderRettighetsperiodeModal';
import { TrekkKlageModal } from './trekkklagemodal/TrekkKlageModal';
import { SettMarkeringForBehandlingModal } from 'components/settmarkeringforbehandlingmodal/SettMarkeringForBehandlingModal';
import { MarkeringType, Oppgave } from 'lib/types/oppgaveTypes';
import { NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType } from '@navikt/aap-oppgave-typescript-types';
import { AvbrytRevurderingModal } from 'components/saksinfobanner/avbrytrevurderingmodal/AvbrytRevurderingModal';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';

export const SaksmenyDropdown = ({
  flyt,
  visning,
  brukerInformasjon,
  behandling,
  oppgave,
  brukerKanSaksbehandle,
  brukerErBeslutter,
}: {
  flyt?: FlytGruppe[];
  visning?: FlytVisning;
  brukerInformasjon?: BrukerInformasjon;
  behandling: DetaljertBehandling;
  oppgave?: Oppgave;
  brukerKanSaksbehandle?: boolean;
  brukerErBeslutter?: boolean;
}) => {
  const { saksnummer } = useParamsMedType();

  const [settBehandlingPåVentmodalIsOpen, setSettBehandlingPåVentmodalIsOpen] = useState(false);
  const [visTrekkSøknadModal, settVisTrekkSøknadModal] = useState(false);
  const [visTrekkKlageModal, settVisTrekkKlageModal] = useState(false);
  const [visAvbrytRevurderingModal, settVisAvbrytRevurderingModal] = useState(false);
  const [visVurderRettighetsperiodeModal, settVisVurderRettighetsperiodeModal] = useState(false);
  const [aktivMarkeringType, settAktivMarkeringType] = useState<MarkeringType | null>(null);

  const søknadStegGruppe = flyt && flyt.find((f) => f.stegGruppe === 'SØKNAD');
  const avbrytRevurderingSteg = flyt && flyt.find((f) => f.stegGruppe === 'AVBRYT_REVURDERING');
  const behandlerEnSøknadSomSkalTrekkes = søknadStegGruppe && søknadStegGruppe.skalVises;
  const behandlerRevurderingSomSkalAvbrytes = avbrytRevurderingSteg && avbrytRevurderingSteg.skalVises;

  const trekkKlageSteg = flyt && flyt.find((f) => f.stegGruppe === 'TREKK_KLAGE');
  const harAlleredeValgtTrekkKlage = trekkKlageSteg && trekkKlageSteg.skalVises;

  const typeBehandling = visning?.typeBehandling;
  const behandlingErFørstegangsbehandling = typeBehandling && typeBehandling === 'Førstegangsbehandling';
  const behandlingErRevurdering = typeBehandling && typeBehandling === 'Revurdering';
  const behandlingErIkkeAvsluttet = behandling.status !== 'AVSLUTTET';
  const behandlingErIkkeIverksatt = behandling.status !== 'IVERKSETTES';

  const visValgForÅTrekkeSøknad =
    !behandlerEnSøknadSomSkalTrekkes &&
    brukerKanSaksbehandle &&
    behandlingErFørstegangsbehandling &&
    behandlingErIkkeAvsluttet;

  const visValgForÅAvbryteRevurdering =
    behandlingErIkkeIverksatt &&
    brukerErBeslutter &&
    !behandlerRevurderingSomSkalAvbrytes &&
    brukerKanSaksbehandle &&
    behandlingErRevurdering &&
    behandlingErIkkeAvsluttet;

  const visValgForÅTrekkeKlage =
    brukerKanSaksbehandle && !harAlleredeValgtTrekkKlage && behandlingErIkkeAvsluttet && behandling?.type === 'Klage';

  const visValgForÅOverstyreStarttidspunkt =
    brukerKanSaksbehandle &&
    (behandlingErRevurdering || behandlingErFørstegangsbehandling) &&
    behandlingErIkkeAvsluttet &&
    behandlingErIkkeIverksatt;

  const visValgForÅSetteMarkering = brukerKanSaksbehandle && behandlingErIkkeAvsluttet;

  return (
    <div className={styles.saksmeny}>
      <Dropdown>
        <Button
          size={'small'}
          as={Dropdown.Toggle}
          variant={'secondary'}
          icon={<ChevronDownIcon title="chevron-saksmeny" fontSize="1.5rem" aria-hidden />}
          iconPosition={'right'}
        >
          Saksmeny
        </Button>

        <Dropdown.Menu className={styles.saksmenyDropdown}>
          <Dropdown.Menu.GroupedList>
            {behandlingErIkkeAvsluttet && (
              <Dropdown.Menu.GroupedList.Item onClick={() => setSettBehandlingPåVentmodalIsOpen(true)}>
                Sett behandling på vent
              </Dropdown.Menu.GroupedList.Item>
            )}
            {visValgForÅTrekkeSøknad && (
              <Dropdown.Menu.GroupedList.Item onClick={() => settVisTrekkSøknadModal(true)}>
                Trekk søknad
              </Dropdown.Menu.GroupedList.Item>
            )}
            {visValgForÅAvbryteRevurdering && (
              <Dropdown.Menu.GroupedList.Item onClick={() => settVisAvbrytRevurderingModal(true)}>
                Avbryt behandling
              </Dropdown.Menu.GroupedList.Item>
            )}
            {visValgForÅTrekkeKlage && (
              <Dropdown.Menu.GroupedList.Item onClick={() => settVisTrekkKlageModal(true)}>
                Trekk klage
              </Dropdown.Menu.GroupedList.Item>
            )}
            {visValgForÅOverstyreStarttidspunkt && (
              <Dropdown.Menu.GroupedList.Item onClick={() => settVisVurderRettighetsperiodeModal(true)}>
                Vurder § 22-13 syvende ledd
              </Dropdown.Menu.GroupedList.Item>
            )}
            {visValgForÅSetteMarkering && (
              <Dropdown.Menu.GroupedList.Item
                onClick={() => settAktivMarkeringType(NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType.HASTER)}
              >
                Marker som haster
              </Dropdown.Menu.GroupedList.Item>
            )}
          </Dropdown.Menu.GroupedList>
        </Dropdown.Menu>
      </Dropdown>

      <SettBehandlingPåVentModal
        behandlingsreferanse={behandling.referanse}
        reservert={!!oppgave?.reservertAv}
        isOpen={settBehandlingPåVentmodalIsOpen}
        onClose={() => setSettBehandlingPåVentmodalIsOpen(false)}
      />
      <TrekkSøknadModal
        isOpen={visTrekkSøknadModal}
        onClose={() => settVisTrekkSøknadModal(false)}
        saksnummer={saksnummer}
        behandlingReferanse={behandling?.referanse!}
        navIdent={brukerInformasjon?.NAVident ? brukerInformasjon.NAVident : null}
      />
      <TrekkKlageModal
        isOpen={visTrekkKlageModal}
        onClose={() => settVisTrekkKlageModal(false)}
        saksnummer={saksnummer}
        behandlingReferanse={behandling?.referanse!}
      />
      <AvbrytRevurderingModal
        isOpen={visAvbrytRevurderingModal}
        onClose={() => settVisAvbrytRevurderingModal(false)}
        saksnummer={saksnummer}
        behandlingReferanse={behandling.referanse}
        navIdent={brukerInformasjon?.NAVident ? brukerInformasjon.NAVident : null}
      />
      <VurderRettighetsperiodeModal
        isOpen={visVurderRettighetsperiodeModal}
        behandlingReferanse={behandling?.referanse!}
        onClose={() => settVisVurderRettighetsperiodeModal(false)}
        saksnummer={saksnummer}
        behandling={behandling}
      />
      {aktivMarkeringType && (
        <SettMarkeringForBehandlingModal
          referanse={behandling?.referanse!}
          type={aktivMarkeringType}
          isOpen={true}
          onClose={() => settAktivMarkeringType(null)}
        />
      )}
    </div>
  );
};
