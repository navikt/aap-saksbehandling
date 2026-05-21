import { YrkesskadeVurderingGrunnlag } from 'lib/types/types';
import { OppgittYrkesskadeUtenRegistertreffInfo } from 'components/behandlinger/sykdom/yrkesskade/OppgittYrkesskadeUtenRegistertreffInfo';

interface Props {
  grunnlag: YrkesskadeVurderingGrunnlag;
}

export const OppgittYrkesskadeUtenRegistertreffDataFetchingInfo = ({ grunnlag }: Props) => {
  return <OppgittYrkesskadeUtenRegistertreffInfo grunnlag={grunnlag} />;
};