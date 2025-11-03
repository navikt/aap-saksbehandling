'use client';

import { isAfter, parse } from 'date-fns';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { ErStudentStatus, MellomlagretVurdering, SkalGjenopptaStudieStatus, StudentGrunnlag } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { formaterDatoForBackend, formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { BodyShort, Label } from '@navikt/ds-react';
import { validerDato } from 'lib/validation/dateValidation';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

interface Props {
  behandlingVersjon: number;
  grunnlag?: StudentGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  begrunnelse: string;
  harAvbruttStudie: string;
  godkjentStudieAvLånekassen?: string;
  avbruttPgaSykdomEllerSkade?: string;
  harBehovForBehandling?: string;
  avbruttDato?: string;
  avbruddMerEnn6Måneder?: string;
}

type DraftFormFields = Partial<FormFields>;

export const Studentvurdering = ({ behandlingVersjon, grunnlag, readOnly, initialMellomlagretVurdering }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('AVKLAR_STUDENT');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.AVKLAR_STUDENT_KODE, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'AVKLAR_STUDENT',
    mellomlagretVurdering
  );

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.studentvurdering);

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder §11-14 og vilkårene i §7 i forskriften',
        defaultValue: defaultValues.begrunnelse,
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
      },
      harAvbruttStudie: {
        type: 'radio',
        label: 'Har brukeren avbrutt et studie?',
        options: JaEllerNeiOptions,
        defaultValue: defaultValues.harAvbruttStudie,
        rules: { required: 'Du må svare på om brukeren har avbrutt studie.' },
      },
      godkjentStudieAvLånekassen: {
        type: 'radio',
        label: 'Er studiet godkjent av Lånekassen?',
        options: JaEllerNeiOptions,
        defaultValue: defaultValues.godkjentStudieAvLånekassen,
        rules: { required: 'Du må svare på om studiet er godkjent av Lånekassen.' },
      },
      avbruttPgaSykdomEllerSkade: {
        type: 'radio',
        label: 'Er studie avbrutt pga sykdom eller skade?',
        options: JaEllerNeiOptions,
        defaultValue: defaultValues.avbruttPgaSykdomEllerSkade,
        rules: {
          required: 'Du må svare på om brukeren har avbrutt studie på grunn av sykdom eller skade.',
        },
      },
      harBehovForBehandling: {
        type: 'radio',
        label: 'Har brukeren behov for behandling for å gjenoppta studiet?',
        options: JaEllerNeiOptions,
        defaultValue: defaultValues.harBehovForBehandling,
        rules: { required: 'Du må svare på om brukeren har behov for behandling for å gjenoppta studiet.' },
      },
      avbruttDato: {
        type: 'date_input',
        label: 'Når ble studieevnen 100% nedsatt / når ble studiet avbrutt?',
        defaultValue: defaultValues.avbruttDato,
        rules: {
          required: 'Du må svare på når studieevnen ble 100% nedsatt, eller når studiet ble avbrutt.',
          validate: (value) => {
            const valideringsresultat = validerDato(value as string);
            if (valideringsresultat) {
              return valideringsresultat;
            }

            const inputDato = parseDatoFraDatePicker(value);
            if (inputDato) {
              return isAfter(inputDato, new Date())
                ? 'Dato for når stuideevnen ble 100% nedsatt / avbrutt kan ikke være frem i tid.'
                : true;
            }
          },
        },
      },
      avbruddMerEnn6Måneder: {
        type: 'radio',
        label: 'Er det forventet at brukeren kan gjenoppta studiet innen 6 måneder?',
        options: JaEllerNeiOptions,
        defaultValue: defaultValues.avbruddMerEnn6Måneder,
        rules: { required: 'Du må svare på om avbruddet er forventet å vare i mer enn 6 måneder.' },
      },
    },
    { readOnly: formReadOnly, shouldUnregister: true }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(
      (data) => {
        løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_STUDENT_KODE,
            studentvurdering: {
              begrunnelse: data.begrunnelse,
              harAvbruttStudie: data.harAvbruttStudie === JaEllerNei.Ja,
              avbruttStudieDato:
                data.avbruttDato && formaterDatoForBackend(parse(data.avbruttDato, 'dd.MM.yyyy', new Date())),
              harBehovForBehandling: data.harBehovForBehandling
                ? data.harBehovForBehandling === JaEllerNei.Ja
                : undefined,
              avbruddMerEnn6Måneder: data.avbruddMerEnn6Måneder
                ? data.avbruddMerEnn6Måneder === JaEllerNei.Ja
                : undefined,
              avbruttPgaSykdomEllerSkade: data.avbruttPgaSykdomEllerSkade
                ? data.avbruttPgaSykdomEllerSkade === JaEllerNei.Ja
                : undefined,
              godkjentStudieAvLånekassen: data.godkjentStudieAvLånekassen
                ? data.godkjentStudieAvLånekassen === JaEllerNei.Ja
                : undefined,
            },
          },
          referanse: behandlingsReferanse,
        });
      },
      () => nullstillMellomlagretVurdering()
    )(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'§ 11-14 Student'}
      steg={'AVKLAR_STUDENT'}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!formReadOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag?.studentvurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(
            grunnlag?.studentvurdering
              ? mapVurderingToDraftFormFields(grunnlag.studentvurdering)
              : emptyDraftFormFields()
          );
        });
      }}
      readOnly={formReadOnly}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Label size={'small'}>Relevant informasjon fra søknaden</Label>
        {grunnlag?.oppgittStudent?.erStudentStatus && (
          <BodyShort size={'small'}>
            Er brukeren student: {mapErStudentStatusTilString(grunnlag.oppgittStudent.erStudentStatus)}
          </BodyShort>
        )}
        {grunnlag?.oppgittStudent?.skalGjenopptaStudieStatus &&
          grunnlag?.oppgittStudent?.skalGjenopptaStudieStatus !== 'IKKE_OPPGITT' && (
            <BodyShort size={'small'}>
              Planlegger å gjenoppta studie:{' '}
              {mapSkalGjenopptaStudieStatus(grunnlag.oppgittStudent.skalGjenopptaStudieStatus)}
            </BodyShort>
          )}
      </div>
      <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
      <FormField form={form} formField={formFields.harAvbruttStudie} horizontalRadio />
      {form.watch('harAvbruttStudie') === JaEllerNei.Ja && (
        <FormField form={form} formField={formFields.godkjentStudieAvLånekassen} horizontalRadio />
      )}
      {form.watch('godkjentStudieAvLånekassen') === JaEllerNei.Ja && (
        <FormField form={form} formField={formFields.avbruttPgaSykdomEllerSkade} horizontalRadio />
      )}
      {form.watch('avbruttPgaSykdomEllerSkade') === JaEllerNei.Ja && (
        <FormField form={form} formField={formFields.harBehovForBehandling} horizontalRadio />
      )}
      {form.watch('harBehovForBehandling') === JaEllerNei.Ja && (
        <FormField form={form} formField={formFields.avbruddMerEnn6Måneder} horizontalRadio />
      )}
      {form.watch('avbruddMerEnn6Måneder') === JaEllerNei.Ja && (
        <FormField form={form} formField={formFields.avbruttDato} />
      )}
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapErStudentStatusTilString(status: ErStudentStatus): string {
  switch (status) {
    case 'JA':
      return 'Ja, helt eller delvis';
    case 'AVBRUTT':
      return 'Ja, men har avbrutt studiet helt på grunn av sykdom';
    case 'NEI':
      return 'Nei';
  }
  return '';
}

function mapSkalGjenopptaStudieStatus(status: SkalGjenopptaStudieStatus): string | undefined {
  switch (status) {
    case 'JA':
      return 'Ja';
    case 'VET_IKKE':
      return 'Brukeren vet ikke';
    case 'NEI':
      return 'Nei';
  }
}

function mapVurderingToDraftFormFields(vurdering: StudentGrunnlag['studentvurdering']): DraftFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse,
    harAvbruttStudie: getJaNeiEllerUndefined(vurdering?.harAvbruttStudie),
    godkjentStudieAvLånekassen: getJaNeiEllerUndefined(vurdering?.godkjentStudieAvLånekassen),
    avbruttPgaSykdomEllerSkade: getJaNeiEllerUndefined(vurdering?.avbruttPgaSykdomEllerSkade),
    harBehovForBehandling: getJaNeiEllerUndefined(vurdering?.harBehovForBehandling),
    avbruddMerEnn6Måneder: getJaNeiEllerUndefined(vurdering?.avbruddMerEnn6Måneder),
    avbruttDato: vurdering?.avbruttStudieDato ? formaterDatoForFrontend(vurdering.avbruttStudieDato) : undefined,
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    avbruddMerEnn6Måneder: '',
    avbruttDato: '',
    avbruttPgaSykdomEllerSkade: '',
    godkjentStudieAvLånekassen: '',
    harAvbruttStudie: '',
    harBehovForBehandling: '',
  };
}
