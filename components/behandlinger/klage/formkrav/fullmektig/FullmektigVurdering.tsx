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
import styles from './fullmektig.module.css';

interface Props {
  grunnlag?: FullmektigGrunnlag;
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
}

interface FormFields {
  harFullmektig: JaEllerNei;
  idType: 'navnOgAdresse' | 'fnr' | 'orgnr' | 'utl_orgnr';
  orgnr?: string;
  utlOrgnr?: string;
  fnr?: string;
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
        defaultValue: mapIdentToOption(
          grunnlag?.vurdering?.fullmektigIdentMedType?.type,
          grunnlag?.vurdering?.fullmektigNavnOgAdresse != null
        ),
        options: idTypeOptions(),
      },
      fnr: {
        type: 'text',
        label: 'Fnr',
        rules: {
          required: 'Du må skrive fødselsnummer',
          validate: (value: string | undefined) =>
            value?.length !== 11 ? 'Fødselsnummeret må være 11 siffer' : undefined,
        },
        defaultValue: grunnlag?.vurdering?.fullmektigIdent ?? undefined,
      },
      orgnr: {
        type: 'text',
        label: 'Org.nr',
        rules: {
          required: 'Du må skrive Org.nr',
          validate: (value: string | undefined) => (value?.length !== 9 ? 'Org.nr. må være 9 siffer' : undefined),
        },
        defaultValue: grunnlag?.vurdering?.fullmektigIdent ?? undefined,
      },
      utlOrgnr: {
        type: 'text',
        label: 'Org.nr',
        rules: {
          required: 'Du må skrive Org.nr',
        },
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
          validate: {
            utenlandskOrgnr: (value, formValues) => {
              if (value === 'NOR' && formValues.idType === 'utl_orgnr') {
                return 'Kan ikke velge Norge for utenlandsk org.nr';
              }
            },
          },
        },
        options: landMedTrygdesamarbeidInklNorge,
        defaultValue: grunnlag?.vurdering?.fullmektigNavnOgAdresse?.adresse?.landkode ?? undefined,
      },
    },
    { readOnly }
  );

  const [harFullmektig, idType, land] = form.watch(['harFullmektig', 'idType', 'land']);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      const harFullmektig = data.harFullmektig === JaEllerNei.Ja;
      const idType = data.idType;
      const erNorskAdresse = erNorge(data.land);
      const navnOgAdresse =
        harFullmektig && skalFylleInnNavnOgAdresse(idType)
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

      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.FASTSETT_FULLMEKTIG,
          fullmektigVurdering: {
            harFullmektig: harFullmektig,
            fullmektigIdentMedType: harFullmektig ? getIdentAndType(data) : undefined,
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
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
    >
      <FormField form={form} formField={formFields.harFullmektig} horizontalRadio />
      {harFullmektig === JaEllerNei.Ja && <FormField form={form} formField={formFields.idType} horizontalRadio />}
      {harFullmektig === JaEllerNei.Ja && idType === 'fnr' && (
        <FormField form={form} className={styles.orgNrOgFnr} formField={formFields.fnr} />
      )}
      {harFullmektig === JaEllerNei.Ja && idType === 'orgnr' && (
        <FormField form={form} className={styles.orgNrOgFnr} formField={formFields.orgnr} />
      )}
      {harFullmektig === JaEllerNei.Ja && idType === 'utl_orgnr' && (
        <FormField form={form} className={styles.orgNrOgFnr} formField={formFields.utlOrgnr} />
      )}
      {harFullmektig && idType && skalFylleInnNavnOgAdresse(idType) && (
        <>
          <FormField form={form} formField={formFields.land} />
          <FormField form={form} formField={formFields.navn} />
          <FormField form={form} formField={formFields.adresselinje1} />
          <FormField form={form} formField={formFields.adresselinje2} />
          <FormField form={form} formField={formFields.adresselinje3} />
          {idType === 'navnOgAdresse' && erNorge(land) && (
            <>
              <FormField form={form} formField={formFields.postnummer} />
              <FormField form={form} formField={formFields.poststed} />
            </>
          )}
        </>
      )}
    </VilkårsKortMedForm>
  );

  type IndentAndType = {
    ident: string;
    type: IdentType;
  };

  function idTypeOptions(): ValuePair[] {
    return [
      { label: 'Fnr', value: 'fnr' },
      { label: 'Norsk org.nr', value: 'orgnr' },
      { label: 'Utenlandsk org.nr', value: 'utl_orgnr' },
      { label: 'Navn og adresse', value: 'navnOgAdresse' },
    ];
  }

  function getIdentAndType(fields: FormFields): IndentAndType | undefined {
    switch (fields.idType) {
      case 'navnOgAdresse':
        return undefined;
      case 'orgnr':
        return { ident: fields.orgnr!!, type: 'ORGNR' };
      case 'utl_orgnr':
        return { ident: fields.utlOrgnr!!, type: 'UTL_ORG' };
      case 'fnr':
        return { ident: fields.fnr!!, type: 'FNR_DNR' };
    }
  }

  function erNorge(land: string): boolean {
    return land === 'NOR';
  }

  function mapIdentToOption(
    identType: IdentType | undefined | null,
    harAdresse: boolean
  ): 'navnOgAdresse' | 'fnr' | 'orgnr' | 'utl_orgnr' | undefined {
    if (identType === 'FNR_DNR') {
      return 'fnr';
    }
    if (identType === 'UTL_ORG') {
      return 'utl_orgnr';
    }
    if (identType === 'ORGNR') {
      return 'orgnr';
    }
    if (harAdresse) {
      return 'navnOgAdresse';
    }
    return undefined;
  }
};

function skalFylleInnNavnOgAdresse(idType: string): boolean {
  return idType === 'navnOgAdresse' || idType === 'utl_orgnr';
}

type IdentType = 'FNR_DNR' | 'ORGNR' | 'UTL_ORG';
