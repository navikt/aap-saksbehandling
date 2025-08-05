import { RimeligGrunnMeldepliktGrunnlag } from 'lib/types/types';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { formaterPeriode } from 'lib/utils/date';

type Props = {
  grunnlag?: RimeligGrunnMeldepliktGrunnlag;
};

export const IkkeOppfyltMeldeplikt = ({ grunnlag }: Props) => {
  return grunnlag && grunnlag.perioderIkkeMeldt.length > 0 ? (
    <VilkårsKort heading={'Perioder uten oppfylt meldeplikt (§ 11-10 andre ledd)'} steg={'IKKE_OPPFYLT_MELDEPLIKT'}>
      <div>
        Tabellen viser meldeperioder brukeren ikke har levert meldekort i tide og derfor ikke oppfyller meldeplikten. Du
        kan overstyre dette hvis brukeren hadde rimelig grunn for å unnlate å melde seg.
      </div>
      {grunnlag?.perioderIkkeMeldt.map((periode) => (
        <div key={periode.fom}>{formaterPeriode(periode.fom, periode.tom)}</div>
      ))}
    </VilkårsKort>
  ) : (
    <></>
  );
};
