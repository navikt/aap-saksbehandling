'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { PadlockLockedIcon } from '@navikt/aksel-icons';
import { Alert } from '@navikt/ds-react';
import { Form } from '../../../form/Form';
import { FormEvent } from 'react';
import { useConfigForm, FormField } from '@navikt/aap-felles-react';
import { useLøsBehovOgGåTilNesteSteg } from '../../../../hooks/LøsBehovOgGåTilNesteStegHook';
import {
  Behovstype,
  getJaNeiEllerUndefined,
  JaEllerNei,
  JaEllerNeiOptions,
  jaNeiEllerUndefinedToNullableBoolean,
} from '../../../../lib/utils/form';
import { DokumentTabell } from '../../../dokumenttabell/DokumentTabell';
import { TilknyttedeDokumenter } from '../../../tilknyttededokumenter/TilknyttedeDokumenter';
import { InstitusjonsoppholdTabell } from '../InstitusjonsoppholdTabell';
import { SoningsgrunnlagResponse } from '../../../../lib/types/types';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  grunnlag: SoningsgrunnlagResponse;
  readOnly: boolean;
}

interface FormFields {
  dokumenterBruktIVurderingen: string[];
  soningUtenforFengsel: JaEllerNei;
  begrunnelseForSoningUtenforAnstalt: string;
  arbeidUtenforAnstalt: JaEllerNei;
  foersteArbeidsdag: Date;
  begrunnelseForArbeidUtenforAnstalt: string;
}

export const Soningsvurdering = ({ behandlingsreferanse, grunnlag, behandlingVersjon, readOnly }: Props) => {
  const soningsvurdering = grunnlag.soningsvurdering;
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('DU_ER_ET_ANNET_STED');
  const { formFields, form } = useConfigForm<FormFields>(
    {
      dokumenterBruktIVurderingen: {
        type: 'checkbox_nested',
        label: 'Dokumenter funnet som er relevante for vurdering av AAP under straffegjennomføring §11-26',
        description: 'Les dokumentene og tilknytt eventuelt dokumenter til 11-26 vurderingen',
      },

      soningUtenforFengsel: {
        type: 'radio',
        defaultValue: getJaNeiEllerUndefined(soningsvurdering?.soningUtenforFengsel),
        label: 'Gjennomfører søker straff utenfor fengsel?',
        options: JaEllerNeiOptions,
        rules: { required: 'Du må oppgi om søker soner straff i eller utenfor fengsel' },
      },

      begrunnelseForSoningUtenforAnstalt: {
        type: 'textarea',
        defaultValue: soningsvurdering?.begrunnelseForSoningUtenforAnstalt ?? undefined,
        label: 'Skriv en beskrivelse av hvorfor det er vurdert at søker gjennomfører straff utenfor fengsel',
        rules: { required: 'En begrunnelse for soning utenfor fengsel må oppgis' },
      },

      arbeidUtenforAnstalt: {
        type: 'radio',
        defaultValue: getJaNeiEllerUndefined(soningsvurdering?.arbeidUtenforAnstalt),
        label: 'Har søkerarbeid utenfor anstalten?',
        options: JaEllerNeiOptions,
        rules: { required: 'Spørsmål må besvares' },
      },
      foersteArbeidsdag: {
        type: 'date',
        defaultValue: undefined, // TODO må inn i DTO
        label: 'Dato for første arbeidsdag',
        rules: { required: 'Dato for første arbeidsdag må registreres' },
      },
      begrunnelseForArbeidUtenforAnstalt: {
        type: 'textarea',
        defaultValue: soningsvurdering?.begrunnelseForArbeidUtenforAnstalt ?? undefined,
        label: 'Skriv en beskrivelse av hvorfor det er vurdert at søker har arbeid utenforanstalt?',
        rules: { required: 'Beskrivelse må fylles ut' },
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_SONINGSFORRHOLD,
          soningsvurdering: {
            dokumenterBruktIVurdering: [],
            soningUtenforFengsel: data.soningUtenforFengsel === JaEllerNei.Ja,
            begrunnelseForSoningUtenforAnstalt: data.begrunnelseForSoningUtenforAnstalt,
            arbeidUtenforAnstalt: jaNeiEllerUndefinedToNullableBoolean(data.arbeidUtenforAnstalt),
            begrunnelseForArbeidUtenforAnstalt: data.begrunnelseForArbeidUtenforAnstalt,
          },
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort heading={'Soning § 11-26'} steg={'DU_ER_ET_ANNET_STED'} icon={<PadlockLockedIcon />}>
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'DU_ER_ET_ANNET_STED'}
        visBekreftKnapp={!readOnly}
      >
        <Alert variant={'warning'}>Vi har fått informasjon om at søker har soningsforhold</Alert>
        <FormField form={form} formField={formFields.dokumenterBruktIVurderingen}>
          <DokumentTabell />
        </FormField>
        <TilknyttedeDokumenter dokumenter={form.watch('dokumenterBruktIVurderingen')} />
        <InstitusjonsoppholdTabell
          label={'Søker har følgende soningsforrhold'}
          beskrivelse={
            'Under opphold i fengsel har ikke søker rett på AAP. Om man soner utenfor fengsel eller arbeider utenfor anstalt har man likevel rett på AAP'
          }
          instutisjonsopphold={grunnlag.soningsopphold}
        />

        <FormField form={form} formField={formFields.soningUtenforFengsel} />
        {form.watch(formFields.soningUtenforFengsel.name) === JaEllerNei.Ja && (
          <FormField form={form} formField={formFields.begrunnelseForSoningUtenforAnstalt} />
        )}
        {form.watch(formFields.soningUtenforFengsel.name) === JaEllerNei.Nei && (
          <FormField form={form} formField={formFields.arbeidUtenforAnstalt} />
        )}
        {form.watch(formFields.arbeidUtenforAnstalt.name) === JaEllerNei.Ja && (
          <>
            <FormField form={form} formField={formFields.foersteArbeidsdag} />
            <FormField form={form} formField={formFields.begrunnelseForArbeidUtenforAnstalt} />
          </>
        )}
      </Form>
    </VilkårsKort>
  );
};
