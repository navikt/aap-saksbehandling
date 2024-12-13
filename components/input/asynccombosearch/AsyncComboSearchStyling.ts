import { StylesConfig } from 'react-select';

export const customStyles: StylesConfig = {
  container: (provided) => ({
    ...provided,
  }),
  // Denne er for selve komponenten
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #9197A2',
    boxShadow: state.isFocused ? '0 0 0 4px #00347D' : 'none',
    ':hover': {
      borderColor: '#0357B5',
    },
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
