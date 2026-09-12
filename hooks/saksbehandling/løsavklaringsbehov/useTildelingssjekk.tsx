import { hentTildeltStatusClient } from 'lib/oppgaveClientApi';
import { isSuccess } from 'lib/utils/api';
import { useOverstyrTildelingNyHook } from 'hooks/saksbehandling/løsavklaringsbehov/useOverstyrTildeling';

export const useTildelingssjekk = (behandlingsreferanse: string) => {
  const { setVisOverstyrModal, setBekreftOverstyring, setAvbrytOverstyring, setReservertAvNavn } =
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
       * Vent på at saksbehandler enten bekrefter eller avbryter overstyring i modalen
       */
      return new Promise<boolean>((resolve) => {
        setBekreftOverstyring(() => () => resolve(true));
        setAvbrytOverstyring(() => () => resolve(false));
      });
    }
    return true;
  };

  return { sjekkTildeling };
};
