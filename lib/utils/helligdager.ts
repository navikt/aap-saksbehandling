import { addDays, isSameDay } from 'date-fns';
import { beregnPåskedag } from 'lib/utils/paaske';

// Faste (ikke-flyttbare) norske helligdager.
const FASTE_HELLIGDAGER = [
  { måned: 0, dag: 1 }, // 1. nyttårsdag
  { måned: 4, dag: 1 }, // 1. mai (arbeidernes dag)
  { måned: 4, dag: 17 }, // 17. mai (grunnlovsdag)
  { måned: 11, dag: 25 }, // 1. juledag
  { måned: 11, dag: 26 }, // 2. juledag
];

/**
 * De bevegelige helligdagene som følger påsken. 1. påskedag og 1. pinsedag er alltid søndager
 * og er derfor ikke tatt med her - de er allerede utelatt av en vanlig virkedag-sjekk.
 */
function bevegeligeHelligdager(år: number): Date[] {
  const påskedag = beregnPåskedag(år);

  return [
    addDays(påskedag, -3), // skjærtorsdag
    addDays(påskedag, -2), // langfredag
    addDays(påskedag, 1), // 2. påskedag
    addDays(påskedag, 39), // Kristi himmelfartsdag
    addDays(påskedag, 50), // 2. pinsedag
  ];
}

export function erNorskHelligdag(dato: Date): boolean {
  const erFastHelligdag = FASTE_HELLIGDAGER.some(({ måned, dag }) => dato.getMonth() === måned && dato.getDate() === dag);

  if (erFastHelligdag) {
    return true;
  }

  return bevegeligeHelligdager(dato.getFullYear()).some((helligdag) => isSameDay(helligdag, dato));
}
