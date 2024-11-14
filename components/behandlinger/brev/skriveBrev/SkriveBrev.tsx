import { Brevbygger } from '@navikt/aap-breveditor/';
import { Brev } from 'lib/types/types';

import NavLogo from 'public/nav_logo.png';

export const SkriveBrev = ({ grunnlag }: { grunnlag: Brev }) => {
  return <Brevbygger brevmal={grunnlag} logo={NavLogo} />;
};
