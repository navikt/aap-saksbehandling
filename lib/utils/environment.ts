export const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';
export const isProd = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod';
export const isDev = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev';

/**
 * Sjekker om en spesifikk backend faktisk kjører lokalt (dvs. base-URL-en peker på localhost),
 * ikke bare at appen som helhet kjører i localhost-miljø. Dette gjør at man kan kjøre f.eks. kun
 * aap-behandlingsflyt lokalt, mens andre backends (som aap-oppgave) fortsatt fakes/mockes.
 */
export const erBackendLokal = (baseUrl?: string) => isLocal() && !!baseUrl && baseUrl.includes('localhost');

/**
 * Skal vi fake/mocke kall mot en gitt backend? Kun aktuelt i localhost-miljø, og kun dersom den
 * spesifikke backend-en IKKE faktisk kjører lokalt (dvs. base-URL-en peker ikke på localhost).
 */
export const skalMockeBackend = (baseUrl?: string) => isLocal() && !erBackendLokal(baseUrl);
