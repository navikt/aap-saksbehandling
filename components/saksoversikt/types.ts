import { PostmottakBehandlingInfo } from 'lib/types/postmottakTypes';
import { BehandlingInfo } from 'lib/types/types';

export type BehandlingsflytBehandling = {
  kilde: 'BEHANDLINGSFLYT';
  behandling: BehandlingInfo;
};

export type PostmottakBehandling = {
  kilde: 'POSTMOTTAK';
  behandling: PostmottakBehandlingInfo;
};

export type BehandlingsflytEllerPostmottakBehandling = BehandlingsflytBehandling | PostmottakBehandling;
