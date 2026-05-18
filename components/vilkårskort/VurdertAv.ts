import { VurdertAvAnsatt } from 'lib/types/types';

export interface VurdertAv {
  vurdertAutomatisk?: boolean;
  vurdertAvAnsatt?: VurdertAvAnsatt;
  kvalitetssikretAv?: VurdertAvAnsatt;
  besluttetAv?: VurdertAvAnsatt;
  trukketAv?: VurdertAvAnsatt;
}
