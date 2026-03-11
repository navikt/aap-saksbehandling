import { BarnepensjonVurdering } from 'lib/types/types';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { ValuePair } from 'components/form/FormField';
import { formaterDatoMedMånedOgÅr } from 'lib/utils/date';
import { formaterTilNok } from 'lib/utils/string';
import { beregnDagsats } from 'components/behandlinger/samordning/barnepensjon/BarnepensjonTabell';

interface Props {
  vurderinger: BarnepensjonVurdering[];
}

export const BarnepensjonTidligereVurdering = ({ vurderinger }: Props) => {
  return (
    <TidligereVurderinger
      data={vurderinger}
      buildFelter={byggFelter}
      getErGjeldende={() => true}
      getVurdertAvIdent={(v) => v.vurdertAv.ident}
      grupperPåOpprettetDato={true}
    />
  );
};

function byggFelter(vurdering: BarnepensjonVurdering): ValuePair[] {
  return [
    { label: 'Begrunnelse', value: vurdering.begrunnelse },
    ...vurdering.perioder.flatMap((periode) => [
      {
        label: 'Periode',
        value: `${formaterDatoMedMånedOgÅr(periode.fom)} - ${formaterDatoMedMånedOgÅr(periode.tom || '')}`,
      },
      {
        label: 'Månedsytelse',
        value: formaterTilNok(periode.månedsbeløp.verdi),
      },
      {
        label: 'Dagsats',
        value: formaterTilNok(beregnDagsats(periode.månedsbeløp.verdi.toString())),
      },
    ]),
  ];
}
