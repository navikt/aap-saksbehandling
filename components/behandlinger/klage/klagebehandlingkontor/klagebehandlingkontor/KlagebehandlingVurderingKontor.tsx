'use client';

import { useConfigForm } from 'components/form/FormHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormField } from 'components/form/FormField';
import { TypeBehandling } from 'lib/types/types';

interface Props {
  behandlingVersjon: number;
  erAktivtSteg: boolean;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
}

interface FormFields {
  vurdering: string;
  notat: string;
  innstilling: KlageInnstilling;
  vilkårSomSkalOmgjøres: string[];
  vilkårSomSkalOpprettholdes: string[];
}

export const KlagebehandlingVurderingKontor = ({ readOnly }: Props) => {
  const { status, isLoading, løsBehovOgGåTilNesteStegError } = useLøsBehovOgGåTilNesteSteg('KLAGEBEHANDLING_KONTOR');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      vurdering: {
        type: 'textarea',
        label: 'Vurder klage',
        description: 'Vurderingen vises i brev til bruker',
        rules: { required: 'Du må vurdere klagen' },
      },
      notat: {
        type: 'textarea',
        label: 'Internt notat',
        description: 'Notatet er kun synlig i Kelvin',
      },
      innstilling: {
        type: 'radio',
        label: 'Hva er innstillingen til klagen på Nav-kontorets vilkår?',
        rules: { required: 'Du må ta stilling til hvorvidt klagen skal omgjøres, delvis omgjøres eller opprettholdes' },
        options: [
          { value: 'Opprettholdes', label: 'Vedtak opprettholdes' },
          {
            value: 'Omgjøres',
            label: 'Vedtak omgjøres',
          },
          { value: 'OmgjøresDelvis', label: 'Delvis omgjøring' },
        ],
      },
      vilkårSomSkalOmgjøres: {
        type: 'combobox_multiple',
        label: 'Hvilke vilkår skal omgjøres?',
        description: 'Velg alle påklagde vilkår som skal omgjøres',
        options: [
          { label: 'Test-vilkår', value: 'test-vilkår' },
          { label: 'Test-vilkår2', value: 'test-vilkår2' },
        ],
      },
      vilkårSomSkalOpprettholdes: {
        type: 'combobox_multiple',
        label: 'Hvilke vilkår skal opprettholdes?',
        description: 'Velg alle påklagde vilkår som blir opprettholdt',
        options: [
          { label: 'Test-vilkår', value: 'test-vilkår' },
          { label: 'Test-vilkår2', value: 'test-vilkår2' },
        ],
      },
    },
    { readOnly }
  );

  const handleSubmit = () => {
    // TODO Implement
  };

  return (
    <VilkårsKortMedForm
      heading={'Behandle klage - Nav-kontor'}
      steg={'KLAGEBEHANDLING_KONTOR'}
      onSubmit={handleSubmit}
      vilkårTilhørerNavKontor={true}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      erAktivtSteg={true}
    >
      <FormField form={form} formField={formFields.vurdering} />
      <FormField form={form} formField={formFields.notat} />
      <FormField form={form} formField={formFields.innstilling} />
      <FormField form={form} formField={formFields.vilkårSomSkalOmgjøres} />
      <FormField form={form} formField={formFields.vilkårSomSkalOpprettholdes} />
    </VilkårsKortMedForm>
  );
};

type KlageInnstilling = 'Omgjøres' | 'Opprettholdes' | 'OmgjøresDelvis';
