'use client';

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
import { useInnloggetBruker } from 'hooks/BrukerHook';
import { brukerErBeslutter, brukerKanSaksbehandle } from 'lib/utils/innloggetBruker';
import { AvbrytAktivitetspliktbehandlingModal } from 'components/saksinfobanner/avbrytaktivitetspliktbehandlingmodal/AvbrytAktivitetspliktbehandlingModal';
import { Avslag11_27Modal } from 'components/saksinfobanner/avslag11_27modal/Avslag11_27Modal';

export const SaksmenyDropdown = ({
  flyt,
  visning,
  brukerInformasjon,
  behandling,
  oppgave,
}: {
  flyt?: FlytGruppe[];
  visning?: FlytVisning;
  brukerInformasjon?: BrukerInformasjon;
  behandling: DetaljertBehandling;
  oppgave?: Oppgave;
}) => {
  const { saksnummer } = useParamsMedType();
  const innloggetBruker = useInnloggetBruker();

  const innloggetBrukerKanSaksbehandle = brukerKanSaksbehandle(innloggetBruker);
  const innloggetBrukerErBeslutter = brukerErBeslutter(innloggetBruker);
  const [settBehandlingPåVentmodalIsOpen, setSettBehandlingPåVentmodalIsOpen] = useState(false);
  const [visTrekkSøknadModal, settVisTrekkSøknadModal] = useState(false);
  const [visTrekkKlageModal, settVisTrekkKlageModal] = useState(false);
  const [visAvbrytRevurderingModal, settVisAvbrytRevurderingModal] = useState(false);
  const [visAvbrytAktivitetspliktbehandlingModal, settVisAvbrytAktivitetspliktbehandlingModal] = useState(false);
  const [visVurderRettighetsperiodeModal, settVisVurderRettighetsperiodeModal] = useState(false);
  const [aktivMarkeringType, settAktivMarkeringType] = useState<MarkeringType | null>(null);

  const søknadStegGruppe = flyt && flyt.find((f) => f.stegGruppe === 'SØKNAD');
  const avbrytRevurderingSteg = flyt && flyt.find((f) => f.stegGruppe === 'AVBRYT_REVURDERING');
  const avbrytAktivitetspliktbehandlingSteg =
    flyt && flyt.find((f) => f.stegGruppe === 'AVBRYT_AKTIVITETSPLIKTBEHANDLING');
  const behandlerEnSøknadSomSkalTrekkes = søknadStegGruppe && søknadStegGruppe.skalVises;
  const behandlerRevurderingSomSkalAvbrytes = avbrytRevurderingSteg && avbrytRevurderingSteg.skalVises;
  const behandlerAktivitetspliktbehandlingSomSkalAvbrytes =
    avbrytAktivitetspliktbehandlingSteg && avbrytAktivitetspliktbehandlingSteg.skalVises;

  const trekkKlageSteg = flyt && flyt.find((f) => f.stegGruppe === 'TREKK_KLAGE');
  const harAlleredeValgtTrekkKlage = trekkKlageSteg && trekkKlageSteg.skalVises;

  const typeBehandling = visning?.typeBehandling;
  const behandlingErFørstegangsbehandling = typeBehandling && typeBehandling === 'Førstegangsbehandling';
  const behandlingErRevurdering = typeBehandling && typeBehandling === 'Revurdering';
  const behandlingErAktivitetspliktbehandling =
    typeBehandling && (typeBehandling === 'Aktivitetsplikt' || typeBehandling === 'Aktivitetsplikt11_9');
  const behandlingErIkkeAvsluttet = behandling.status !== 'AVSLUTTET';
  const behandlingErIkkeIverksatt = behandling.status !== 'IVERKSETTES';
  const [visAvslag1127Modal, settVisAvslag1127Modal] = useState(false);

  const visValgForÅTrekkeSøknad =
    !behandlerEnSøknadSomSkalTrekkes &&
    innloggetBrukerKanSaksbehandle &&
    behandlingErFørstegangsbehandling &&
    behandlingErIkkeAvsluttet;

  const visValgForÅAvbryteRevurdering =
    behandlingErIkkeIverksatt &&
    innloggetBrukerErBeslutter &&
    !behandlerRevurderingSomSkalAvbrytes &&
    innloggetBrukerKanSaksbehandle &&
    behandlingErRevurdering &&
    behandlingErIkkeAvsluttet;

  const visValgForÅAvbryteAktivitetspliktbehandling =
    behandlingErIkkeIverksatt &&
    innloggetBrukerKanSaksbehandle &&
    behandlingErAktivitetspliktbehandling &&
    behandlingErIkkeAvsluttet &&
    !behandlerAktivitetspliktbehandlingSomSkalAvbrytes;

  const visValgForÅTrekkeKlage =
    innloggetBrukerKanSaksbehandle &&
    !harAlleredeValgtTrekkKlage &&
    behandlingErIkkeAvsluttet &&
    behandling?.type === 'Klage';

  const visValgForÅOverstyreStarttidspunkt =
    innloggetBrukerKanSaksbehandle &&
    (behandlingErRevurdering || behandlingErFørstegangsbehandling) &&
    behandlingErIkkeAvsluttet &&
    behandlingErIkkeIverksatt;

  const visValgForÅSetteMarkering = innloggetBrukerKanSaksbehandle && behandlingErIkkeAvsluttet;

  const visValgForAvslag1127 =
    behandlingErIkkeIverksatt &&
    innloggetBrukerKanSaksbehandle &&
    behandlingErIkkeAvsluttet &&
    !behandlerEnSøknadSomSkalTrekkes &&
    !behandlerRevurderingSomSkalAvbrytes;

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
            {visValgForÅAvbryteAktivitetspliktbehandling && (
              <Dropdown.Menu.GroupedList.Item onClick={() => settVisAvbrytAktivitetspliktbehandlingModal(true)}>
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
            {visValgForAvslag1127 && (
              <Dropdown.Menu.GroupedList.Item onClick={() => settVisAvslag1127Modal(true)}>
                Vurder avslag § 11-27
              </Dropdown.Menu.GroupedList.Item>
            )}
          </Dropdown.Menu.GroupedList>
        </Dropdown.Menu>
      </Dropdown>

      <SettBehandlingPåVentModal
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
      <AvbrytAktivitetspliktbehandlingModal
        isOpen={visAvbrytAktivitetspliktbehandlingModal}
        onClose={() => settVisAvbrytAktivitetspliktbehandlingModal(false)}
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
      {visAvslag1127Modal && (
        <Avslag11_27Modal
          isOpen={visAvslag1127Modal}
          onClose={() => settVisAvslag1127Modal(false)}
          saksnummer={saksnummer}
          behandlingReferanse={behandling?.referanse!}
        />
      )}
    </div>
  );
};
