'use client';

import { BodyShort, CopyButton, HStack, Label, Link, Tag } from '@navikt/ds-react';
import {
  DetaljertBehandling,
  FlytGruppe,
  FlytVisning,
  SakPersoninfo,
  SaksInfo as SaksInfoType,
  TypeBehandling,
} from 'lib/types/types';
import { useState } from 'react';
import { ChevronRightIcon } from '@navikt/aksel-icons';

import styles from './SaksinfoBanner.module.css';
import { Behandlingsstatus } from 'components/behandlingsstatus/Behandlingsstatus';
import { OppgaveStatus, OppgaveStatusType } from 'components/oppgavestatus/OppgaveStatus';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';
import { AdressebeskyttelseStatus } from 'components/adressebeskyttelsestatus/AdressebeskyttelseStatus';
import { utledAdressebeskyttelse } from 'lib/utils/adressebeskyttelse';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { SvarFraBehandler } from 'components/saksinfobanner/svarfrabehandler/SvarFraBehandler';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { MarkeringInfoboks } from 'components/markeringinfoboks/MarkeringInfoboks';
import { ArenaStatus } from 'components/arenastatus/ArenaStatus';
import { formaterDatoForFrontend, sorterEtterNyesteDato, stringToDate } from 'lib/utils/date';
import { ReturStatus } from 'components/returstatus/ReturStatus';
import { useFeatureFlag } from 'context/UnleashContext';
import { isSuccess } from 'lib/utils/api';
import { clientHentRettighetsdata } from 'lib/clientApi';
import useSWR from 'swr';
import { SaksmenyDropdown } from 'components/saksinfobanner/SaksmenyDropdown';
import { UtløptVentefristBoks } from 'components/oppgaveliste/utløptventefristboks/UtløptVentefristBoks';

interface Props {
  personInformasjon: SakPersoninfo;
  sak: SaksInfoType;
  behandling?: DetaljertBehandling;
  oppgave?: Oppgave;
  brukerInformasjon?: BrukerInformasjon;
  flyt?: FlytGruppe[];
  visning?: FlytVisning;
  brukerKanSaksbehandle?: boolean;
  brukerErBeslutter?: boolean;
}

export const SaksinfoBanner = ({
  personInformasjon,
  sak,
  behandling,
  oppgave,
  brukerInformasjon,
  flyt,
  visning,
  brukerKanSaksbehandle,
  brukerErBeslutter,
}: Props) => {
  const [visHarUlesteDokumenter, settVisHarUlesteDokumenter] = useState(!!oppgave?.harUlesteDokumenter);
  const erReservertAvInnloggetBruker = brukerInformasjon?.NAVident === oppgave?.reservertAv;

  const adressebeskyttelser = oppgave ? utledAdressebeskyttelse(oppgave) : [];
  const isVisRettigheterForVedtakEnabled = useFeatureFlag('VisRettigheterForVedtak'); // TODO AAP-1709 Fjerne feature toggle etter verifisering i dev
  const rettighetsdata = useSWR(isVisRettigheterForVedtakEnabled ? `/api/sak/${sak.saksnummer}/rettighet` : null, () =>
    clientHentRettighetsdata(sak.saksnummer)
  ).data;

  const hentOppgaveStatus = (): OppgaveStatusType | undefined => {
    if (visning?.visVentekort) {
      return { status: 'PÅ_VENT', label: 'På vent' };
    } else if (sak.søknadErTrukket) {
      return { status: 'TRUKKET', label: 'Trukket' };
    } else if (visning?.resultatKode) {
      return { status: 'AVBRUTT', label: 'Avbrutt' };
    }
  };

  const hentOppgaveTildeling = (): OppgaveStatusType | undefined => {
    if (!oppgave?.reservertAv) {
      return { status: 'LEDIG', label: `Ledig` };
    } else if (erReservertAvInnloggetBruker) {
      return {
        status: 'TILDELT_INNLOGGET_BRUKER',
        label: `Tildelt: ${oppgave.reservertAvNavn ?? oppgave.reservertAv}`,
      };
    } else if (oppgave?.reservertAv && !erReservertAvInnloggetBruker) {
      return { status: 'TILDELT', label: `Tildelt: ${oppgave.reservertAvNavn ?? oppgave.reservertAv}` };
    }
  };

  const hentMaksdato = (): string | null | undefined => {
    if (isVisRettigheterForVedtakEnabled && isSuccess(rettighetsdata)) {
      const ytelsesbehandlingTyper: TypeBehandling[] = ['Førstegangsbehandling', 'Revurdering'];

      const gjeldendeVedtak = sak.behandlinger
        .filter((behandling) => {
          const behandlingstype = behandling?.typeBehandling;
          return (
            behandlingstype && ytelsesbehandlingTyper.includes(behandlingstype) && behandling.status === 'AVSLUTTET'
          );
        })
        .sort((b1, b2) => sorterEtterNyesteDato(b1.opprettet, b2.opprettet))[0];

      const gjeldendeRettighet = rettighetsdata.data.find(
        (rettighet) =>
          stringToDate(rettighet.startDato)?.toDateString() === new Date(gjeldendeVedtak?.opprettet).toDateString()
      );

      return gjeldendeRettighet?.maksDato;
    }
    return undefined;
  };

  const oppgaveStatus = hentOppgaveStatus();
  const oppgaveTildelingStatus = hentOppgaveTildeling();
  const maksdato = isVisRettigheterForVedtakEnabled ? hentMaksdato() : undefined;

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

          {behandling && (
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

      {behandling && (
        <HStack>
          {maksdato && (
            <div className={styles.oppgavestatus}>
              <Tag className={styles.maksdatoTag} variant={'info'} size={'small'}>
                {`Maksdato: ${formaterDatoForFrontend(maksdato)}`}
              </Tag>
            </div>
          )}
          {adressebeskyttelser?.map((adressebeskyttelse) => (
            <div key={adressebeskyttelse} className={styles.oppgavestatus}>
              <AdressebeskyttelseStatus adressebeskyttelsesGrad={adressebeskyttelse} />
            </div>
          ))}
          {visHarUlesteDokumenter && (
            <div className={styles.oppgavestatus}>
              <SvarFraBehandler
                behandlingReferanse={behandling.referanse}
                oppdaterVisHarUlesteDokumenter={settVisHarUlesteDokumenter}
              />
            </div>
          )}
          {behandling.arenaStatus?.harArenaHistorikk && (
            <div className={styles.oppgavestatus}>
              <ArenaStatus />
            </div>
          )}
          {oppgaveTildelingStatus && (
            <div className={styles.oppgavestatus}>
              <OppgaveStatus oppgaveStatus={oppgaveTildelingStatus} />
            </div>
          )}
          {oppgave?.utløptVentefrist && (
            <div className={styles.oppgavestatus}>
              <UtløptVentefristBoks
                frist={oppgave.utløptVentefrist}
                årsak={oppgave.påVentÅrsak}
                begrunnelse={oppgave.venteBegrunnelse}
              />
            </div>
          )}
          {oppgaveStatus && (
            <div className={styles.oppgavestatus}>
              <OppgaveStatus oppgaveStatus={oppgaveStatus} />
            </div>
          )}
          {oppgave?.returInformasjon?.status && (
            <div className={styles.oppgavestatus}>
              <ReturStatus returStatus={oppgave.returInformasjon.status} />
            </div>
          )}
          {oppgave?.markeringer?.map((markering) => (
            <div className={styles.oppgavestatus} key={markering.markeringType}>
              <MarkeringInfoboks markering={markering} referanse={behandling.referanse} showLabel={true} />
            </div>
          ))}

          <SaksmenyDropdown
            flyt={flyt}
            visning={visning}
            behandling={behandling}
            oppgave={oppgave}
            brukerInformasjon={brukerInformasjon}
            brukerKanSaksbehandle={brukerKanSaksbehandle}
            brukerErBeslutter={brukerErBeslutter}
          />
        </HStack>
      )}
    </div>
  );
};
