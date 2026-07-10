import { hentTildeltStatusClient } from 'lib/oppgaveClientApi';
import { isSuccess } from 'lib/utils/api';
import { useOverstyrTildelingNyHook } from 'hooks/saksbehandling/løsavklaringsbehov/useOverstyrTildeling';

export const useTildelingssjekk = (behandlingsreferanse: string) => {
  const { setVisOverstyrModal, setBekreftTildeling, setAvbrytTildeling, setReservertAvNavn } =
    useOverstyrTildelingNyHook();

  const sjekkTildeling = async (): Promise<boolean> => {
    const tildeltStatus = await hentTildeltStatusClient(behandlingsreferanse);
    if (
      isSuccess(tildeltStatus) &&
      tildeltStatus.data.tildeltSaksbehandlerIdent != null &&
      !tildeltStatus.data.erTildeltInnloggetBruker
    ) {
      setReservertAvNavn(tildeltStatus.data.tildeltSaksbehandlerNavn ?? tildeltStatus.data.tildeltSaksbehandlerIdent);
      setVisOverstyrModal(true);

      /**
       * Vent på at saksbehandler enten bekrefter eller avbryter tildeling i modalen
       */
      return new Promise<boolean>((resolve) => {
        setBekreftTildeling(() => () => resolve(true));
        setAvbrytTildeling(() => () => resolve(false));
      });
    }
    return true;
  };

  return { sjekkTildeling };
};
