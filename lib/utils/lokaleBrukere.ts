import { Roller } from 'lib/types/types';

enum RollerLocal {
  BESLUTTER = 'beslutter-rolle',
  LES = 'les-rolle',
  SAKSBEHANDLER_OPPFØLGING = 'veileder-rolle',
  KVALITETSSIKRER = 'kvalitetssikrer-rolle',
  SAKSBEHANDLER_NASJONAL = 'saksbehandler-rolle',
  DRIFT = 'drift-rolle',
  PRODUKSJONSSTYRING = 'produksjonsstyring-rolle',
}

export const lokaleBrukere = [
  {
    NAVident: 'X123456',
    tidligereIdent: null,
    rolle: 'SUPERBRUKER',
    grupper: [
      RollerLocal.SAKSBEHANDLER_OPPFØLGING,
      RollerLocal.KVALITETSSIKRER,
      RollerLocal.SAKSBEHANDLER_NASJONAL,
      RollerLocal.BESLUTTER,
    ],
  },
  {
    NAVident: 'V123456',
    tidligereIdent: 'VEILEDER',
    rolle: Roller.SAKSBEHANDLER_OPPFØLGING,
    grupper: [RollerLocal.SAKSBEHANDLER_OPPFØLGING],
  },
  {
    NAVident: 'K123456',
    tidligereIdent: 'KVALITETSSIKRER',
    rolle: Roller.KVALITETSSIKRER,
    grupper: [RollerLocal.KVALITETSSIKRER],
  },
  {
    NAVident: 'S123456',
    tidligereIdent: 'SAKSBEHANDLER',
    rolle: Roller.SAKSBEHANDLER_NASJONAL,
    grupper: [RollerLocal.SAKSBEHANDLER_NASJONAL],
  },
  {
    NAVident: 'B123456',
    tidligereIdent: 'BESLUTTER',
    rolle: Roller.BESLUTTER,
    grupper: [RollerLocal.BESLUTTER],
  },
] as const;

/** Finner lokal testbruker fra ny ident eller en eldre brukercookie. */
export function finnLokalBruker(verdi: string | null | undefined) {
  const bruker = lokaleBrukere.find(({ NAVident, tidligereIdent }) => verdi === NAVident || verdi === tidligereIdent);
  if (!bruker) {
    const defaultBruker = lokaleBrukere[0];
    return {
      navn: `${defaultBruker.NAVident} (${defaultBruker.rolle})`,
      NAVident: defaultBruker.NAVident,
      grupper: defaultBruker.grupper,
      roller: defaultBruker.grupper.map((gruppe) => rolleMap[gruppe]),
    };
  }

  return {
    navn: `${bruker.NAVident} (${bruker.rolle})`,
    NAVident: bruker.NAVident,
    grupper: bruker.grupper,
    roller: bruker.grupper.map((gruppe) => rolleMap[gruppe]),
  };
}

const rolleMap: Record<RollerLocal, Roller> = {
  [RollerLocal.BESLUTTER]: Roller.BESLUTTER,
  [RollerLocal.LES]: Roller.LES,
  [RollerLocal.SAKSBEHANDLER_OPPFØLGING]: Roller.SAKSBEHANDLER_OPPFØLGING,
  [RollerLocal.KVALITETSSIKRER]: Roller.KVALITETSSIKRER,
  [RollerLocal.SAKSBEHANDLER_NASJONAL]: Roller.SAKSBEHANDLER_NASJONAL,
  [RollerLocal.DRIFT]: Roller.DRIFT,
  [RollerLocal.PRODUKSJONSSTYRING]: Roller.PRODUKSJONSSTYRING,
};
