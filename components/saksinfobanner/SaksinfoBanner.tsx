'use client';

import { BodyShort, Button, CopyButton, Dropdown, HStack, Label, Link, Tag } from '@navikt/ds-react';
import { DetaljertBehandling, FlytGruppe, FlytVisning, SakPersoninfo, SaksInfo as SaksInfoType } from 'lib/types/types';
import { useState } from 'react';
import { SettBehandllingPåVentModal } from 'components/settbehandlingpåventmodal/SettBehandllingPåVentModal';
import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons';

import styles from './SaksinfoBanner.module.css';
import { Behandlingsstatus } from 'components/behandlingsstatus/Behandlingsstatus';
import { OppgaveStatus, OppgaveStatusType } from 'components/oppgavestatus/OppgaveStatus';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';
import { TrekkSøknadModal } from 'components/saksinfobanner/trekksøknadmodal/TrekkSøknadModal';
import { VurderRettighetsperiodeModal } from './rettighetsperiodemodal/VurderRettighetsperiodeModal';
import { TrekkKlageModal } from './trekkklagemodal/TrekkKlageModal';
import { AdressebeskyttelseStatus } from 'components/adressebeskyttelsestatus/AdressebeskyttelseStatus';
import { utledAdressebeskyttelse } from 'lib/utils/adressebeskyttelse';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { SvarFraBehandler } from 'components/saksinfobanner/svarfrabehandler/SvarFraBehandler';
import { SettMarkeringForBehandlingModal } from 'components/settmarkeringforbehandlingmodal/SettMarkeringForBehandlingModal';
import { MarkeringType, Oppgave } from 'lib/types/oppgaveTypes';
import { NoNavAapOppgaveMarkeringMarkeringDtoMarkeringType } from '@navikt/aap-oppgave-typescript-types';
import { MarkeringInfoboks } from 'components/markeringinfoboks/MarkeringInfoboks';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { AvbrytRevurderingModal } from 'components/saksinfobanner/avbrytrevurderingmodal/AvbrytRevurderingModal';
import { isProd } from 'lib/utils/environment';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  personInformasjon: SakPersoninfo;
  sak: SaksInfoType;
  referanse?: string;
  behandling?: DetaljertBehandling;
  oppgave?: Oppgave;
  brukerInformasjon?: BrukerInformasjon;
  brukerKanSaksbehandle?: boolean;
  flyt?: FlytGruppe[];
  visning?: FlytVisning;
  brukerErBeslutter?: boolean;
}

export const SaksinfoBanner = ({
  personInformasjon,
  sak,
  referanse,
  behandling,
  oppgave,
  brukerInformasjon,
  brukerKanSaksbehandle,
  flyt,
  visning,
  brukerErBeslutter,
}: Props) => {
  const [settBehandlingPåVentmodalIsOpen, setSettBehandlingPåVentmodalIsOpen] = useState(false);
  const [visTrekkSøknadModal, settVisTrekkSøknadModal] = useState(false);
  const [visTrekkKlageModal, settVisTrekkKlageModal] = useState(false);
  const [visAvbrytRevurderingModal, settVisAvbrytRevurderingModal] = useState(false);
  const [visVurderRettighetsperiodeModal, settVisVurderRettighetsperiodeModal] = useState(false);
  const [visHarUlesteDokumenter, settVisHarUlesteDokumenter] = useState(!!oppgave?.harUlesteDokumenter);
  const [aktivMarkeringType, settAktivMarkeringType] = useState<MarkeringType | null>(null);
  const erReservertAvInnloggetBruker = brukerInformasjon?.NAVident === oppgave?.reservertAv;

  const søknadStegGruppe = flyt && flyt.find((f) => f.stegGruppe === 'SØKNAD');
  const avbrytRevurderingSteg = flyt && flyt.find((f) => f.stegGruppe === 'AVBRYT_REVURDERING');
  const behandlerEnSøknadSomSkalTrekkes = søknadStegGruppe && søknadStegGruppe.skalVises;
  const behandlerRevurderingSomSkalAvbrytes = avbrytRevurderingSteg && avbrytRevurderingSteg.skalVises;

  const trekkKlageSteg = flyt && flyt.find((f) => f.stegGruppe === 'TREKK_KLAGE');
  const harAlleredeValgtTrekkKlage = trekkKlageSteg && trekkKlageSteg.skalVises;

  const typeBehandling = visning?.typeBehandling;
  const behandlingErFørstegangsbehandling = typeBehandling && typeBehandling === 'Førstegangsbehandling';
  const behandlingErRevurdering = typeBehandling && typeBehandling === 'Revurdering';
  const behandlingErIkkeAvsluttet = behandling && behandling.status !== 'AVSLUTTET';
  const behandlingErIkkeIverksatt = behandling && behandling.status !== 'IVERKSETTES';

  const adressebeskyttelser = oppgave ? utledAdressebeskyttelse(oppgave) : [];

  const visValgForÅTrekkeSøknad =
    !behandlerEnSøknadSomSkalTrekkes &&
    brukerKanSaksbehandle &&
    behandlingErFørstegangsbehandling &&
    behandlingErIkkeAvsluttet;

  const visValgForÅAvbryteRevurdering =
    !isProd() &&
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

  const hentOppgaveStatus = (): OppgaveStatusType | undefined => {
    if (oppgave?.reservertAv && !erReservertAvInnloggetBruker) {
      return { status: 'RESERVERT', label: `Reservert ${oppgave.reservertAvNavn ?? oppgave.reservertAv}` };
    } else if (visning?.visVentekort) {
      return { status: 'PÅ_VENT', label: 'På vent' };
    } else if (sak.søknadErTrukket) {
      return { status: 'TRUKKET', label: 'Trukket' };
    } else if (visning?.resultatKode) {
      return { status: 'AVBRUTT', label: 'Avbrutt' };
    }
  };

  const behandlingsreferanse = useBehandlingsReferanse();
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

          {personInformasjon.dødsdato && (
            <Tag variant="alt1" size="small">
              &#10013; {formaterDatoForFrontend(personInformasjon.dødsdato)}
            </Tag>
          )}

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
          {oppgave?.markeringer?.map((markering) => (
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
                </Dropdown.Menu.GroupedList>
              </Dropdown.Menu>
            </Dropdown>

            <SettBehandllingPåVentModal
              behandlingsReferanse={referanse}
              reservert={!!oppgave?.reservertAv}
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
            <AvbrytRevurderingModal
              isOpen={visAvbrytRevurderingModal}
              onClose={() => settVisAvbrytRevurderingModal(false)}
              saksnummer={sak.saksnummer}
              behandlingReferanse={behandlingsreferanse}
              navIdent={brukerInformasjon?.NAVident ? brukerInformasjon.NAVident : null}
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
