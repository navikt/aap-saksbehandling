import { Detail, Label } from '@navikt/ds-react';
import { SakPersoninfo, SaksInfo as SaksInfoType } from 'lib/types/types';
import styles from './SaksInfo.module.css';

interface Props {
  personInformasjon: SakPersoninfo;
  sak: SaksInfoType;
}
export const SaksInfo = ({ personInformasjon, sak }: Props) => {
  return (
    <div className={styles.søkerinfo}>
      <div className={styles.ikon} />
      <Label size="small">{personInformasjon.navn}</Label>
      <span aria-hidden>/</span>
      <Detail>{sak?.ident}</Detail>
    </div>
  );
};
