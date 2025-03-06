'use client';

import { Stepper } from '@navikt/ds-react';
import style from './StegGruppeIndikator.module.css';
import { BehandlingFlytOgTilstand, FlytGruppe } from 'lib/types/postmottakTypes';
import { exhaustiveCheck } from 'lib/utils/typescript';

function stegGruppeNavnTilLabel(stegGruppeNavn: FlytGruppe['stegGruppe']) {
  switch (stegGruppeNavn) {
    case 'AVKLAR_TEMA':
      return 'Avklar tema';
    case 'AVKLAR_SAK':
      return 'Avklar sak';
    case 'KATEGORISER':
      return 'Kategoriser';
    case 'DIGITALISER':
      return 'Kategoriser';
    case 'OVERLEVER_TIL_FAGSYSTEM':
      return 'Send til fagsystem';
    case 'ENDELIG_JOURNALFØRING':
      return 'Endelig journalføring';
    case 'START_BEHANDLING':
      return 'Start behandling';
    case 'UDEFINERT':
      return 'Udefinert';
    case 'VIDERESEND':
      return 'Videresend';
    case 'IVERKSETTES':
      return 'Iverksettes';
    case 'SETT_FAGSAK':
      return 'Sett fagsak';
  }
  exhaustiveCheck(stegGruppeNavn);
}
export const StegGruppeIndikatorAksel = ({
  behandlingsreferanse,
  stegGrupper,
  flytRespons,
}: {
  behandlingsreferanse: string;
  stegGrupper: FlytGruppe[];
  flytRespons: BehandlingFlytOgTilstand;
}) => {
  const visningsListe = stegGrupper.filter((steg) => steg.skalVises);
  const aktivtStegNummer = visningsListe.findIndex((steg) => steg.stegGruppe === flytRespons.aktivGruppe) + 1;

  return (
    <div className={style.stegMenyWrapper}>
      <Stepper orientation="horizontal" activeStep={aktivtStegNummer}>
        {visningsListe.map((steg, index) => (
          <Stepper.Step
            completed={steg.erFullført}
            key={index}
            href={`/postmottak/${behandlingsreferanse}/${steg.stegGruppe}`}
            interactive={steg.erFullført || flytRespons.aktivGruppe === steg.stegGruppe}
          >
            {stegGruppeNavnTilLabel(steg.stegGruppe)}
          </Stepper.Step>
        ))}
      </Stepper>
    </div>
  );
};
