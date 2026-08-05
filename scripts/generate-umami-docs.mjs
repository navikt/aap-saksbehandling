#!/usr/bin/env node
/**
 * Genererer en Markdown-oversikt over alle Umami-hendelser (`UmamiKelvinEvent`) appen kan sende
 * til `/api/umami`, inkludert alle mulige felter per event-type og de faktiske gyldige verdiene
 * for `name`.
 *
 * Kjøres med: `node scripts/generate-umami-docs.mjs`
 * Output kan limes rett inn i Confluence (Markdown-innsetting) eller lagres til fil:
 *   `node scripts/generate-umami-docs.mjs > umami-events.md`
 *
 * Skriptet leser kildekoden i lib/utils/umami/*.ts med enkle regex-uttrekk for å holde
 * navnelistene (steg, hendelsesserie-kontekster, navigeringsmål) i sync med koden automatisk.
 * Felt-beskrivelsene under er skrevet manuelt og bør oppdateres hvis interfacene i
 * lib/utils/umami/*.ts endres.
 *
 * Output-Markdownen kjøres gjennom prosjektets prettier-oppsett (parser: markdown) før den
 * skrives ut, slik at f.eks. tabellkolonner er riktig justert.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const __dirname = dirname(fileURLToPath(import.meta.url));
const umamiDir = join(__dirname, '..', 'lib', 'utils', 'umami');

function readSource(file) {
  return readFileSync(join(umamiDir, file), 'utf-8');
}

/** Trekker ut alle strenger i en `const X = [...] as const`-array-literal. */
function extractStringArray(source, constName) {
  const match = source.match(new RegExp(`${constName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*as const`));
  if (!match) throw new Error(`Fant ikke konstanten ${constName}`);
  return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

const stegSource = readSource('steg.ts');
const hendelserVarighetSource = readSource('hendelserVarighet.ts');
const navigeringSource = readSource('navigering.ts');

const UMAMI_STEG = extractStringArray(stegSource, 'UMAMI_STEG');
const UMAMI_HENDELSER_SERIE_KONTEKST = extractStringArray(hendelserVarighetSource, 'UMAMI_HENDELSER_SERIE_KONTEKST');
const UMAMI_NAVIGERING_MÅL = extractStringArray(navigeringSource, 'UMAMI_NAVIGERING_MÅL');
const UMAMI_OPPGAVE_HANDLING = extractStringArray(navigeringSource, 'UMAMI_OPPGAVE_HANDLING');

const varighetNavn = UMAMI_STEG.map((steg) => `STEG_${steg}_VARIGHET`);
const hendelserVarighetNavn = UMAMI_HENDELSER_SERIE_KONTEKST.map((k) => `${k}_HENDELSER_VARIGHET`);
const navigeringNavn = [
  ...UMAMI_NAVIGERING_MÅL.map((mål) => `GÅ_TIL_${mål}`),
  ...UMAMI_OPPGAVE_HANDLING.map((h) => `${h}_OPPGAVE`),
];

/** Definisjon av hver event-type i `UmamiKelvinEvent`-unionen, brukt til å bygge Markdown-tabeller. */
const eventTypes = [
  {
    type: 'VARIGHET',
    beskrivelse:
      'Engangs tidsmåling for hvor lenge en saksbehandler bruker på et gitt behandlingssteg. ' +
      '`STEG_`-prefikset er en bevisst kategori-markør som lar alle steg-varighetseventer ' +
      'filtreres/grupperes samlet i Umami-dashboards.',
    kilde: 'lib/utils/umami/varighet.ts',
    funksjoner: ['loggUmamiVarighet(hendelse, start, stop)', 'loggUmamiBrevVarighet(hendelse, start, stop, brevtype)'],
    felter: [
      { navn: 'type', typ: "'VARIGHET'", pkt: 'Ja', beskrivelse: 'Diskriminator for event-varianten.' },
      { navn: 'name', typ: 'STEG_<STEG>_VARIGHET', pkt: 'Ja', beskrivelse: 'Hvilket behandlingssteg som ble målt.' },
      {
        navn: 'varighet_sekunder',
        typ: 'number',
        pkt: 'Ja',
        beskrivelse: 'Antall sekunder brukt på steget (stop − start).',
      },
      {
        navn: 'brevtype',
        typ: 'string',
        pkt: 'Nei',
        beskrivelse: 'Kun satt via loggUmamiBrevVarighet — hvilken brevtype som ble skrevet.',
      },
    ],
    gyldigeNavn: varighetNavn,
  },
  {
    type: 'HENDELSER_VARIGHET',
    beskrivelse:
      'Tidsmåling for en serie delhendelser innenfor én kontekst (f.eks. hvert felt en beslutter ' +
      'fyller ut, i rekkefølge, med varighet siden forrige delhendelse).',
    kilde: 'lib/utils/umami/hendelserVarighet.ts',
    funksjoner: [
      'loggUmamiVarighetHendelser(hendelser, hendelseSerie)',
      'useUmamiVarighetHendelser(hendelseSerieNavn)',
    ],
    felter: [
      { navn: 'type', typ: "'HENDELSER_VARIGHET'", pkt: 'Ja', beskrivelse: 'Diskriminator for event-varianten.' },
      {
        navn: 'name',
        typ: '<KONTEKST>_HENDELSER_VARIGHET',
        pkt: 'Ja',
        beskrivelse: 'Hvilken hendelsesserie-kontekst dette er en del av.',
      },
      {
        navn: 'hendelser_serie',
        typ: 'string',
        pkt: 'Ja',
        beskrivelse: 'Samme verdi som `name` — navnet på serien delhendelsen tilhører.',
      },
      {
        navn: 'hendelser_serie_id',
        typ: 'string (UUID)',
        pkt: 'Ja',
        beskrivelse: 'Unik id (crypto.randomUUID()) som knytter alle delhendelser i én serie sammen.',
      },
      {
        navn: 'delhendelse',
        typ: 'string',
        pkt: 'Ja',
        beskrivelse: 'Hvilken delhendelse i serien dette er, f.eks. et feltnavn eller en handling.',
      },
      {
        navn: 'varighet_sekunder',
        typ: 'number',
        pkt: 'Ja',
        beskrivelse: 'Sekunder siden serien startet.',
      },
      {
        navn: 'varighet_sekunder_siden_forrige',
        typ: 'number | null',
        pkt: 'Ja',
        beskrivelse: 'Sekunder siden forrige delhendelse i serien (null for den første).',
      },
      {
        navn: 'tidsstempel',
        typ: 'number (epoch ms)',
        pkt: 'Ja',
        beskrivelse: 'Tidspunktet delhendelsen ble registrert.',
      },
    ],
    gyldigeNavn: hendelserVarighetNavn,
  },
  {
    type: 'LENKE_KLIKK',
    beskrivelse: 'Brukerinitiert klikk på en ekstern lenke (f.eks. lenke til Gosys).',
    kilde: 'lib/utils/umami/lenkeKlikk.ts',
    funksjoner: ['loggUmamiEksternLenkeKlikk(steg, lenketekst)'],
    felter: [
      { navn: 'type', typ: "'LENKE_KLIKK'", pkt: 'Ja', beskrivelse: 'Diskriminator for event-varianten.' },
      {
        navn: 'name',
        typ: "'EKSTERN_LENKE_KLIKK'",
        pkt: 'Ja',
        beskrivelse: 'Fast verdi — kun én lenke-klikk-hendelse finnes i dag.',
      },
      { navn: 'lenketekst', typ: 'string', pkt: 'Ja', beskrivelse: 'Synlig tekst på lenken som ble klikket.' },
      {
        navn: 'steg',
        typ: 'StegType',
        pkt: 'Nei',
        beskrivelse: 'Hvilket behandlingssteg/vilkårskort lenken ble klikket fra.',
      },
    ],
    gyldigeNavn: ['EKSTERN_LENKE_KLIKK'],
  },
  {
    type: 'NAVIGERING',
    beskrivelse: 'Navigasjon til en behandling/saksoversikt, eller en handling utført på en oppgave.',
    kilde: 'lib/utils/umami/navigering.ts',
    funksjoner: [
      'loggUmamiGåTilBehandling(inngang)',
      'loggUmamiGåTilBehandlingOgReserver(inngang)',
      'loggUmamiGåTilSaksoversikt(inngang)',
      'loggUmamiReserverOppgave(inngang)',
      'loggUmamiFrigiOppgave(inngang)',
      'loggUmamiTildelOppgave(inngang)',
    ],
    felter: [
      { navn: 'type', typ: "'NAVIGERING'", pkt: 'Ja', beskrivelse: 'Diskriminator for event-varianten.' },
      {
        navn: 'name',
        typ: 'GÅ_TIL_<MÅL> | <HANDLING>_OPPGAVE',
        pkt: 'Ja',
        beskrivelse: 'Navigasjonsmålet, eller hvilken oppgavehandling som ble utført.',
      },
      {
        navn: 'inngang',
        typ: 'BehandlingInngang | SaksoversiktInngang | OppgaveInngang',
        pkt: 'Ja',
        beskrivelse: 'Hvor brukeren navigerte fra (f.eks. SAKSOVERSIKT, MINE_OPPGAVER, SØK_PERSON).',
      },
      {
        navn: 'reserverer',
        typ: 'boolean',
        pkt: 'Nei',
        beskrivelse: 'true når navigasjon til behandling samtidig reserverer oppgaven for saksbehandler.',
      },
    ],
    gyldigeNavn: navigeringNavn,
  },
];

const inngangVerdier = {
  BehandlingInngang: ['SAKSOVERSIKT', 'SAKSOVERSIKT_EKSTERN_LØSNING', 'SØK_OPPGAVE', 'MINE_OPPGAVER'],
  SaksoversiktInngang: ['MINE_OPPGAVER', 'SØK_PERSON', 'SØK_SAK'],
  OppgaveInngang: ['MINE_OPPGAVER'],
};

/** Escaper `|` slik at unionstyper (f.eks. `number | null`) ikke ødelegger Markdown-tabellceller. */
function escapeTableCell(value) {
  return value.replace(/\|/g, '\\|');
}

function renderFieldTable(felter) {
  const header = '| Felt | Type | Påkrevd | Beskrivelse |\n|---|---|---|---|';
  const rows = felter.map(
    (f) => `| \`${f.navn}\` | \`${escapeTableCell(f.typ)}\` | ${f.pkt} | ${escapeTableCell(f.beskrivelse)} |`
  );
  return [header, ...rows].join('\n');
}

function renderNameList(navn) {
  return navn.map((n) => `- \`${n}\``).join('\n');
}

const lines = [];
lines.push('# Umami-hendelser i aap-saksbehandling');
lines.push('');
lines.push(
  '_Autogenerert med `scripts/generate-umami-docs.mjs` fra `lib/utils/umami/*.ts`. ' +
    'Kjør skriptet på nytt etter endringer i disse filene for å oppdatere denne oversikten._'
);
lines.push('');
lines.push(
  'Alle hendelser sendes via `clientLoggUmamiEvent` → `POST /api/umami` → Umami, typet som en ' +
    'diskriminert union `UmamiKelvinEvent` på feltet `type`. Navnekonvensjon: ' +
    '`<KONTEKST>_<HANDLING>[_<DETALJ>]` i `SCREAMING_SNAKE_CASE`.'
);
lines.push('');
lines.push(
  `Totalt **${varighetNavn.length + hendelserVarighetNavn.length + navigeringNavn.length + 1}** gyldige \`name\`-verdier på tvers av ${eventTypes.length} event-typer.`
);
lines.push('');
lines.push('## Innholdsfortegnelse');
eventTypes.forEach((e) => lines.push(`- [${e.type}](#${e.type.toLowerCase().replace(/_/g, '-')})`));
lines.push('- [Inngang-verdier](#inngang-verdier)');
lines.push('');

for (const eventType of eventTypes) {
  lines.push(`## ${eventType.type}`);
  lines.push('');
  lines.push(eventType.beskrivelse);
  lines.push('');
  lines.push(`**Kilde:** \`${eventType.kilde}\``);
  lines.push('');
  lines.push('**Funksjoner:**');
  eventType.funksjoner.forEach((f) => lines.push(`- \`${f}\``));
  lines.push('');
  lines.push('**Felter:**');
  lines.push('');
  lines.push(renderFieldTable(eventType.felter));
  lines.push('');
  lines.push(`**Gyldige \`name\`-verdier (${eventType.gyldigeNavn.length}):**`);
  lines.push('');
  lines.push(renderNameList(eventType.gyldigeNavn));
  lines.push('');
}

lines.push('## Inngang-verdier');
lines.push('');
lines.push('Gyldige verdier for `inngang`-feltet på `NAVIGERING`-eventer, gruppert etter type:');
lines.push('');
for (const [type, verdier] of Object.entries(inngangVerdier)) {
  lines.push(`**${type}:**`);
  lines.push(renderNameList(verdier));
  lines.push('');
}

const markdown = lines.join('\n') + '\n';
const formatted = await prettier.format(markdown, { parser: 'markdown' });

process.stdout.write(formatted);
