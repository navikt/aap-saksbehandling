export interface ClientConfig {
  gosysUrl: string;
  modiaPersonoversiktUrl: string;
  aInntektUrl: string;
  inst2Url: string;
}

export interface ClientError {
  name: string;
  message: string;
  stack?: string;
  digest?: string;
  saksnummer?: string;
  behandlingsReferanse?: string;
  pathname?: string;
}
