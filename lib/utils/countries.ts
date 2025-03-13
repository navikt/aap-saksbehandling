import { ValuePair } from 'components/form/FormField';
import countries from 'i18n-iso-countries';
const { eeaMember } = require('is-european');
countries.registerLocale(require('i18n-iso-countries/langs/no.json'));

const countriesAlpha3: Record<string, string> = countries.getAlpha3Codes();
const countryList = Object.entries(countriesAlpha3).map(([key, value]) => ({ alpha2: value, alpha3: key }));
console.log(countryList)
const eeaCountries: ValuePair[] = countryList
  .filter((country) => eeaMember(country.alpha2))
  .map((country) => ({
    value: country.alpha3,
    label: countries.getName(country.alpha3, 'no', { select: 'official' }) || '',
  }));

const filteredEeaCountries = eeaCountries.filter(country => country.value !== 'NOR');

export const landMedTrygdesamarbeid: ValuePair[] = [
  { value: '', label: '' },
  ...filteredEeaCountries,
  { value: 'CHE', label: countries.getName('CHE', 'no', { select: 'official' }) || '' },
  { value: 'AUS', label: countries.getName('AUS', 'no', { select: 'official' }) || '' },
  { value: 'GBR', label: countries.getName('GBR', 'no', { select: 'official' }) || '' },
].sort((code, name) => code.label.localeCompare(name.label, 'no'));
