'use client';

import { isAfter } from 'date-fns';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Form } from 'components/form/Form';
import { BooksIcon } from '@navikt/aksel-icons';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { getHeaderForSteg, mapStegTypeTilDetaljertSteg } from 'lib/utils/steg';
import { ErStudentStatus, SkalGjenopptaStudieStatus, StudentGrunnlag } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { formaterDatoForBackend, formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { BodyShort, Label } from '@navikt/ds-react';
import { validerDato } from 'lib/validation/dateValidation';

interface Props {
  behandlingVersjon: number;
  grunnlag?: StudentGrunnlag;
  readOnly: boolean;
}

interface FormFields {
  begrunnelse: string;
  harAvbruttStudie: string;
  godkjentStudieAvLånekassen: string;
  avbruttPgaSykdomEllerSkade: string;
  harBehovForBehandling: string;
  avbruttDato: Date;
  avbruddMerEnn6Måneder: string;
}

export const Studentvurdering = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('AVKLAR_STUDENT');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        description: 'Begrunn vurderingen',
        label: 'Vurder §11-14 og vilkårene i §7 i forskriften',
        defaultValue: grunnlag?.studentvurdering?.begrunnelse,
        rules: { required: 'Du må begrunne vurderingen.' },
      },
      harAvbruttStudie: {
        type: 'radio',
        label: 'Har søker avbrutt et studie?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.studentvurdering?.harAvbruttStudie),
        rules: { required: 'Du må svare på om søker har avbrutt studie.' },
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
          required: 'Du må svare på om søker har avbrutt studie på grunn av sykdom eller skade.',
        },
      },
      harBehovForBehandling: {
        type: 'radio',
        label: 'Har bruker behov for behandling for å gjenoppta studiet?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.studentvurdering?.harBehovForBehandling),
        rules: { required: 'Du må svare på om søker har behov for behandling for å gjenoppta studiet.' },
      },
      avbruttDato: {
        type: 'date_input',
        label: 'Når ble studieevnen 100% nedsatt / når ble studiet avbrutt?',
        defaultValue:
          grunnlag?.studentvurdering?.avbruttStudieDato &&
          formaterDatoForFrontend(grunnlag.studentvurdering.avbruttStudieDato),
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
        label: 'Er det forventet at søker kan gjenoppta studiet innen 6 måneder?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag?.studentvurdering?.avbruddMerEnn6Måneder),
        rules: { required: 'Du må svare på om avbruddet er forventet å vare i mer enn 6 måneder.' },
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_STUDENT_KODE,
          studentvurdering: {
            begrunnelse: data.begrunnelse,
            avbruttStudieDato: formaterDatoForBackend(data.avbruttDato),
            harAvbruttStudie: data.harAvbruttStudie === JaEllerNei.Ja,
            harBehovForBehandling: data.harBehovForBehandling === JaEllerNei.Ja,
            avbruddMerEnn6Måneder: data.avbruddMerEnn6Måneder === JaEllerNei.Ja,
            avbruttPgaSykdomEllerSkade: data.avbruttPgaSykdomEllerSkade === JaEllerNei.Ja,
            godkjentStudieAvLånekassen: data.godkjentStudieAvLånekassen === JaEllerNei.Ja,
            dokumenterBruktIVurdering: [],
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort
      heading={getHeaderForSteg(mapStegTypeTilDetaljertSteg('AVKLAR_STUDENT'))}
      steg={'AVKLAR_STUDENT'}
      icon={<BooksIcon fontSize={'inherit'} />}
    >
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'AVKLAR_STUDENT'}
        visBekreftKnapp={!readOnly}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Label size={'small'}>Relevant informasjon fra søknaden</Label>
          {grunnlag?.oppgittStudent?.erStudentStatus && (
            <BodyShort size={'small'}>
              Er søker student: {mapErStudentStatusTilString(grunnlag.oppgittStudent.erStudentStatus)}
            </BodyShort>
          )}
          {grunnlag?.oppgittStudent?.skalGjenopptaStudieStatus && (
            <BodyShort size={'small'}>
              Planlegger å gjenoppta studie:{' '}
              {mapSkalGjenopptaStudieStatus(grunnlag.oppgittStudent.skalGjenopptaStudieStatus)}
            </BodyShort>
          )}
        </div>

        <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
        <FormField form={form} formField={formFields.harAvbruttStudie} horizontalRadio />
        <FormField form={form} formField={formFields.godkjentStudieAvLånekassen} horizontalRadio />
        <FormField form={form} formField={formFields.avbruttPgaSykdomEllerSkade} horizontalRadio />
        <FormField form={form} formField={formFields.harBehovForBehandling} horizontalRadio />
        <FormField form={form} formField={formFields.avbruddMerEnn6Måneder} horizontalRadio />
        <FormField form={form} formField={formFields.avbruttDato} />
      </Form>
    </VilkårsKort>
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
