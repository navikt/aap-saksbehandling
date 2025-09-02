'use client';

import { useConfigForm } from 'components/form/FormHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { VilkRskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { FormField } from 'components/form/FormField';
import {
  Hjemmel,
  KlagebehandlingNayGrunnlag,
  KlageInnstilling,
  MellomlagretVurdering,
  TypeBehandling,
} from 'lib/types/types';
import { FormEvent, useEffect } from 'react';
import { Behovstype } from 'lib/utils/form';
import { getValgteHjemlerSomIkkeErImplementert, hjemmelalternativer, hjemmelMap } from 'lib/utils/hjemmel';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';

interface Props {
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  grunnlag?: KlagebehandlingNayGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  vurdering: string;
  notat: string;
  innstilling: KlageInnstilling;
  vilkårSomSkalOmgjøres: Hjemmel[];
  vilkårSomSkalOpprettholdes: Hjemmel[];
}

type DraftFormFields = Partial<FormFields>;

export const KlagebehandlingVurderingNay = ({
  behandlingVersjon,
  readOnly,
  grunnlag,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('KLAGEBEHANDLING_NAY');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.VURDER_KLAGE_NAY, initialMellomlagretVurdering);

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.vurdering);

  const { formFields, form } = useConfigForm<FormFields>(
    {
      vurdering: {
        type: 'textarea',
        label: 'Vurder klage',
        description: 'Vurderingen skal brukes i brevet til bruker',
        rules: { required: 'Du må vurdere klagen' },
        defaultValue: defaultValue.vurdering,
      },
      notat: {
        type: 'textarea',
        label: 'Kommentar til klageinstans (frivillig)',
        description: 'Bruker kan få innsyn i denne teksten',
        defaultValue: defaultValue.notat,
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
        defaultValue: defaultValue.innstilling,
      },
      vilkårSomSkalOmgjøres: {
        type: 'combobox_multiple',
        label: 'Hvilke vilkår skal omgjøres?',
        description: 'Velg alle påklagde vilkår som skal omgjøres som følge av klagen',
        options: hjemmelalternativer,
        defaultValue: defaultValue.vilkårSomSkalOmgjøres,
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
        defaultValue: defaultValue.vilkårSomSkalOpprettholdes,
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
      løsBehovOgGåTilNesteSteg(
        {
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
        },
        () => nullstillMellomlagretVurdering()
      );
    })(event);
  };

  return (
    <VilkRskortMedFormOgMellomlagring
      heading={'Behandle klage'}
      steg={'KLAGEBEHANDLING_NAY'}
      onSubmit={handleSubmit}
      vilkårTilhørerNavKontor={false}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
      readOnly={readOnly}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() =>
          form.reset(grunnlag?.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields())
        )
      }
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
    </VilkRskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(vurdering: KlagebehandlingNayGrunnlag['vurdering']): DraftFormFields {
  return {
    vurdering: vurdering?.begrunnelse,
    notat: vurdering?.notat || undefined,
    innstilling: vurdering?.innstilling,
    vilkårSomSkalOmgjøres: vurdering?.vilkårSomOmgjøres,
    vilkårSomSkalOpprettholdes: vurdering?.vilkårSomOpprettholdes,
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    vurdering: '',
    notat: '',
    vilkårSomSkalOpprettholdes: [],
    vilkårSomSkalOmgjøres: [],
    innstilling: '' as KlageInnstilling, // Vi caster denne da vi ikke ønsker å ødelegge typen på den i løs-behov
  };
}
