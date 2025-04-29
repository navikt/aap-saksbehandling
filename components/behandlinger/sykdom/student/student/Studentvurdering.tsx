'use client';

import { isAfter, parse } from 'date-fns';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { ErStudentStatus, SkalGjenopptaStudieStatus, StudentGrunnlag } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { formaterDatoForBackend, formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { BodyShort, Label } from '@navikt/ds-react';
import { validerDato } from 'lib/validation/dateValidation';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';

interface Props {
  behandlingVersjon: number;
  grunnlag?: StudentGrunnlag;
  readOnly: boolean;
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

export const Studentvurdering = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, resetStatus, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('AVKLAR_STUDENT');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder §11-14 og vilkårene i §7 i forskriften',
        defaultValue: grunnlag?.studentvurdering?.begrunnelse,
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
      },
      harAvbruttStudie: {
        type: 'radio',
        label: 'Har bruker avbrutt et studie?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.studentvurdering?.harAvbruttStudie),
        rules: { required: 'Du må svare på om bruker har avbrutt studie.' },
      },
      godkjentStudieAvLånekassen: {
        type: 'radio',
        label: 'Er studiet godkjent av Lånekassen?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.studentvurdering?.godkjentStudieAvLånekassen),
        rules: { required: 'Du må svare på om studiet er godkjent av Lånekassen.' },
      },
      avbruttPgaSykdomEllerSkade: {
        type: 'radio',
        label: 'Er studie avbrutt pga sykdom eller skade?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.studentvurdering?.avbruttPgaSykdomEllerSkade),
        rules: {
          required: 'Du må svare på om bruker har avbrutt studie på grunn av sykdom eller skade.',
        },
      },
      harBehovForBehandling: {
        type: 'radio',
        label: 'Har bruker behov for behandling for å gjenoppta studiet?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.studentvurdering?.harBehovForBehandling),
        rules: { required: 'Du må svare på om bruker har behov for behandling for å gjenoppta studiet.' },
      },
      avbruttDato: {
        type: 'date_input',
        label: 'Når ble studieevnen 100% nedsatt / når ble studiet avbrutt?',
        defaultValue: grunnlag?.studentvurdering?.avbruttStudieDato
          ? formaterDatoForFrontend(grunnlag.studentvurdering.avbruttStudieDato)
          : undefined,
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
        label: 'Er det forventet at bruker kan gjenoppta studiet innen 6 måneder?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.studentvurdering?.avbruddMerEnn6Måneder),
        rules: { required: 'Du må svare på om avbruddet er forventet å vare i mer enn 6 måneder.' },
      },
    },
    { readOnly: readOnly, shouldUnregister: true }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
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
    })(event);
  };

  return (
    <VilkårsKortMedForm
      heading={'§ 11-14 Student'}
      steg={'AVKLAR_STUDENT'}
      onSubmit={handleSubmit}
      status={status}
      resetStatus={resetStatus}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      erAktivtSteg={true}
      vilkårTilhørerNavKontor={false}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Label size={'small'}>Relevant informasjon fra søknaden</Label>
        {grunnlag?.oppgittStudent?.erStudentStatus && (
          <BodyShort size={'small'}>
            Er bruker student: {mapErStudentStatusTilString(grunnlag.oppgittStudent.erStudentStatus)}
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
    </VilkårsKortMedForm>
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
