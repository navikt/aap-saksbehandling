import { Detail, Label } from '@navikt/ds-react';
import styles from './SaksinfoBanner.module.css';
import { Tag } from 'components/DsClient';
import { PdlInformasjon } from 'lib/services/pdlservice/pdlService';
import { SaksInformasjon } from 'lib/clientApi';
import { SaksInfo } from 'lib/types/types';

interface Props {
  personInformasjon: PdlInformasjon;
  saksInfo: SaksInformasjon;
  sak: SaksInfo;
}
export const SaksinfoBanner = ({ personInformasjon, saksInfo, sak }: Props) => {
  return (
    <div className={styles.saksinfoBanner}>
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
    </div>
  );
};
