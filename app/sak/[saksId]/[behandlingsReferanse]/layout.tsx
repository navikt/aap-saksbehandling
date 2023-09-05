import { Detail, Label } from '@navikt/ds-react/esm/typography';
import { hentSaksinfo } from 'lib/api';
import { ReactNode } from 'react';

import { Tag } from 'components/DsClient';

import styles from './layout.module.css';

interface Props {
  children: ReactNode;
  params: { saksId: string };
}

const Layout = async ({ children, params }: Props) => {
  const saksInfo = await hentSaksinfo(params.saksId); // TODO: Litt metadata om søker, skal skrives om

  return (
    <div>
      <div className={styles.saksinfoBanner}>
        <div className={styles.søkerinfo}>
          <div className={styles.ikon} />
          <Label size="small">{saksInfo.søker.navn}</Label>
          <span aria-hidden>/</span>
          <Detail>{saksInfo.søker.fnr}</Detail>
          {saksInfo.labels.map((label) => (
            <Tag variant="info" size="xsmall" key={label.type}>
              {label.type}
            </Tag>
          ))}
        </div>

        <Detail className={styles.endretAv}>
          Sist endret av {saksInfo.sistEndret.navn} den {saksInfo.sistEndret.tidspunkt}
        </Detail>
      </div>
      <div>
        <ol className={styles.stegMeny}>
          <li>Alder</li>
          <li>Medlemsskap</li>
          <li>Sykdom</li>
        </ol>
      </div>
      {children}
    </div>
  );
};

export default Layout;
