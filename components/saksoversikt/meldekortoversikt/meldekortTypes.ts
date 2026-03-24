// GET meldekort skal returnere Meldekort[]

import { Periode } from 'lib/types/types';

export interface Dag {
  dato: string;
  timerArbeidet: string;
}

export interface DagFraBackend {
  dato: string;
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
  dager: DagFraBackend[];
  fraværTotaltIMeldeperiode: number;
  levertDato?: string;
  sistEndret?: string;
  endretAv?: string;
}

// GET Hent tidligere redigerte versjoner av meldekortet skal returnere TidligereMeldekortVersjon[]
export interface TidligereMeldekortVersjon {
  innsendtDato: Date;
  innsendtAv: string;
  journalpostId: string;
  dokumentId: string;
}
