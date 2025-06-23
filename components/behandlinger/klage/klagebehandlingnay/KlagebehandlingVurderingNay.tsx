'use client';

import { useConfigForm } from 'components/form/FormHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormField } from 'components/form/FormField';
import { Hjemmel, KlagebehandlingNayGrunnlag, KlageInnstilling, TypeBehandling } from 'lib/types/types';
import { FormEvent, useEffect } from 'react';
import { Behovstype } from 'lib/utils/form';
import { hjemmelalternativer, getValgteHjemlerSomIkkeErImplementert, hjemmelMap } from 'lib/utils/hjemmel';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';

interface Props {
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  grunnlag?: KlagebehandlingNayGrunnlag;
}

interface FormFields {
  vurdering: string;
  notat: string;
  innstilling: KlageInnstilling;
  vilkårSomSkalOmgjøres: Hjemmel[];
  vilkårSomSkalOpprettholdes: Hjemmel[];
}

export const KlagebehandlingVurderingNay = ({ behandlingVersjon, readOnly, grunnlag }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('KLAGEBEHANDLING_NAY');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      vurdering: {
        type: 'textarea',
        label: 'Vurder klage',
        description: 'Vurderingen vises i brev til bruker',
        rules: { required: 'Du må vurdere klagen' },
        defaultValue: grunnlag?.vurdering?.begrunnelse,
      },
      notat: {
        type: 'textarea',
        label: 'Internt notat',
        description: 'Notatet er kun synlig i Kelvin',
        defaultValue: grunnlag?.vurdering?.notat ?? undefined,
      },
      innstilling: {
        type: 'radio',
        label: 'Hva er innstillingen på vilkårene NAY vurderer?',
        rules: { required: 'Du må ta stilling til hvorvidt klagen skal omgjøres, delvis omgjøres eller opprettholdes' },
        options: [
          { value: 'OPPRETTHOLD', label: 'Vedtak opprettholdes' },
          {
            value: 'OMGJØR',
            label: 'Vedtak omgjøres',
          },
          { value: 'DELVIS_OMGJØR', label: 'Delvis omgjøring' },
        ],
        defaultValue: grunnlag?.vurdering?.innstilling,
      },
      vilkårSomSkalOmgjøres: {
        type: 'combobox_multiple',
        label: 'Hvilke vilkår skal omgjøres?',
        description: 'Velg alle påklagde vilkår som skal omgjøres som følge av klagen',
        options: hjemmelalternativer,
        defaultValue: grunnlag?.vurdering?.vilkårSomOmgjøres,
        rules: {
          required: 'Du velge hvilke påklagde vilkår som skal omgjøres',
          validate: (value) => {
            const ikkeImplementerteHjemler = getValgteHjemlerSomIkkeErImplementert(value);
            if (ikkeImplementerteHjemler.length > 0) {
              const hjemmelnavn = ikkeImplementerteHjemler.map((hjemmel) => hjemmelMap[hjemmel]).join(', ');
              return `Det er ikke mulig å opprette revurdering på ${hjemmelnavn} enda. Sett klagen på vent og ta kontakt med team AAP.`;
            }
            return true;
          },
        },
      },
      vilkårSomSkalOpprettholdes: {
        type: 'combobox_multiple',
        label: 'Hvilke vilkår er blitt vurdert til å opprettholdes?',
        description: 'Velg alle påklagde vilkår som blir opprettholdt',
        options: hjemmelalternativer,
        defaultValue: grunnlag?.vurdering?.vilkårSomOpprettholdes,
        rules: { required: 'Du velge hvilke påklagde vilkår som skal opprettholdes' },
      },
    },
    { readOnly }
  );

  const innstilling = form.watch('innstilling');

  useEffect(() => {
    if (innstilling === 'OMGJØR') {
      form.setValue('vilkårSomSkalOpprettholdes', []);
    } else if (innstilling === 'OPPRETTHOLD') {
      form.setValue('vilkårSomSkalOmgjøres', []);
    }
  }, [form, innstilling]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.VURDER_KLAGE_NAY,
          klagevurderingNay: {
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
      heading={'Behandle klage'}
      steg={'KLAGEBEHANDLING_NAY'}
      onSubmit={handleSubmit}
      vilkårTilhørerNavKontor={false}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
    >
      <FormField form={form} formField={formFields.vurdering} />
      <FormField form={form} formField={formFields.notat} />
      <FormField form={form} formField={formFields.innstilling} />
      {['OMGJØR', 'DELVIS_OMGJØR'].includes(innstilling) && (
        <FormField form={form} formField={formFields.vilkårSomSkalOmgjøres} />
      )}
      {['OPPRETTHOLD', 'DELVIS_OMGJØR'].includes(innstilling) && (
        <FormField form={form} formField={formFields.vilkårSomSkalOpprettholdes} />
      )}
    </VilkårsKortMedForm>
  );
};
