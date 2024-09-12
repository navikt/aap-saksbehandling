'use client';

import { BehandlingFlytOgTilstand, StegGruppe } from 'lib/types/types';
import { useParams } from 'next/navigation';
import { Stepper } from '@navikt/ds-react';
import styles from './StegGruppeIndikator.module.css';

interface Props {
  flytRespons: BehandlingFlytOgTilstand;
  stegGrupperSomSkalVises: StegGruppe[];
}

export const StegGruppeIndikatorAksel = ({ flytRespons, stegGrupperSomSkalVises }: Props) => {
  const params = useParams<{ saksId: string; behandlingsReferanse: string; aktivGruppe: string }>();
  const { saksId, behandlingsReferanse, aktivGruppe } = params;
  const stegGrupper = flytRespons.flyt.filter((gruppe) => stegGrupperSomSkalVises.includes(gruppe.stegGruppe));
  const activeStepIndex = stegGrupper.findIndex((gruppe) => gruppe.stegGruppe === decodeURI(aktivGruppe)) + 1;

  return (
    <div className={styles?.stegMenyWrapper}>
      <Stepper orientation={'horizontal'} activeStep={activeStepIndex}>
        {flytRespons.flyt
          .filter((gruppe) => stegGrupperSomSkalVises.includes(gruppe.stegGruppe))
          .map((gruppe) => {
            return (
              <Stepper.Step
                key={gruppe.stegGruppe}
                completed={gruppe.erFullført}
                interactive={gruppe.erFullført || flytRespons.aktivGruppe === gruppe.stegGruppe}
                href={`/sak/${saksId}/${behandlingsReferanse}/${gruppe.stegGruppe}`}
              >
                {mapGruppeTypeToGruppeNavn(gruppe.stegGruppe)}
              </Stepper.Step>
            );
          })}
      </Stepper>
    </div>
  );
};
function mapGruppeTypeToGruppeNavn(steg: StegGruppe): string {
  switch (steg) {
    case 'BREV':
      return 'Brev';
    case 'MEDLEMSKAP':
      return 'Medlemskap';
    case 'SYKDOM':
      return 'Sykdom';
    case 'UNDERVEIS':
      return 'Underveis';
    case 'TILKJENT_YTELSE':
      return 'Tilkjent ytelse';
    case 'VEDTAK':
      return 'Vedtak';
    case 'SIMULERING':
      return 'Simulering';
    case 'START_BEHANDLING':
      return 'Start behandling';
    case 'BARNETILLEGG':
      return 'Barnetillegg';
    case 'ALDER':
      return 'Alder';
    case 'GRUNNLAG':
      return 'Grunnlag';
    case 'LOVVALG':
      return 'Lovvalg';
    case 'FATTE_VEDTAK':
      return 'Fatte vedtak';
    case 'IVERKSETT_VEDTAK':
      return 'Iverksett vedtak';
    case 'KVALITETSSIKRING':
      return 'Kvalitetssikring';
    case 'STUDENT':
      return 'Student';
    case 'ET_ANNET_STED':
      return 'Institusjonsopphold';
    case 'UDEFINERT':
      return 'Udefinert';
  }
}
