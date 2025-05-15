'use client';

import { useConfigForm } from 'components/form/FormHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormField } from 'components/form/FormField';
import { Hjemmel, KlageInnstilling, TypeBehandling } from 'lib/types/types';
import { hjemmelalternativer } from 'lib/utils/hjemmel';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';

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
  vilkårSomSkalOmgjøres: Hjemmel;
  vilkårSomSkalOpprettholdes: Hjemmel;
}

export const KlagebehandlingVurderingKontor = ({ behandlingVersjon, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('KLAGEBEHANDLING_KONTOR');

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
          { value: 'OPPRETTHOLD', label: 'Vedtak opprettholdes' },
          {
            value: 'OMGJØR',
            label: 'Vedtak omgjøres',
          },
          { value: 'DELVIS_OMGJØR', label: 'Delvis omgjøring' },
        ],
      },
      vilkårSomSkalOmgjøres: {
        type: 'combobox_multiple',
        label: 'Hvilke vilkår skal omgjøres?',
        description: 'Velg alle påklagde vilkår som skal omgjøres',
        options: hjemmelalternativer,
      },
      vilkårSomSkalOpprettholdes: {
        type: 'combobox_multiple',
        label: 'Hvilke vilkår skal opprettholdes?',
        description: 'Velg alle påklagde vilkår som blir opprettholdt',
        options: hjemmelalternativer,
      },
    },
    { readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.VURDER_KLAGE_KONTOR,
          klagevurderingKontor: {
            begrunnelse: data.vurdering,
            notat: data.notat,
            innstilling: data.innstilling,
            vilkårSomOmgjøres: data.vilkårSomSkalOmgjøres ?? [],
            vilkårSomOpprettholdes: data.vilkårSomSkalOpprettholdes ?? [],
          },
        },
        referanse: behandlingsreferanse,
      });
    })(event);
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
