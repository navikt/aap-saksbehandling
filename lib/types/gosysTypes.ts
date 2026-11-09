import { components, operations } from './gosysSchema';

export type FinnGosysOppgaverQueryParams = NonNullable<operations['finnOppgaver']['parameters']['query']>;
export type FinnGosysOppgaverResponse = operations['finnOppgaver']['responses'][200]['content']['application/json'];
export type GosysOppgave = components['schemas']['Oppgave'];
