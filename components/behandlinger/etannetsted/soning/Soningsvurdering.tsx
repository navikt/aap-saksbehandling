'use client'

import {VilkårsKort} from 'components/vilkårskort/VilkårsKort';
import {PadlockLockedIcon} from '@navikt/aksel-icons';
import {Alert} from '@navikt/ds-react';
import {Form} from "../../../form/Form";
import {FormEvent} from "react";
import {useConfigForm} from "../../../../hooks/FormHook";
import {useLøsBehovOgGåTilNesteSteg} from "../../../../hooks/LøsBehovOgGåTilNesteStegHook";
import {JaEllerNei, JaEllerNeiOptions} from "../../../../lib/utils/form";
import {FormField} from "../../../input/formfield/FormField";
import {useBehandlingsReferanse} from "../../../../hooks/BehandlingHook";
import {DokumentTabell} from "../../../dokumenttabell/DokumentTabell";
import {TilknyttedeDokumenter} from "../../../tilknyttededokumenter/TilknyttedeDokumenter";
import {InstitusjonsoppholdTabell, InstitusjonsoppholdTypeMock} from "../helseinstitusjon/InstitusjonsoppholdTabell";

const mockData: InstitusjonsoppholdTypeMock[] = [
  {
    institusjonstype: 'Åpent fengsel',
    oppholdstype: 'Casual',
    status: 'Aktivt',
    oppholdFra: new Date().toUTCString(),
    kildeinstitusjon: 'Blackgate Penitentiary',
  },
];


type Props = {
  behandlingVersjon: number;
  readOnly: boolean;
}

interface FormFields {
  dokumenterBruktIVurderingen: string[]
  soningUtenforFengsel: string;
  begrunnelseForSoningUtenforAnstalt: string;
  arbeidUtenforAnstalt: string;
  begrunnelseForArbeidUtenforAnstalt: string;
}

export const Soningsvurdering = ({behandlingVersjon, readOnly}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const {isLoading, status} = useLøsBehovOgGåTilNesteSteg('DU_ER_ET_ANNET_STED');
  const {formFields, form} = useConfigForm<FormFields>({
    dokumenterBruktIVurderingen: {
      type: 'checkbox_nested',
      label: 'Dokumenter funnet som er relevante for vurdering av AAP under straffegjennomføring §11-26',
      description: 'Les dokumentene og tilknytt eventuelt dokumenter til 11-26 vurderingen',
    },

    soningUtenforFengsel: {
      type: "radio",
      label: "Gjennomfører søker straff utenfor fengsel?",
      options: JaEllerNeiOptions,
      rules: {required: "Du må oppgi om søker soner straff i eller utenfor fengsel"}
    },

    begrunnelseForSoningUtenforAnstalt: {
      type: "textarea",
      "label": "Skriv en beskrivelse av hvorfor det er vurdert at søker gjennomfører straff utenfor fengsel",
      rules: {required: "En begrunnelse for soning utenfor fengsel må oppgis"}
    },

    arbeidUtenforAnstalt: {
      type: "radio",
      label: "Har søkerarbeid utenfor anstalten?",
      options: JaEllerNeiOptions,
      rules: {required: "Spørsmål må besvares"}
    },

    begrunnelseForArbeidUtenforAnstalt: {
      type: "textarea",
      label: "Skriv en beskrivelse av hvorfor det er vurdert at søker har arbeid utenforanstalt?",
      rules: { required: "Beskrivelse må fylles ut" }
    }

  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(() => {
      console.log('TODO ' + behandlingVersjon + ':' + behandlingsReferanse);
    })(event);
  };

  return (
    <VilkårsKort heading={'Soning § 11-26'} steg={'DU_ER_ET_ANNET_STED'} icon={<PadlockLockedIcon/>}>

      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={"DU_ER_ET_ANNET_STED"}
        visBekreftKnapp={!readOnly}
      >
        <Alert variant={'warning'}>Vi har fått informasjon om at søker har soningsforhold</Alert>
        <FormField form={form} formField={formFields.dokumenterBruktIVurderingen}>
          <DokumentTabell />
        </FormField>
        <TilknyttedeDokumenter dokumenter={form.watch('dokumenterBruktIVurderingen')} />
        <InstitusjonsoppholdTabell
          label={"Søker har følgende soningsforrhold"}
          beskrivelse={"Under opphold i fengsel har ikke søker rett på AAP. Om man soner utenfor fengsel eller arbeider utenfor anstalt har man likevel rett på AAP"}
          instutisjonsopphold={mockData}
        />

        <FormField form={form} formField={formFields.soningUtenforFengsel}/>
        {form.watch(formFields.soningUtenforFengsel.name) === JaEllerNei.Ja && (
          <FormField form={form} formField={formFields.begrunnelseForSoningUtenforAnstalt}/>
        )}
        {form.watch(formFields.soningUtenforFengsel.name) === JaEllerNei.Nei && (
          <FormField form={form} formField={formFields.arbeidUtenforAnstalt}/>
        )}
        {form.watch(formFields.arbeidUtenforAnstalt.name) === JaEllerNei.Ja && (
          <FormField form={form} formField={formFields.begrunnelseForArbeidUtenforAnstalt} />
        )}

      </Form>

    </VilkårsKort>
  );
};
