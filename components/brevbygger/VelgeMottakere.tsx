import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { Mottaker } from 'lib/types/types';
import { useEffect } from 'react';

interface Props {
  setMottakere: (mottakere: Mottaker[]) => void;
  readOnly: boolean;
  brukerNavn: string;
  bruker: Mottaker;
  fullmektig: Mottaker;
}

export function VelgeMottakere({ setMottakere, readOnly, fullmektig, brukerNavn, bruker }: Props) {
  interface FormFields {
    mottakere: ('BRUKER' | 'FULLMEKTIG')[];
  }

  const fullmektigNavn = fullmektig.navnOgAdresse?.navn;

  const { formFields, form } = useConfigForm<FormFields>(
    {
      mottakere: {
        type: 'checkbox',
        label: 'Velg mottakere',
        options: [
          { label: brukerNavn ? `${brukerNavn} (Bruker)` : 'Bruker', value: 'BRUKER' },
          { label: fullmektigNavn ? `${fullmektigNavn} (Fullmektig)` : 'Fullmektig', value: 'FULLMEKTIG' },
        ],
        defaultValue: ['FULLMEKTIG'],
      },
    },
    { readOnly }
  );

  const valgteMottakere = form.watch('mottakere');
  useEffect(() => {
    const mottakere = valgteMottakere.map((mottaker) => (mottaker === 'BRUKER' ? bruker : fullmektig));
    setMottakere(mottakere);
  }, [bruker, fullmektig, setMottakere, valgteMottakere]);

  return (
    <div>
      <FormField form={form} formField={formFields.mottakere} />
    </div>
  );
}
