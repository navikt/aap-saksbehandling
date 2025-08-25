'use client';

import { BehandlingFlytOgTilstand, StegGruppe } from 'lib/types/types';
import { useParams, useRouter } from 'next/navigation';
import { Stepper } from '@navikt/ds-react';
import styles from './StegGruppeIndikator.module.css';
import { mapTilSteggruppeTekst } from 'lib/utils/oversettelser';

interface Props {
  flytRespons: BehandlingFlytOgTilstand;
  stegGrupperSomSkalVises: StegGruppe[];
}

export const StegGruppeIndikatorAksel = ({ flytRespons, stegGrupperSomSkalVises }: Props) => {
  const router = useRouter();
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
                as="button"
                key={gruppe.stegGruppe}
                completed={gruppe.erFullført}
                interactive={gruppe.erFullført || flytRespons.aktivGruppe === gruppe.stegGruppe}
                onClick={() =>
                  router.push(`/saksbehandling/sak/${saksId}/${behandlingsReferanse}/${gruppe.stegGruppe}`)
                }
              >
                {mapTilSteggruppeTekst(gruppe.stegGruppe)}
              </Stepper.Step>
            );
          })}
      </Stepper>
    </div>
  );
};
