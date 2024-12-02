import { StylesConfig } from 'react-select';

export const customStyles: StylesConfig = {
  // Denne er for selve komponenten
  control: (provided, state) => ({
    ...provided,
    border: '2px solid #003D79', // TODO Kan vi bruke fargene fra designsystemet her?
    boxShadow: state.isFocused ? '0 0 0 3px rgba(0, 61, 121, 0.3)' : 'none',
  }),

  // Denne er for chipsene når det er mulig å velge flere
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#003D79',
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
      backgroundColor: '#001F4B', // Darker blue on hover
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
};
