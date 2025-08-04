import { ValuePair } from 'components/form/FormField';
import countries from 'i18n-iso-countries';

const { eeaMember } = require('is-european');
countries.registerLocale(require('i18n-iso-countries/langs/no.json'));

const countriesAlpha3: Record<string, string> = countries.getAlpha3Codes();
const countryList = Object.entries(countriesAlpha3).map(([key, value]) => ({ alpha2: value, alpha3: key }));
const eeaCountries: ValuePair[] = countryList
  .filter((country) => eeaMember(country.alpha2))
  .map((country) => ({
    value: country.alpha3,
    label: countries.getName(country.alpha3, 'no', { select: 'official' }) || '',
  }));

const eeaCountriesAlpha2: ValuePair[] = countryList
  .filter((country) => eeaMember(country.alpha2))
  .map((country) => ({
    value: country.alpha2,
    label: countries.getName(country.alpha2, 'no', { select: 'official' }) || '',
  }));

const alpha3Countries: ValuePair[] = countryList.map((country) => ({
  value: country.alpha3,
  label: countries.getName(country.alpha3, 'no', { select: 'official' }) || '',
}));

const filteredEeaCountries = eeaCountries.filter((country) => country.value !== 'NOR');
const filteredEeaCountriesAlpha2 = eeaCountriesAlpha2.filter((country) => country.value !== 'NO');

export const landMedTrygdesamarbeid: ValuePair[] = [
  { value: '', label: '' },
  ...filteredEeaCountries.sort((code, name) => code.label.localeCompare(name.label, 'no')),
  { value: 'CHE', label: countries.getName('CHE', 'no', { select: 'official' }) || '' },
  { value: 'AUS', label: countries.getName('AUS', 'no', { select: 'official' }) || '' },
  { value: 'GBR', label: countries.getName('GBR', 'no', { select: 'official' }) || '' },
];
export const landMedTrygdesamarbeidAlpha2: ValuePair[] = [
  { value: '', label: '' },
  ...filteredEeaCountriesAlpha2.sort((code, name) => code.label.localeCompare(name.label, 'no')),
  { value: 'CH', label: countries.getName('CH', 'no', { select: 'official' }) || '' },
  { value: 'AU', label: countries.getName('AU', 'no', { select: 'official' }) || '' },
  { value: 'GB', label: countries.getName('GB', 'no', { select: 'official' }) || '' },
];

export const landMedTrygdesamarbeidInklNorgeAlpha2: ValuePair[] = [
  ...landMedTrygdesamarbeidAlpha2,
  { value: 'NO', label: countries.getName('NO', 'no', { select: 'official' }) || '' },
];

export function getLandNavn(landkode: string) {
  return alpha3Countries.find((country) => country.value === landkode);
}
