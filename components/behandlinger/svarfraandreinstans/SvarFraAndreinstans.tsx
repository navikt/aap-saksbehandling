'use client';

import { Hjemmel, MellomlagretVurdering, SvarFraAndreinstansGrunnlag, SvarKonsekvens } from 'lib/types/types';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { formaterSvartype, formaterUtfall } from 'lib/utils/svarfraandreinstans';
import { useConfigForm } from 'components/form/FormHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { getValgteHjemlerSomIkkeErImplementert, hjemmelalternativer, hjemmelMap } from 'lib/utils/hjemmel';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { FormField } from 'components/form/FormField';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';

interface Props {
  grunnlag?: SvarFraAndreinstansGrunnlag;
  behandlingVersjon: number;
  readOnly?: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  begrunnelse: string;
  konsekvens: SvarKonsekvens;
  vilkårSomSkalOmgjøres: Hjemmel[];
}

type DraftFormFields = Partial<FormFields>;

export const SvarFraAndreinstans = ({ grunnlag, readOnly, behandlingVersjon, initialMellomlagretVurdering }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('SVAR_FRA_ANDREINSTANS');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.HÅNDTER_SVAR_FRA_ANDREINSTANS, initialMellomlagretVurdering);

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.gjeldendeVurdering);

  const svarType = grunnlag?.svarFraAndreinstans.type;
  const utfall = grunnlag?.svarFraAndreinstans.utfall;
  const feilregistrertBegrunnelse = grunnlag?.svarFraAndreinstans.feilregistrertBegrunnelse;

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Kommentar',
        rules: { required: 'Du må skrive en kommentar' },
        defaultValue: defaultValue.begrunnelse,
      },
      konsekvens: {
        type: 'radio',
        label: 'Hva er resulatet av klageinstansens behandling?',
        rules: { required: 'Du må ta stilling til konsekvensen behandlingen' },
        options: [
          { value: 'OMGJØRING', label: 'Vedtak omgjøres helt / delvis' },
          { value: 'INGENTING', label: 'Vedtak opprettholdes / ingen endring' },
          { value: 'BEHANDLE_PÅ_NYTT', label: 'Klage må vurderes på nytt' },
        ],
        defaultValue: defaultValue.konsekvens,
      },
      vilkårSomSkalOmgjøres: {
        type: 'combobox_multiple',
        label: 'Hvilke vilkår skal omgjøres?',
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
        options: hjemmelalternativer,
        defaultValue: defaultValue.vilkårSomSkalOmgjøres,
      },
    },
    { readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(
      (data) => {
        løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.HÅNDTER_SVAR_FRA_ANDREINSTANS,
            svarFraAndreinstansVurdering: {
              begrunnelse: data.begrunnelse,
              konsekvens: data.konsekvens,
              vilkårSomOmgjøres: data.konsekvens == 'OMGJØRING' ? data.vilkårSomSkalOmgjøres : [],
            },
          },
          referanse: behandlingsreferanse,
        });
      },
      () => nullstillMellomlagretVurdering()
    )(event);
  };

  const konsekvens = form.watch('konsekvens');

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={'Vurder konsekvens av svar fra Nav Klageinstans'}
      steg={'SVAR_FRA_ANDREINSTANS'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visBekreftKnapp={!readOnly}
      vilkårTilhørerNavKontor={false}
      readOnly={readOnly}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() =>
          form.reset(
            grunnlag?.gjeldendeVurdering
              ? mapVurderingToDraftFormFields(grunnlag.gjeldendeVurdering)
              : emptyDraftFormFields()
          )
        )
      }
    >
      <VStack gap={'4'}>
        {svarType && (
          <HStack gap="2">
            <BodyShort weight="semibold">Type svar:</BodyShort>
            <BodyShort>{formaterSvartype(svarType)}</BodyShort>
          </HStack>
        )}
        {utfall && (
          <HStack gap="2">
            <BodyShort weight="semibold">Utfall:</BodyShort>
            <BodyShort>{grunnlag?.svarFraAndreinstans.utfall && formaterUtfall(utfall)}</BodyShort>
          </HStack>
        )}
        {feilregistrertBegrunnelse && (
          <HStack gap="2">
            <BodyShort weight="semibold">Begrunnelse for feilregistrering:</BodyShort>
            <BodyShort>{feilregistrertBegrunnelse}</BodyShort>
          </HStack>
        )}
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.konsekvens} />
        {konsekvens === 'OMGJØRING' && <FormField form={form} formField={formFields.vilkårSomSkalOmgjøres} />}
      </VStack>
    </VilkårskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(vurdering: SvarFraAndreinstansGrunnlag['gjeldendeVurdering']): DraftFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse,
    konsekvens: vurdering?.konsekvens,
    vilkårSomSkalOmgjøres: vurdering?.vilkårSomOmgjøres,
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    konsekvens: '' as SvarKonsekvens, // Vi caster denne da vi ikke ønsker å ødelegge typen på den i løs-behov
    vilkårSomSkalOmgjøres: [],
  };
}
