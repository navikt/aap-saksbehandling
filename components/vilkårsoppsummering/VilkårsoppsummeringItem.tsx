import styles from 'components/vilkårsoppsummering/Vilkårsoppsummering.module.css';
import { AvslagÅrsak, Vilkår, VilkårType } from 'lib/types/types';
import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { vilkårErOppfylt } from 'components/vilkårsoppsummering/Vilkårsoppsummering';
import { BodyShort } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  vilkår: Vilkår;
}

const vilkarsstatus = (vilkar: Vilkår) => {
  switch (vilkårErOppfylt(vilkar)) {
    case 'JA':
      return <CheckmarkCircleFillIcon title="vilkår-oppfylt" className={styles.oppfyltIcon} />;
    case 'DELVIS':
      return <ExclamationmarkTriangleFillIcon title="vilkår-delvis-oppfylt" className={styles.delvisOppfylt} />;
    default:
      return <XMarkOctagonFillIcon title={'vilkår-avslått'} className={styles.avslåttIcon} />;
  }
};

export const VilkårsoppsummeringItem = ({ vilkår }: Props) => {
  return (
    <div>
      <BodyShort className={styles.vilkårsitem}>
        {vilkarsstatus(vilkår)}
        {mapVilkårTypeTilVilkårNavn(vilkår.vilkårtype)}
      </BodyShort>

      <div className={'flex-column'}>
        {vilkår.perioder.map((periode, index) => {
          if (periode.utfall === 'IKKE_OPPFYLT') {
            return (
              <div key={index}>
                <BodyShort>
                  Periode: {formaterDatoForFrontend(periode.periode.fom)} -{' '}
                  {formaterDatoForFrontend(periode.periode.tom)}
                </BodyShort>
                <BodyShort>Avslagårsak: {mapAvslagsårsakTilAvslagNavn(periode.avslagsårsak)}</BodyShort>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

function mapAvslagsårsakTilAvslagNavn(avslagÅrsak: AvslagÅrsak) {
  switch (avslagÅrsak) {
    case 'BRUKER_OVER_67':
      return 'Bruker er over 67 år';
    case 'BRUKER_UNDER_18':
      return 'Bruker er under 18 år';
    case 'IKKE_NOK_REDUSERT_ARBEIDSEVNE':
      return 'Ikke nok redusert arbeidsevne';
    case 'MANGLENDE_DOKUMENTASJON':
      return 'Manglende dokumentasjon';
    case 'IKKE_SYKDOM_AV_VISS_VARIGHET':
      return 'Ikke sykdom av viss varighet';
    case 'IKKE_SYKDOM_SKADE_LYTE_VESENTLIGDEL':
      return 'Sykdom, skade eller lyte er ikke vesentlig medvirkende til nedsatt arbeidsevne';
  }
}

function mapVilkårTypeTilVilkårNavn(steg: VilkårType): string {
  switch (steg) {
    case 'ALDERSVILKÅRET':
      return 'Alder';
    case 'SYKDOMSVILKÅRET':
      return 'Sykdom';
    case 'BISTANDSVILKÅRET':
      return 'Oppfølging';
    case 'MEDLEMSKAP':
      return 'Medlemskap';
    case 'GRUNNLAGET':
      return 'Grunnlaget';
    case 'SYKEPENGEERSTATNING':
      return 'Sykepengeerstatning';
    case 'LOVVALG':
      return 'Lovvalg';
    default:
      return steg;
  }
}
