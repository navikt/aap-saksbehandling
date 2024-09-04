import { Aktivitetsmeldinger } from 'lib/types/types';

import styles from './Aktivitetstabell.module.css';

interface Props {
  aktivitetsmeldinger?: Aktivitetsmeldinger;
}

export const AktivitetsTabell = ({ aktivitetsmeldinger = { hammere: [] } }: Props) => {
  const harAktivitetsmeldingeraktivitetsmeldinger =
    aktivitetsmeldinger.hammere && aktivitetsmeldinger.hammere.length < 0;

  return (
    <div>
      <section className={styles.heading}>
        <b>Tidligere brudd på aktivitetsplikten</b>
        {!harAktivitetsmeldingeraktivitetsmeldinger ? (
          <span>Ingen tidligere brudd registrert</span>
        ) : (
          <div>Her kommer det en tabell</div>
        )}
      </section>
    </div>
  );
};
