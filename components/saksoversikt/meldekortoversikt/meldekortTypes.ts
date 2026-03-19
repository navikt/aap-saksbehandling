// GET meldekort skal returnere Meldekort[]

import { Periode } from 'lib/types/types';

export interface Dag {
  dato: Date;
  timerArbeidet: number;
}

// POST endre/registrere et meldekort

export interface EndreMeldekortRequest {
  meldekortId: string;
  begrunnelse: string;
  årsak: string;
  meldedato: Date;
  dager: Dag[];
}

export interface Meldekort {
  meldekortId: string;
  meldeperiode: Periode;
  dager: Dag[];
  fraværTotaltIMeldeperiode: number;
  levertDato?: Date;
  sistEndret?: Date;
  endretAv?: string;
}

// GET Hent tidligere redigerte versjoner av meldekortet skal returnere TidligereMeldekortVersjon[]
export interface TidligereMeldekortVersjon {
  innsendtDato: Date;
  innsendtAv: string;
  journalpostId: string;
  dokumentId: string;
}
