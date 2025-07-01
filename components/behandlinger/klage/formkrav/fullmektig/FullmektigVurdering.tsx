'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { useConfigForm } from 'components/form/FormHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormEvent } from 'react';
import { FormField, ValuePair } from 'components/form/FormField';
import { FullmektigGrunnlag, TypeBehandling } from 'lib/types/types';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { landMedTrygdesamarbeidInklNorge } from 'lib/utils/countries';

interface Props {
  grunnlag?: FullmektigGrunnlag;
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
}

interface FormFields {
  harFullmektig: JaEllerNei;
  idType: 'navnOgAdresse' | 'fnr' | 'orgnr';
  fullmektigIdent: string;
  navn: string;
  adresselinje1: string;
  adresselinje2?: string;
  adresselinje3?: string;
  postnummer: string;
  poststed: string;
  land: string;
}

export const FullmektigVurdering = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FULLMEKTIG');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      harFullmektig: {
        type: 'radio',
        label: 'Finnes det fullmektig eller verge i klagesaken?',
        rules: { required: 'Du må svare' },
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.harFullmektig),
        options: JaEllerNeiOptions,
      },
      idType: {
        type: 'radio',
        label: 'Hvordan skal verge/fullmektig identifiseres?',
        rules: { required: 'Du må velge idtype' },
        defaultValue: grunnlag?.vurdering?.fullmektigIdent
          ? 'ident'
          : grunnlag?.vurdering?.fullmektigNavnOgAdresse
            ? 'navnOgAdresse'
            : undefined,
        options: idTypeOptions(),
      },
      fullmektigIdent: {
        type: 'text',
        label: 'Org.nr/fnr',
        rules: { required: 'Du må skrive ident' },
        defaultValue: grunnlag?.vurdering?.fullmektigIdent ?? undefined,
      },
      navn: {
        type: 'text',
        label: 'Navn på fullmektig/verge',
        rules: { required: 'Du må skrive inn navn' },
        defaultValue: grunnlag?.vurdering?.fullmektigNavnOgAdresse?.navn ?? undefined,
      },
      adresselinje1: {
        type: 'text',
        label: 'Adresselinje 1',
        rules: { required: 'Du må skrive inn addresselinje 1' },
        defaultValue: grunnlag?.vurdering?.fullmektigNavnOgAdresse?.adresse?.adresselinje1 ?? undefined,
      },
      adresselinje2: {
        type: 'text',
        label: 'Adresselinje 2 (valgfritt)',
        defaultValue: grunnlag?.vurdering?.fullmektigNavnOgAdresse?.adresse?.adresselinje2 ?? undefined,
      },
      adresselinje3: {
        type: 'text',
        label: 'Adresselinje 3 (valgfritt)',
        defaultValue: grunnlag?.vurdering?.fullmektigNavnOgAdresse?.adresse?.adresselinje3 ?? undefined,
      },
      postnummer: {
        type: 'text',
        label: 'Postnummer',
        rules: { required: 'Du må skrive inn postnummer' },
        defaultValue: grunnlag?.vurdering?.fullmektigNavnOgAdresse?.adresse?.postnummer ?? undefined,
      },
      poststed: {
        type: 'text',
        label: 'Poststed',
        rules: { required: 'Du må skrive inn poststed' },
        defaultValue: grunnlag?.vurdering?.fullmektigNavnOgAdresse?.adresse?.poststed ?? undefined,
      },
      land: {
        type: 'combobox',
        label: 'Land',
        rules: {
          required: 'Du må velge land',
        },
        options: landMedTrygdesamarbeidInklNorge,
        defaultValue: grunnlag?.vurdering?.fullmektigNavnOgAdresse?.adresse?.landkode ?? undefined,
      },
    },
    { readOnly }
  );

  const harFullmektig = form.watch('harFullmektig') === JaEllerNei.Ja;
  const idType = form.watch('idType');
  const land = form.watch('land');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      const harFullmektig = data.harFullmektig === JaEllerNei.Ja;
      const idType = data.idType;
      const erNorskAdresse = erNorge(data.land);
      const navnOgAdresse =
        harFullmektig && idType !== 'fnr'
          ? {
              navn: data.navn,
              adresse: {
                adresselinje1: data.adresselinje1,
                adresselinje2: data.adresselinje2,
                adresselinje3: data.adresselinje3,
                ...(erNorskAdresse && {
                  postnummer: data.postnummer,
                  poststed: data.poststed,
                }),
                landkode: data.land,
              },
            }
          : undefined;

      const identType = mapIdentType(data.idType, data.land);

      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.FASTSETT_FULLMEKTIG,
          fullmektigVurdering: {
            harFullmektig: harFullmektig,
            fullmektigIdentMedType:
              harFullmektig && identType
                ? {
                    ident: data.fullmektigIdent,
                    type: identType,
                  }
                : undefined,
            fullmektigNavnOgAdresse: navnOgAdresse,
          },
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårsKortMedForm
      heading={'Fullmektig/verge'}
      steg={'FULLMEKTIG'}
      onSubmit={handleSubmit}
      vilkårTilhørerNavKontor={false}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
    >
      <FormField form={form} formField={formFields.harFullmektig} horizontalRadio />
      {harFullmektig && <FormField form={form} formField={formFields.idType} horizontalRadio />}
      {harFullmektig && idType && idType !== 'navnOgAdresse' && (
        <FormField form={form} formField={formFields.fullmektigIdent} className={'ident_input'} />
      )}
      {harFullmektig && idType && idType !== 'fnr' && (
        <>
          <FormField form={form} formField={formFields.land} />
          <FormField form={form} formField={formFields.navn} />
          <FormField form={form} formField={formFields.adresselinje1} />
          <FormField form={form} formField={formFields.adresselinje2} />
          <FormField form={form} formField={formFields.adresselinje3} />
          {erNorge(land) && (
            <>
              <FormField form={form} formField={formFields.postnummer} />
              <FormField form={form} formField={formFields.poststed} />
            </>
          )}
        </>
      )}
    </VilkårsKortMedForm>
  );

  function idTypeOptions(): ValuePair[] {
    return [
      { label: 'Fnr', value: 'fnr' },
      { label: 'Org.nr', value: 'orgnr' },
      { label: 'Navn og adresse', value: 'navnOgAdresse' },
    ];
  }

  function erNorge(land: string): boolean {
    return land === 'NOR';
  }

  function mapIdentType(idType: string, landkode?: string): IdentType | undefined {
    switch (idType) {
      case 'fnr':
        return 'FNR_DNR';
      case 'orgnr':
        return landkode === 'NOR' ? 'ORGNR' : 'UTL_ORGNR';
      default:
        return undefined;
    }
  }
};

type IdentType = 'FNR_DNR' | 'ORGNR' | 'UTL_ORGNR';
