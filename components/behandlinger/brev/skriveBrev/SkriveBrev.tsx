import { Brevbygger } from '@navikt/aap-breveditor/';

import NavLogo from 'public/nav_logo.png';

export const SkriveBrev = ({ grunnlag }: { grunnlag: any }) => {
  return <Brevbygger brevmal={grunnlag.brevmal} logo={NavLogo} />;
};
