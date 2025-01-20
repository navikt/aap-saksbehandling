import { SaksopplysningerKort } from 'components/behandlinger/brev/skriveBrev/SaksopplysningerKort';
import styles from './SaksopplysningerKolonne.module.css';
import { Label } from '@navikt/ds-react';

export const SaksopplysningerKolonne = () => {
  return (
    <div className={styles.kolonne}>
      <Label as="p">Vilkårsvurderinger (kun testdata foreløpig)</Label>
      <SaksopplysningerKort
        tittel="§11-5 Nedsatt arbeidsevne og krav til årsakssammenheng"
        begrunnelse="Her er begrunnelsen for 11-5 sykdom"
      />
      <SaksopplysningerKort tittel="§11-4 Alder" />
    </div>
  );
};
