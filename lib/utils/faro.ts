export function generateKelvinFaroPageId(location: Location): string {
  return location.pathname
    .replace(/\/saksbehandling\/sak\/[^/]+\/[^/]+/, '/saksbehandling/sak/{saksid}/{behandlingsreferanse}')
    .replace(/\/saksbehandling\/sak\/[^/]+/, '/saksbehandling/sak/{saksid}')
    .replace(/\/postmottak\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i, '/postmottak/{referanse}');
}
