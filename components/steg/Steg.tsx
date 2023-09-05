'use client';

import styles from './Steg.module.css';

interface Props {
  navn: string;
  erFullført: boolean;
  aktivtSteg: boolean;
}

export const Steg = ({ navn, erFullført, aktivtSteg }: Props) => {
  const erFullførtStyle = erFullført ? styles.erFullført : '';
  const aktivtStegStyle = aktivtSteg ? styles.aktivtSteg : '';

  return <div className={`${erFullførtStyle} ${aktivtStegStyle}`}>{navn}</div>;
};
