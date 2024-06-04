import { Detail, Label } from '@navikt/ds-react';
import { Tag } from 'components/DsClient';
import { SaksInformasjon } from 'lib/clientApi';
import { SakPersoninfo, SaksInfo as SaksInfoType } from 'lib/types/types';
import styles from './SaksInfo.module.css';

interface Props {
  personInformasjon: SakPersoninfo;
  saksInfo: SaksInformasjon;
  sak: SaksInfoType;
}
export const SaksInfo = ({ personInformasjon, saksInfo, sak }: Props) => {
  return (
    <div className={styles.søkerinfo}>
      <div className={styles.ikon} />
      <Label size="small">{personInformasjon.navn}</Label>
      <span aria-hidden>/</span>
      <Detail>{sak?.ident}</Detail>
      {saksInfo.labels.map((label) => (
        <Tag variant="info" size="xsmall" key={label.type}>
          {label.type}
        </Tag>
      ))}
    </div>
  );
};
