import { isAfter, isBefore, isSameDay, subDays } from 'date-fns';

// Flytt denne til BE Om det blir for mye data/treghet oppleves i oppgavestyringen
export const filtrerPeriode = [
  (date: Date) => isSameDay(date, new Date()), // I dag
  (date: Date) => isSameDay(date, subDays(new Date(), 1)), // I går
  (date: Date) => isAfter(date, subDays(new Date(), 7)), // Denne uken
  (date: Date) => isAfter(date, subDays(new Date(), 14)) && isBefore(date, subDays(new Date(), 7)), // Forrige uke
];
