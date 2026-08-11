/**
 * Hjelpetyper for å gjøre om "nominelle" enum-typer til "strukturelle" string literal unions.
 *
 * Enums i TypeScript er nominelle — to enums med identiske verdier er ikke kompatible
 * dersom de har forskjellig navn. Ved å konvertere til strukturelle typer kan vi fritt
 * blande verdier fra ulike DTO-er (f.eks. request og response) uten typefeil.
 */

/** Gjør om alle string/enum-felter i en objekttype til strukturelle string literal unions. */
export type Structuralize<T> = {
  [K in keyof T]: T[K] extends string | null | undefined
    ? `${NonNullable<T[K]>}` | Extract<T[K], null | undefined>
    : T[K];
};

/** Gjør om én enkelt enum-type til en string literal union. */
export type EnumToUnion<T extends string> = `${T}`;
