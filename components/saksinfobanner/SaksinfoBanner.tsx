'use client';

import { BodyShort, Button, CopyButton, Dropdown, HStack, Label, Link } from '@navikt/ds-react';
import {
  DetaljertBehandling,
  FlytGruppe,
  SakPersoninfo,
  SaksInfo as SaksInfoType,
  TypeBehandling,
} from 'lib/types/types';
import { useState } from 'react';
import { SettBehandllingPåVentModal } from 'components/settbehandlingpåventmodal/SettBehandllingPåVentModal';
import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons';

import styles from './SaksinfoBanner.module.css';
import { Behandlingsstatus } from 'components/behandlingsstatus/Behandlingsstatus';
import { OppgaveStatus, OppgaveStatusType } from 'components/oppgavestatus/OppgaveStatus';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';
import { TrekkSøknadModal } from 'components/saksinfobanner/trekksøknadmodal/TrekkSøknadModal';
import { VurderRettighetsperiodeModal } from './rettighetsperiodemodal/VurderRettighetsperiodeModal';
import { isProd } from 'lib/utils/environment';
import { TrekkKlageModal } from './trekkklagemodal/TrekkKlageModal';
import { AdressebeskyttelseStatus } from 'components/adressebeskyttelsestatus/AdressebeskyttelseStatus';
import { Adressebeskyttelsesgrad } from 'lib/utils/adressebeskyttelse';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { SvarFraBehandler } from 'components/saksinfobanner/svarfrabehandler/SvarFraBehandler';
import { SettMarkeringForBehandlingModal } from 'components/settmarkeringforbehandlingmodal/SettMarkeringForBehandlingModal';
import { Markering, MarkeringType } from 'lib/types/oppgaveTypes';
import { NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType } from '@navikt/aap-oppgave-typescript-types';
import { MarkeringInfoboks } from 'components/markeringinfoboks/MarkeringInfoboks';

interface Props {
  personInformasjon: SakPersoninfo;
  sak: SaksInfoType;
  typeBehandling?: TypeBehandling;
  referanse?: string;
  behandling?: DetaljertBehandling;
  oppgaveReservertAv?: string | null;
  påVent?: boolean;
  brukerInformasjon?: BrukerInformasjon;
  brukerKanSaksbehandle?: boolean;
  flyt?: FlytGruppe[];
  adressebeskyttelser?: Adressebeskyttelsesgrad[];
  markeringer?: Markering[] | null;
  harUlesteDokumenter?: boolean | null;
}

export const SaksinfoBanner = ({
  personInformasjon,
  sak,
  referanse,
  behandling,
  oppgaveReservertAv,
  påVent,
  brukerInformasjon,
  typeBehandling,
  brukerKanSaksbehandle,
  flyt,
  adressebeskyttelser,
  markeringer,
  harUlesteDokumenter,
}: Props) => {
  const [settBehandlingPåVentmodalIsOpen, setSettBehandlingPåVentmodalIsOpen] = useState(false);
  const [visTrekkSøknadModal, settVisTrekkSøknadModal] = useState(false);
  const [visTrekkKlageModal, settVisTrekkKlageModal] = useState(false);
  const [visVurderRettighetsperiodeModal, settVisVurderRettighetsperiodeModal] = useState(false);
  const [visHarUlesteDokumenter, settVisHarUlesteDokumenter] = useState(!!harUlesteDokumenter);
  const [aktivMarkeringType, settAktivMarkeringType] = useState<MarkeringType | null>(null);
  const erReservertAvInnloggetBruker = brukerInformasjon?.NAVident === oppgaveReservertAv;

  const søknadStegGruppe = flyt && flyt.find((f) => f.stegGruppe === 'SØKNAD');
  const behandlerEnSøknadSomSkalTrekkes = søknadStegGruppe && søknadStegGruppe.skalVises;

  const trekkKlageSteg = flyt && flyt.find((f) => f.stegGruppe === 'TREKK_KLAGE');
  const harAlleredeValgtTrekkKlage = trekkKlageSteg && trekkKlageSteg.skalVises;

  const behandlingErFørstegangsbehandling = typeBehandling && typeBehandling === 'Førstegangsbehandling';
  const behandlingErRevurdering = typeBehandling && typeBehandling === 'Revurdering';
  const behandlingErIkkeAvsluttet = behandling && behandling.status !== 'AVSLUTTET';
  const behandlingErIkkeIverksatt = behandling && behandling.status !== 'IVERKSETTES';

  const visValgForÅTrekkeSøknad =
    !behandlerEnSøknadSomSkalTrekkes &&
    brukerKanSaksbehandle &&
    behandlingErFørstegangsbehandling &&
    behandlingErIkkeAvsluttet;

  const visValgForÅTrekkeKlage =
    !isProd() &&
    brukerKanSaksbehandle &&
    !harAlleredeValgtTrekkKlage &&
    behandlingErIkkeAvsluttet &&
    behandling?.type === 'Klage';

  const visValgForÅOverstyreStarttidspunkt =
    brukerKanSaksbehandle &&
    (behandlingErRevurdering || behandlingErFørstegangsbehandling) &&
    behandlingErIkkeAvsluttet &&
    behandlingErIkkeIverksatt;

  const visValgForÅSetteMarkering = !isProd() && brukerKanSaksbehandle && behandlingErIkkeAvsluttet;

  const hentOppgaveStatus = (): OppgaveStatusType | undefined => {
    if (oppgaveReservertAv && !erReservertAvInnloggetBruker) {
      return { status: 'RESERVERT', label: `Reservert ${oppgaveReservertAv}` };
    } else if (påVent === true) {
      return { status: 'PÅ_VENT', label: 'På vent' };
    } else if (sak.søknadErTrukket) {
      return { status: 'TRUKKET', label: 'Trukket' };
    }
  };

  const oppgaveStatus = hentOppgaveStatus();

  const erPåBehandlingSiden = referanse !== undefined;
  return (
    <div className={styles.saksinfobanner}>
      <div className={styles.saksinfo}>
        <HStack gap={'2'} align="center">
          <Label size="small">
            <Link href={`/saksbehandling/sak/${sak.saksnummer}`} title="Tilbake til saksoversikt">
              {storForbokstavIHvertOrd(personInformasjon.navn)}
            </Link>
          </Label>

          <CopyButton
            copyText={sak?.ident}
            size="xsmall"
            text={sak?.ident}
            iconPosition="right"
            className={styles.copybutton}
          />

          {erPåBehandlingSiden && behandling && (
            <>
              <ChevronRightIcon className={styles.chevron} />
              <BodyShort size={'small'}>Sak {sak.saksnummer}</BodyShort>
              <ChevronRightIcon className={styles.chevron} />
              <BodyShort size={'small'}>{behandling.type}</BodyShort>
              <Behandlingsstatus status={behandling.status} />
            </>
          )}
        </HStack>
      </div>

      {erPåBehandlingSiden && (
        <HStack>
          {adressebeskyttelser?.map((adressebeskyttelse) => (
            <div key={adressebeskyttelse} className={styles.oppgavestatus}>
              <AdressebeskyttelseStatus adressebeskyttelsesGrad={adressebeskyttelse} />
            </div>
          ))}
          {visHarUlesteDokumenter && (
            <div className={styles.oppgavestatus}>
              <SvarFraBehandler
                behandlingReferanse={referanse}
                oppdaterVisHarUlesteDokumenter={settVisHarUlesteDokumenter}
              />
            </div>
          )}
          {oppgaveStatus && (
            <div className={styles.oppgavestatus}>
              <OppgaveStatus oppgaveStatus={oppgaveStatus} />
            </div>
          )}
          {markeringer?.map((markering) => (
            <div className={styles.oppgavestatus} key={markering.markeringType}>
              <MarkeringInfoboks markering={markering} referanse={behandling?.referanse} showLabel={true} />
            </div>
          ))}
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
              <Dropdown.Menu>
                <Dropdown.Menu.GroupedList>
                  <Dropdown.Menu.GroupedList.Item onClick={() => setSettBehandlingPåVentmodalIsOpen(true)}>
                    Sett behandling på vent
                  </Dropdown.Menu.GroupedList.Item>
                  {visValgForÅTrekkeSøknad && (
                    <Dropdown.Menu.GroupedList.Item onClick={() => settVisTrekkSøknadModal(true)}>
                      Trekk søknad
                    </Dropdown.Menu.GroupedList.Item>
                  )}
                  {visValgForÅTrekkeKlage && (
                    <Dropdown.Menu.GroupedList.Item onClick={() => settVisTrekkKlageModal(true)}>
                      Trekk klage
                    </Dropdown.Menu.GroupedList.Item>
                  )}
                  {visValgForÅOverstyreStarttidspunkt && (
                    <Dropdown.Menu.GroupedList.Item onClick={() => settVisVurderRettighetsperiodeModal(true)}>
                      Overstyr starttidspunkt
                    </Dropdown.Menu.GroupedList.Item>
                  )}
                  {visValgForÅSetteMarkering && (
                    <Dropdown.Menu.GroupedList.Item
                      onClick={() => settAktivMarkeringType(NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType.HASTER)}
                    >
                      Marker som haster
                    </Dropdown.Menu.GroupedList.Item>
                  )}
                  {visValgForÅSetteMarkering && (
                    <Dropdown.Menu.GroupedList.Item
                      onClick={() =>
                        settAktivMarkeringType(
                          NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType.KREVER_SPESIALKOMPETANSE
                        )
                      }
                    >
                      Marker med krever spesialkompetanse
                    </Dropdown.Menu.GroupedList.Item>
                  )}
                </Dropdown.Menu.GroupedList>
              </Dropdown.Menu>
            </Dropdown>

            <SettBehandllingPåVentModal
              behandlingsReferanse={referanse}
              reservert={!!oppgaveReservertAv}
              isOpen={settBehandlingPåVentmodalIsOpen}
              onClose={() => setSettBehandlingPåVentmodalIsOpen(false)}
            />
            <TrekkSøknadModal
              isOpen={visTrekkSøknadModal}
              onClose={() => settVisTrekkSøknadModal(false)}
              saksnummer={sak.saksnummer}
              behandlingReferanse={behandling?.referanse!}
            />
            <TrekkKlageModal
              isOpen={visTrekkKlageModal}
              onClose={() => settVisTrekkKlageModal(false)}
              saksnummer={sak.saksnummer}
              behandlingReferanse={behandling?.referanse!}
            />
            <VurderRettighetsperiodeModal
              isOpen={visVurderRettighetsperiodeModal}
              behandlingReferanse={behandling?.referanse!}
              onClose={() => settVisVurderRettighetsperiodeModal(false)}
              saksnummer={sak.saksnummer}
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
        </HStack>
      )}
    </div>
  );
};
