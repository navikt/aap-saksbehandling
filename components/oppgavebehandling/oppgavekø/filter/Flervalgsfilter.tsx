import { UNSAFE_Combobox } from '@navikt/ds-react';
import { FilterValg, Kø, KøContext } from 'components/oppgavebehandling/KøContext';
import { useContext } from 'react';

interface Props {
  label: string;
  filter: FilterValg;
  finnFilterOptionLabel: (filter: FilterValg, option: string) => string;
}

export const Flervalgsfilter = ({ label, filter, finnFilterOptionLabel }: Props) => {
  const køContext = useContext(KøContext);
  return (
    <UNSAFE_Combobox
      label={label}
      key={filter.navn}
      options={filter.alleFilter}
      selectedOptions={filter.valgteFilter}
      isMultiSelect
      shouldShowSelectedOptions
      size={'small'}
      onToggleSelected={(option, isSelected) => {
        const filterLabel = finnFilterOptionLabel(filter, option);

        if (isSelected) {
          if (køContext.valgtKø.flervalgsfilter) {
            // det finnes allerede filter her
            if (køContext.valgtKø.flervalgsfilter.find((v) => v.navn === filter.navn)) {
              // og dette filteret er allerede lagt til

              // finn index for det filteret vi skal endre på
              const valgtFilterIndex = køContext.valgtKø.flervalgsfilter.findIndex((v) => v.navn === filter.navn);
              // lag en kopi av eksisterende filter og legg til det nye valget
              const nyttFilter = [
                ...køContext.valgtKø.flervalgsfilter[valgtFilterIndex].valgteFilter,
                { value: option, label: filterLabel },
              ];

              const eksisterendeFilter = køContext.valgtKø.flervalgsfilter;
              eksisterendeFilter.forEach((f, index) => {
                if (f.navn === filter.navn) {
                  eksisterendeFilter[index] = { ...f, valgteFilter: nyttFilter };
                }
              });

              const oppdatertKø: Kø = {
                ...køContext.valgtKø,
                flervalgsfilter: eksisterendeFilter,
              };
              køContext.oppdaterValgtKø(oppdatertKø);
            }
          }
        } else {
          if (køContext.valgtKø.flervalgsfilter) {
            const valgtFilterIndex = køContext.valgtKø.flervalgsfilter.findIndex((v) => v.navn === filter.navn);
            const nyttFilter = [
              ...køContext.valgtKø.flervalgsfilter[valgtFilterIndex].valgteFilter.filter((v) => v.value !== option),
            ];
            const eksisterendeFilter = køContext.valgtKø.flervalgsfilter;
            eksisterendeFilter.forEach((f, index) => {
              if (f.navn === filter.navn) {
                eksisterendeFilter[index] = { ...f, valgteFilter: nyttFilter };
              }
            });

            const oppdatertKø: Kø = {
              ...køContext.valgtKø,
              flervalgsfilter: eksisterendeFilter,
            };
            køContext.oppdaterValgtKø(oppdatertKø);
          }
        }
      }}
    />
  );
};
