'use client';

import { ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort, CopyButton, HStack, Label, Link, Tag } from '@navikt/ds-react';
import { useInnloggetBruker } from 'hooks/BrukerHook';
import { useSakPersonInformasjon } from 'hooks/saksbehandling/SakPersoninformasjonHook';
import { OppgaveVisningsinformasjon } from 'lib/types/oppgaveTypes';
import { DetaljertBehandling, FlytGruppe, FlytVisning, SaksInfo as SaksInfoType } from 'lib/types/types';
import { Adressebeskyttelsesgrad } from 'lib/utils/adressebeskyttelse';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { useState } from 'react';

import { AdressebeskyttelseStatus } from 'components/adressebeskyttelsestatus/AdressebeskyttelseStatus';
import { ArenaStatus } from 'components/arenastatus/ArenaStatus';
import { Behandlingsstatus } from 'components/behandlingsstatus/Behandlingsstatus';
import { MarkeringInfoboks } from 'components/markeringinfoboks/MarkeringInfoboks';
import { OppgaveStatus, OppgaveStatusType } from 'components/oppgavestatus/OppgaveStatus';
import { ReturStatus } from 'components/returstatus/ReturStatus';
import { SaksmenyDropdown } from 'components/saksinfobanner/SaksmenyDropdown';
import { SvarFraBehandler } from 'components/saksinfobanner/svarfrabehandler/SvarFraBehandler';

import { UtløptVentefristBoks } from '../oppgaveliste/utløptventefristboks/UtløptVentefristBoks';
import styles from './SaksinfoBanner.module.css';

interface Props {
  sak: SaksInfoType;
  behandling?: DetaljertBehandling;
  oppgaveVisninginfo?: OppgaveVisningsinformasjon;
  flyt?: FlytGruppe[];
  visning?: FlytVisning;
}

export const SaksinfoBanner = ({ sak, behandling, oppgaveVisninginfo, flyt, visning }: Props) => {
  const brukerInformasjon = useInnloggetBruker();
  const { personInformasjon: personInformasjon } = useSakPersonInformasjon();
  const [visHarUlesteDokumenter, settVisHarUlesteDokumenter] = useState(!!oppgaveVisninginfo?.harUlesteDokumenter);
  const erReservertAvInnloggetBruker = brukerInformasjon?.NAVident === oppgaveVisninginfo?.reservertAvIdent;

  const adressebeskyttelser = oppgaveVisninginfo ? utledAdressebeskyttelse(oppgaveVisninginfo) : [];

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
    if (!oppgaveVisninginfo?.reservertAvIdent) {
      return { status: 'LEDIG', label: `Ledig` };
    } else if (erReservertAvInnloggetBruker) {
      return {
        status: 'TILDELT_INNLOGGET_BRUKER',
        label: `Tildelt: ${oppgaveVisninginfo.reservertAvNavn ?? oppgaveVisninginfo.reservertAvIdent}`,
      };
    } else if (oppgaveVisninginfo?.reservertAvIdent && !erReservertAvInnloggetBruker) {
      return {
        status: 'TILDELT',
        label: `Tildelt: ${oppgaveVisninginfo.reservertAvNavn ?? oppgaveVisninginfo.reservertAvIdent}`,
      };
    }
  };

  const oppgaveStatus = hentOppgaveStatus();
  const oppgaveTildelingStatus = hentOppgaveTildeling();

  return (
    <div className={styles.saksinfobanner}>
      <div className={styles.saksinfo}>
        <HStack gap={'space-8'} align="center">
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
            <Tag variant="strong" size="small" data-color="neutral">
              Døde {formaterDatoForFrontend(personInformasjon.dødsdato)}
            </Tag>
          )}

          {behandling && (
            <>
              <ChevronRightIcon className={styles.chevron} />
              <BodyShort size={'small'}>
                Sak
                <CopyButton
                  copyText={sak.saksnummer}
                  size={'xsmall'}
                  text={sak.saksnummer}
                  iconPosition="right"
                  className={styles.copybutton}
                />
              </BodyShort>
              <ChevronRightIcon className={styles.chevron} />

              <BodyShort size={'small'}>{behandling.type}</BodyShort>
              <Behandlingsstatus status={behandling.status} />
            </>
          )}
        </HStack>
      </div>
      {behandling && (
        <HStack>
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
          {oppgaveVisninginfo?.utløptVenteInfo && (
            <div className={styles.oppgavestatus}>
              <UtløptVentefristBoks
                frist={oppgaveVisninginfo.utløptVenteInfo.påVentTil}
                årsak={oppgaveVisninginfo.utløptVenteInfo.påVentÅrsak}
                begrunnelse={oppgaveVisninginfo.utløptVenteInfo.venteBegrunnelse}
              />
            </div>
          )}
          {oppgaveStatus && (
            <div className={styles.oppgavestatus}>
              <OppgaveStatus oppgaveStatus={oppgaveStatus} />
            </div>
          )}
          {oppgaveVisninginfo?.returInformasjon?.status && (
            <div className={styles.oppgavestatus}>
              <ReturStatus returStatus={oppgaveVisninginfo.returInformasjon.status} />
            </div>
          )}
          {oppgaveVisninginfo?.markeringer?.map((markering) => (
            <div className={styles.oppgavestatus} key={markering.markeringType}>
              <MarkeringInfoboks markering={markering} referanse={behandling.referanse} showLabel={true} />
            </div>
          ))}
          <SaksmenyDropdown
            flyt={flyt}
            visning={visning}
            behandling={behandling}
            reservertAvIdent={oppgaveVisninginfo?.reservertAvIdent}
            brukerInformasjon={brukerInformasjon}
          />
        </HStack>
      )}
    </div>
  );
};

function utledAdressebeskyttelse(visningInfo?: OppgaveVisningsinformasjon): Adressebeskyttelsesgrad[] {
  let adressebeskyttelser = [];
  if (visningInfo?.skjermingInfo.harStrengtFortroligAdresse) {
    adressebeskyttelser.push(Adressebeskyttelsesgrad.STRENGT_FORTROLIG);
  } else if (visningInfo?.skjermingInfo.harFortroligAdresse) {
    adressebeskyttelser.push(Adressebeskyttelsesgrad.FORTROLIG);
  }

  if (visningInfo?.skjermingInfo.erSkjermet) {
    adressebeskyttelser.push(Adressebeskyttelsesgrad.EGEN_ANSATT);
  }
  return adressebeskyttelser;
}
