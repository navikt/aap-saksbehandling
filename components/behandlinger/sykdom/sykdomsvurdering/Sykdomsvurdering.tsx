'use client';

import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { Form } from 'components/form/Form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { VitalsIcon } from '@navikt/aksel-icons';
import { RegistrertBehandler } from 'components/registrertbehandler/RegistrertBehandler';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { SykdomProps } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { validerDato } from 'lib/validation/dateValidation';
import { formaterDatoForBackend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import { Link } from '@navikt/ds-react';

interface FormFields {
  harSkadeSykdomEllerLyte: string;
  erArbeidsevnenNedsatt: string;
  erSkadeSykdomEllerLyteVesentligdel: string;
  erNedsettelseIArbeidsevneHøyereEnnNedreGrense: string;
  begrunnelse: string;
  nedsattArbeidsevneDato: string;
}

export const Sykdomsvurdering = ({ grunnlag, behandlingVersjon, readOnly }: SykdomProps) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('AVKLAR_SYKDOM');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder den nedsatte arbeidsevnen',
        description: 'Hvilken sykdom / skade / lyte. Hva er det mest vesentlige?',
        defaultValue: grunnlag?.sykdomsvurdering?.begrunnelse,
        rules: { required: 'Du må begrunne' },
      },
      harSkadeSykdomEllerLyte: {
        type: 'radio',
        label: 'Har innbygger sykdom, skade eller lyte?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.sykdomsvurdering?.harSkadeSykdomEllerLyte),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om innbygger har sykdom, skade eller lyte' },
      },
      erArbeidsevnenNedsatt: {
        type: 'radio',
        label: 'Har innbygger nedsatt arbeidsevne?',
        defaultValue: getJaNeiEllerUndefined(grunnlag.sykdomsvurdering?.erArbeidsevnenNedsatt),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om innbygger har nedsatt arbeidsevne' },
      },
      erNedsettelseIArbeidsevneHøyereEnnNedreGrense: {
        type: 'radio',
        label: grunnlag.skalVurdereYrkesskade
          ? 'Er arbeidsevnen nedsatt med minst 30%?'
          : 'Er arbeidsevnen nedsatt med minst 50%?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.sykdomsvurdering?.erNedsettelseIArbeidsevneHøyereEnnNedreGrense),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om arbeidsevnen er nedsatt med minst 50%' },
      },
      erSkadeSykdomEllerLyteVesentligdel: {
        type: 'radio',
        label: 'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.sykdomsvurdering?.erSkadeSykdomEllerLyteVesentligdel),
        options: JaEllerNeiOptions,
        rules: {
          required: 'Du må svare på om sykdom, skade eller lyte er vesentlig medvirkende til nedsatt arbeidsevne',
        },
      },
      nedsattArbeidsevneDato: {
        type: 'date_input',
        label: 'Fra hvilken dato ble arbeidsevnen nedsatt? (§11-5)',
        description: 'Datoformat dd.mm.åååå',
        defaultValue: grunnlag?.sykdomsvurdering?.nedsattArbeidsevneDato
          ? formaterDatoForVisning(grunnlag?.sykdomsvurdering?.nedsattArbeidsevneDato)
          : undefined,
        rules: {
          required: 'Du må sette en dato for når arbeidsevnen ble nedsatt',
          validate: (value) => validerDato(value as string),
        },
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_SYKDOM_KODE,
          sykdomsvurdering: {
            erArbeidsevnenNedsatt: data.erArbeidsevnenNedsatt === JaEllerNei.Ja,
            begrunnelse: data.begrunnelse,
            dokumenterBruktIVurdering: [],
            harSkadeSykdomEllerLyte: data.harSkadeSykdomEllerLyte === JaEllerNei.Ja,
            erSkadeSykdomEllerLyteVesentligdel: data.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Ja,
            nedreGrense: 'FEMTI',
            erNedsettelseIArbeidsevneHøyereEnnNedreGrense:
              data.erNedsettelseIArbeidsevneHøyereEnnNedreGrense === JaEllerNei.Ja,
            nedsattArbeidsevneDato:
              data.nedsattArbeidsevneDato &&
              formaterDatoForBackend(parse(data.nedsattArbeidsevneDato, 'dd.MM.yyyy', new Date())),
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  const visFeltForNårArbeidsevnenBleNedsatt =
    form.watch('harSkadeSykdomEllerLyte') === JaEllerNei.Ja &&
    form.watch('erArbeidsevnenNedsatt') === JaEllerNei.Ja &&
    form.watch('erNedsettelseIArbeidsevneHøyereEnnNedreGrense') === JaEllerNei.Ja &&
    form.watch('erSkadeSykdomEllerLyteVesentligdel') === JaEllerNei.Ja;

  return (
    <VilkårsKort
      heading={'Nedsatt arbeidsevne - § 11-5'}
      steg="AVKLAR_SYKDOM"
      icon={<VitalsIcon />}
      vilkårTilhørerNavKontor={true}
    >
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'AVKLAR_SYKDOM'}
        visBekreftKnapp={!readOnly}
      >
        <RegistrertBehandler />
        <Veiledning
          tekst={
            <div>
              Folketrygdloven § 11-5 består av fire vilkår som du må ta stilling til og som alle må være oppfylt for at
              § 11-5 skal være oppfylt. Det vil si at hvis du svarer nei på ett av spørsmålene under, vil ikke vilkåret
              være oppfylt.
              <Link href="https://lovdata.no/pro/lov/1997-02-28-19/%C2%A711-5" target="_blank">
                Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-5
              </Link>
              <span> </span>
              <Link href="https://lovdata.no" target="_blank">
                (lovdata.no)
              </Link>
            </div>
          }
        />
        <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
        <TilknyttedeDokumenter dokumenter={[]} />
        <FormField form={form} formField={formFields.harSkadeSykdomEllerLyte} horizontalRadio />
        {form.watch('harSkadeSykdomEllerLyte') === JaEllerNei.Ja && (
          <>
            <FormField form={form} formField={formFields.erArbeidsevnenNedsatt} horizontalRadio />
            <FormField
              form={form}
              formField={formFields.erNedsettelseIArbeidsevneHøyereEnnNedreGrense}
              horizontalRadio
            />
            <FormField form={form} formField={formFields.erSkadeSykdomEllerLyteVesentligdel} horizontalRadio />
          </>
        )}
        {visFeltForNårArbeidsevnenBleNedsatt && <FormField form={form} formField={formFields.nedsattArbeidsevneDato} />}
      </Form>
    </VilkårsKort>
  );
};
