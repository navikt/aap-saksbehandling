'use client';

import { Hjemmel, SvarFraAndreinstansGrunnlag, SvarKonsekvens } from 'lib/types/types';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { formaterSvartype, formaterUtfall } from 'lib/utils/svarfraandreinstans';
import { useConfigForm } from 'components/form/FormHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { getValgteHjemlerSomIkkeErImplementert, hjemmelalternativer, hjemmelMap } from 'lib/utils/hjemmel';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormField } from 'components/form/FormField';

interface Props {
  grunnlag?: SvarFraAndreinstansGrunnlag;
  behandlingVersjon: number;
  readOnly?: boolean;
}

interface FormFields {
  begrunnelse: string;
  konsekvens: SvarKonsekvens;
  vilkårSomSkalOmgjøres: Hjemmel[];
}

export const SvarFraAndreinstans = ({ grunnlag, readOnly, behandlingVersjon }: Props) => {
  const svarType = grunnlag?.svarFraAndreinstans.type;
  const utfall = grunnlag?.svarFraAndreinstans.utfall;
  const feilregistrertBegrunnelse = grunnlag?.svarFraAndreinstans.feilregistrertBegrunnelse;

  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('SVAR_FRA_ANDREINSTANS');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Kommentar',
        rules: { required: 'Du må skrive en kommentar' },
        defaultValue: grunnlag?.gjeldendeVurdering?.begrunnelse,
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
        defaultValue: grunnlag?.gjeldendeVurdering?.konsekvens,
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
        defaultValue: grunnlag?.gjeldendeVurdering?.vilkårSomOmgjøres,
      },
    },
    { readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
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
    })(event);
  };

  const konsekvens = form.watch('konsekvens');

  return (
    <VilkårsKortMedForm
      heading={'Vurder konsekvens av svar fra Nav Klageinstans'}
      steg={'SVAR_FRA_ANDREINSTANS'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visBekreftKnapp={!readOnly}
      vilkårTilhørerNavKontor={false}
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
    </VilkårsKortMedForm>
  );
};
