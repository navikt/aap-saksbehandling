'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { useConfigForm } from 'components/form/FormHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { FormField, ValuePair } from 'components/form/FormField';
import { FullmektigGrunnlag, MellomlagretVurdering, TypeBehandling } from 'lib/types/types';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import styles from './fullmektig.module.css';
import { landMedTrygdesamarbeidInklNorgeAlpha2 } from 'lib/utils/countries';
import { erGyldigFødselsnummer } from 'lib/utils/fnr';
import { erGyldigOrganisasjonsnummer } from 'lib/utils/orgnr';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

interface Props {
  grunnlag?: FullmektigGrunnlag;
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  harFullmektig: string;
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

type DraftFormFields = Partial<FormFields>;

export const FullmektigVurdering = ({ behandlingVersjon, grunnlag, readOnly, initialMellomlagretVurdering }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FULLMEKTIG');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.FASTSETT_FULLMEKTIG, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'FULLMEKTIG',
    mellomlagretVurdering
  );

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag);

  const { formFields, form } = useConfigForm<FormFields>(
    {
      harFullmektig: {
        type: 'radio',
        label: 'Finnes det fullmektig eller verge i klagesaken?',
        rules: { required: 'Du må svare' },
        defaultValue: defaultValue.harFullmektig,
        options: JaEllerNeiOptions,
      },
      idType: {
        type: 'radio',
        label: 'Hvordan skal verge/fullmektig identifiseres?',
        rules: { required: 'Du må velge idtype' },
        defaultValue: defaultValue.idType,
        options: idTypeOptions(),
      },
      fnr: {
        type: 'text',
        label: 'Fødselsnummer',
        rules: {
          required: 'Du må skrive fødselsnummer',
          validate: (value: string | undefined) => {
            if (value?.length !== 11) return 'Fødselsnummeret må være 11 siffer';
            else if (erGyldigFødselsnummer(value)) return undefined;
            else return 'Ugyldig fødselsnummer';
          },
        },
        defaultValue: defaultValue.fnr,
      },
      orgnr: {
        type: 'text',
        label: 'Org.nr',
        rules: {
          required: 'Du må skrive Org.nr',
          validate: (value: string | undefined) => {
            if (value?.length !== 9) return 'Org.nr. må være 9 siffer';
            else if (erGyldigOrganisasjonsnummer(value)) return undefined;
            else return 'Ugyldig organisasjonsnummer';
          },
        },
        defaultValue: defaultValue.orgnr,
      },
      utlOrgnr: {
        type: 'text',
        label: 'Org.nr',
        rules: {
          required: 'Du må skrive Org.nr',
        },
        defaultValue: defaultValue.utlOrgnr,
      },
      navn: {
        type: 'text',
        label: 'Navn på fullmektig/verge',
        rules: { required: 'Du må skrive inn navn' },
        defaultValue: defaultValue.navn,
      },
      adresselinje1: {
        type: 'text',
        label: 'Adresselinje 1',
        rules: { required: 'Du må skrive inn addresselinje 1' },
        defaultValue: defaultValue.adresselinje1,
      },
      adresselinje2: {
        type: 'text',
        label: 'Adresselinje 2 (valgfritt)',
        defaultValue: defaultValue.adresselinje2,
      },
      adresselinje3: {
        type: 'text',
        label: 'Adresselinje 3 (valgfritt)',
        defaultValue: defaultValue.adresselinje3,
      },
      postnummer: {
        type: 'text',
        label: 'Postnummer',
        rules: { required: 'Du må skrive inn postnummer' },
        defaultValue: defaultValue.postnummer,
      },
      poststed: {
        type: 'text',
        label: 'Poststed',
        rules: { required: 'Du må skrive inn poststed' },
        defaultValue: defaultValue.poststed,
      },
      land: {
        type: 'combobox',
        label: 'Land',
        rules: {
          required: 'Du må velge land',
          validate: {
            utenlandskOrgnr: (value, formValues) => {
              if (value === 'NO' && formValues.idType === 'utl_orgnr') {
                return 'Kan ikke velge Norge for utenlandsk org.nr';
              }
            },
          },
        },
        options: landMedTrygdesamarbeidInklNorgeAlpha2,
        defaultValue: defaultValue.land,
      },
    },
    { readOnly: formReadOnly }
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

      løsBehovOgGåTilNesteSteg(
        {
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
        },
        () => {
          nullstillMellomlagretVurdering();
          visningActions.onBekreftClick();
        }
      );
    })(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'Fullmektig/verge'}
      steg={'FULLMEKTIG'}
      onSubmit={handleSubmit}
      vilkårTilhørerNavKontor={false}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() =>
          form.reset(grunnlag?.vurdering ? mapVurderingToDraftFormFields(grunnlag) : emptyDraftFormFields())
        )
      }
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
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
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );

  function mapVurderingToDraftFormFields(grunnlag?: FullmektigGrunnlag): DraftFormFields {
    return {
      harFullmektig: getJaNeiEllerUndefined(grunnlag?.vurdering?.harFullmektig),
      idType: mapIdentToOption(
        grunnlag?.vurdering?.fullmektigIdentMedType?.type,
        grunnlag?.vurdering?.fullmektigNavnOgAdresse != null
      ),
      fnr: grunnlag?.vurdering?.fullmektigIdent ?? undefined,
      orgnr: grunnlag?.vurdering?.fullmektigIdent ?? undefined,
      utlOrgnr: grunnlag?.vurdering?.fullmektigIdent ?? undefined,
      navn: grunnlag?.vurdering?.fullmektigNavnOgAdresse?.navn ?? undefined,
      adresselinje1: grunnlag?.vurdering?.fullmektigNavnOgAdresse?.adresse?.adresselinje1 ?? undefined,
      adresselinje2: grunnlag?.vurdering?.fullmektigNavnOgAdresse?.adresse?.adresselinje2 ?? undefined,
      adresselinje3: grunnlag?.vurdering?.fullmektigNavnOgAdresse?.adresse?.adresselinje3 ?? undefined,
      postnummer: grunnlag?.vurdering?.fullmektigNavnOgAdresse?.adresse?.postnummer ?? undefined,
      poststed: grunnlag?.vurdering?.fullmektigNavnOgAdresse?.adresse?.poststed ?? undefined,
      land: grunnlag?.vurdering?.fullmektigNavnOgAdresse?.adresse?.landkode ?? undefined,
    };
  }

  function emptyDraftFormFields(): DraftFormFields {
    return {
      harFullmektig: '',
    };
  }

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
    return land === 'NO';
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
