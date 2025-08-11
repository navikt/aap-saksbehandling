import { useBehandlingsReferanse } from 'hooks/BehandlingHook';

export function useMellomlagring(): {
  lagreMellomlagring: () => void;
  opprettMellomlagring: () => void;
  slettMellomlagring: () => void;
} {
  const behandlingsReferanse = useBehandlingsReferanse();

  function lagreMellomlagring() {
    console.log('Nå oppdaterer jeg mellomlagring', behandlingsReferanse);
  }

  function slettMellomlagring() {
    console.log('Nå sletter jeg ', behandlingsReferanse);
  }

  function opprettMellomlagring() {
    console.log('Nå oppretter jeg mellomlagring', behandlingsReferanse);
  }

  return { lagreMellomlagring, slettMellomlagring, opprettMellomlagring };
}
