import { SaksopplysningerKort } from 'components/behandlinger/brev/skriveBrev/SaksopplysningerKort';
import styles from './SaksopplysningerKolonne.module.css';
import { Label } from '@navikt/ds-react';
import { FormkravGrunnlag, KlagebehandlingKontorGrunnlag, KlagebehandlingNayGrunnlag } from 'lib/types/types';

interface Props {
  formkravGrunnlag: FormkravGrunnlag;
  klagebehandlingKontorGrunnlag: KlagebehandlingKontorGrunnlag;
  klagebehandlingNayGrunnlag: KlagebehandlingNayGrunnlag;
}

export const KlagesaksopplysningerKolonne = ({
  formkravGrunnlag,
  klagebehandlingKontorGrunnlag,
  klagebehandlingNayGrunnlag,
}: Props) => {
  const formkravVurdering = formkravGrunnlag.vurdering;
  const klagebehandlingKontorVurdering = klagebehandlingKontorGrunnlag.vurdering;
  const klagebehandlingNayVurdering = klagebehandlingNayGrunnlag.vurdering;
  return (
    <div className={styles.kolonne}>
      <Label as="p">Vilkårsvurderinger</Label>
      {formkravVurdering && <SaksopplysningerKort tittel="Formkrav" begrunnelse={formkravVurdering.begrunnelse} />}
      {klagebehandlingKontorVurdering && (
        <SaksopplysningerKort
          tittel="Vurdering av klage - kontor"
          begrunnelse={klagebehandlingKontorVurdering.begrunnelse}
        />
      )}
      {klagebehandlingNayVurdering && (
        <SaksopplysningerKort tittel="Vurdering av klage - Nay" begrunnelse={klagebehandlingNayVurdering.begrunnelse} />
      )}
    </div>
  );
};
