import { Detail, Label } from '@navikt/ds-react/esm/typography';

import { Tag } from 'components/DsClient';

import styles from './layout.module.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const saksInfo = {
    søker: {
      navn: 'Peder Ås',
      fnr: '123456 78910',
    },
    labels: [{ type: 'Førstegangsbehandling' }, { type: 'Fra sykepenger' }],
    sistEndret: {
      navn: 'Marte Kirkerud',
      tidspunkt: '12.12.2020 kl 12:12',
    },
  };

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
          <li>Yrkesskade</li>
        </ol>
      </div>
      {children}
    </div>
  );
};

export default Layout;
