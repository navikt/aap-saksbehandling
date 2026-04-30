import { StylesConfig } from 'react-select';

export const customStyles: StylesConfig = {
  container: (provided) => ({
    ...provided,
  }),
  // Denne er for selve komponenten
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #9197A2',
    boxShadow: state.isFocused ? '0 0 0 4px #1f2733' : 'none',
    ':hover': {
      borderColor: '#1f2733',
    },
  }),

  // Denne er for chipsene når det er mulig å velge flere
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#005bb6',
    borderRadius: '5px',
    color: 'white',
  }),

  // Denne er for label i chips når det er mulig å velge flere
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white',
  }),

  // Knapp for å fjerne element når det er mulig å velge flere
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'white',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#0063c1', // Lighter blue on hover
      color: 'white',
    },
  }),

  // Chevron
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#5f6167',
  }),

  // Fjern alle valg knapp
  clearIndicator: (provided) => ({
    ...provided,
    color: '#5f6167',
  }),

  // Container for selve "menyen" som dukker opp
  menu: (base) => ({
    ...base,
    zIndex: 1000, // Setter Z-index slik at den faktisk er forran ting bak, dette fikset et problem med "clickthrough" hvor man kunne trykke på form-elementer som lå bak
  }),
};
