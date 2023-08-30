import styles from './layout.module.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const saksInfo = {
    søker: {
      navn: 'Peder Ås',
      fnr: '123456 78910',
    },
    sistEndret: {
      navn: 'Marte Kirkerud',
      tidspunkt: '12.12.2020 kl 12:12',
    },
  };

  return (
    <div>
      <div className={styles.søkerinfoBanner}>
        <div>
          <span>{saksInfo.søker.navn}</span>
          <span>{saksInfo.søker.fnr}</span>
        </div>
        <div className={styles.endretAv}>
          Sist endret av {saksInfo.sistEndret.navn} den {saksInfo.sistEndret.tidspunkt}
        </div>
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
