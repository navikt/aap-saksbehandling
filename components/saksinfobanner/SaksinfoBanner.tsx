'use client';

import { BodyShort, Button, CopyButton, Dropdown, HStack, Label, Link, Tag } from '@navikt/ds-react';
import {
  DetaljertBehandling,
  FlytGruppe,
  SakPersoninfo,
  SaksInfo as SaksInfoType,
  TypeBehandling,
} from 'lib/types/types';
import { useState } from 'react';
import { SettBehandllingPåVentModal } from 'components/settbehandlingpåventmodal/SettBehandllingPåVentModal';
import { ChevronDownIcon, ChevronRightIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';

import styles from './SaksinfoBanner.module.css';
import { Behandlingsstatus } from 'components/behandlingsstatus/Behandlingsstatus';
import { OppgaveStatus, OppgaveStatusType } from 'components/oppgavestatus/OppgaveStatus';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';
import { TrekkSøknadModal } from 'components/saksinfobanner/trekksøknadmodal/TrekkSøknadModal';
import { VurderRettighetsperiodeModal } from './rettighetsperiodemodal/VurderRettighetsperiodeModal';
import { isProd } from 'lib/utils/environment';

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
}: Props) => {
  const [settBehandlingPåVentmodalIsOpen, setSettBehandlingPåVentmodalIsOpen] = useState(false);
  const [visTrekkSøknadModal, settVisTrekkSøknadModal] = useState(false);
  const [visVurderRettighetsperiodeModal, settVisVurderRettighetsperiodeModal] = useState(false);
  const erReservertAvInnloggetBruker = brukerInformasjon?.NAVident === oppgaveReservertAv;

  const søknadStegGruppe = flyt && flyt.find((f) => f.stegGruppe === 'SØKNAD');
  const behandlerEnSøknadSomSkalTrekkes = søknadStegGruppe && søknadStegGruppe.skalVises;

  const behandlingErFørstegangsbehandling = typeBehandling && typeBehandling === 'Førstegangsbehandling';
  const behandlingErIkkeAvsluttet = behandling && behandling.status !== 'AVSLUTTET';
  const visValgForÅTrekkeSøknad =
    !isProd() &&
    !behandlerEnSøknadSomSkalTrekkes &&
    brukerKanSaksbehandle &&
    behandlingErFørstegangsbehandling &&
    behandlingErIkkeAvsluttet;

  const hentOppgaveStatus = (): OppgaveStatusType | undefined => {
    if (oppgaveReservertAv && !erReservertAvInnloggetBruker) {
      return { status: 'RESERVERT', label: `Reservert ${oppgaveReservertAv}` };
    } else if (påVent === true) {
      return { status: 'PÅ_VENT', label: 'På vent' };
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
              {personInformasjon.navn}
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
          <div className={styles.oppgavestatus}>
            {sak.søknadErTrukket && (
              <Tag variant={'neutral-moderate'} icon={<XMarkOctagonIcon />} size={'small'}>
                Trukket
              </Tag>
            )}
          </div>
          <div className={styles.oppgavestatus}>{oppgaveStatus && <OppgaveStatus oppgaveStatus={oppgaveStatus} />}</div>
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
                  {!isProd() && (
                    <Dropdown.Menu.GroupedList.Item onClick={() => settVisVurderRettighetsperiodeModal(true)}>
                      Overstyr starttidspunkt
                    </Dropdown.Menu.GroupedList.Item>
                  )}
                </Dropdown.Menu.GroupedList>
              </Dropdown.Menu>
            </Dropdown>

            <SettBehandllingPåVentModal
              referanse={referanse}
              isOpen={settBehandlingPåVentmodalIsOpen}
              onClose={() => setSettBehandlingPåVentmodalIsOpen(false)}
            />
            <TrekkSøknadModal
              isOpen={visTrekkSøknadModal}
              onClose={() => settVisTrekkSøknadModal(false)}
              saksnummer={sak.saksnummer}
            />
            <VurderRettighetsperiodeModal
              isOpen={visVurderRettighetsperiodeModal}
              onClose={() => settVisVurderRettighetsperiodeModal(false)}
              saksnummer={sak.saksnummer}
            />
          </div>
        </HStack>
      )}
    </div>
  );
};
