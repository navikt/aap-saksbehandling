export interface ClientConfig {
  gosysUrl: string;
  modiaPersonoversiktUrl: string;
}

export interface ClientError {
  name: string;
  message: string;
  stack?: string;
  digest?: string;
}
