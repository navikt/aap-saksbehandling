'use client';

import styles from './StegGruppeIndikator.module.css';
import { GruppeElement } from 'components/gruppeelement/GruppeElement';
import { BehandlingFlytOgTilstand, StegGruppe } from 'lib/types/types';
import { useParams } from 'next/navigation';

interface Props {
  flytRespons: BehandlingFlytOgTilstand;
  stegGrupperSomSkalVises: StegGruppe[];
}

export const StegGruppeIndikator = ({ flytRespons, stegGrupperSomSkalVises }: Props) => {
  const params = useParams<{ aktivGruppe: string }>();

  return (
    <ol type="1" className={styles.stegMeny}>
      {flytRespons.flyt
        .filter((gruppe) => stegGrupperSomSkalVises.includes(gruppe.stegGruppe))
        .map((gruppe, index) => {
          return (
            <GruppeElement
              key={gruppe.stegGruppe}
              navn={gruppe.stegGruppe}
              nummer={index + 1}
              erFullført={gruppe.erFullført}
              aktivtSteg={decodeURI(params.aktivGruppe) === gruppe.stegGruppe}
              kanNavigeresTil={gruppe.erFullført || flytRespons.aktivGruppe === gruppe.stegGruppe}
            />
          );
        })}
    </ol>
  );
};
