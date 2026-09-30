'use client';

import { BodyShort, InfoCard, Radio, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import { HvordanLeggeTilSluttdatoReadMore } from 'components/hvordanleggetilsluttdatoreadmore/HvordanLeggeTilSluttdatoReadMore';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { UseFormReturn } from 'react-hook-form';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { EtableringAvEgenVirksomhetForm } from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhet';
import { JaEllerNei } from 'lib/utils/form';
import {
  EtableringEgenVirksomhetGrunnlagResponse,
  EtableringEierBrukerVirksomheten,
  lagEnumObjektFraUnionType,
} from 'lib/types/types';
import { useEffect } from 'react';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { addMonths } from 'date-fns';
import { formaterDatoForFrontend, stringToDate } from 'lib/utils/date';

const EierBrukerVirsomheten = lagEnumObjektFraUnionType<NonNullable<EtableringEierBrukerVirksomheten>>({
  EIER_MINST_50_PROSENT: 'EIER_MINST_50_PROSENT',
  EIER_MINST_50_PROSENT_MED_FLER: 'EIER_MINST_50_PROSENT_MED_FLER',
  NEI: 'NEI',
});

type Props = {
  form: UseFormReturn<EtableringAvEgenVirksomhetForm>;
  readOnly: boolean;
  index: number;
  grunnlag: EtableringEgenVirksomhetGrunnlagResponse;
};
export const EtableringAvEgenVirksomhetFormInput = ({ index, form, readOnly, grunnlag }: Props) => {

  useEffect(() => {
    form.clearErrors(`vurderinger`);
  }, [form]);

  const maksVarighetDato = (antMåneder: number, fraDato: string) => {
    const dato = stringToDate(fraDato, 'dd.MM.yyyy');
    dato?.setDate(dato.getDate() - 1);

    let maksDato = dato ? formaterDatoForFrontend(addMonths(dato, antMåneder)) : '';

    // grunnlag.ikkeRelevantePerioder.forEach((periode) => {
    //   const ikkeRelevantTil = stringToDate(periode.tom, 'yyyy-MM-dd');
    //   if (ikkeRelevantTil?.getFullYear() === 2999) {
    //     maksDato = formaterDatoForFrontend(periode.fom);
    //   }
    // });

    return maksDato;
  };

  return (
    <VStack gap={'space-16'}>
      <DateInputWrapper
        name={`vurderinger.${index}.fraDato`}
        label="Vurderingen gjelder fra"
        control={form.control}
        rules={{
          required: 'Vennligst velg en dato for når vurderingen gjelder fra',
          validate: (value) => validerDato(value as string),
        }}
        readOnly={readOnly}
      />
      <HvordanLeggeTilSluttdatoReadMore />
      <TextAreaWrapper
        name={`vurderinger.${index}.begrunnelse`}
        control={form.control}
        label={'Vilkårsvurdering'}
        rules={{
          required: 'Du må gi en begrunnelse for vurderingen',
        }}
        readOnly={readOnly}
      />
      <RadioGroupJaNei
        name={`vurderinger.${index}.jobberBrukerAktivMedVirksomheten`}
        control={form.control}
        label={'Jobber bruker aktivt med å etablere virksomheten?'}
        horisontal={true}
        rules={{ required: 'Du må svare på om bruker jobber aktivt med å etablere virksomheten' }}
        readOnly={readOnly}
      />
      {form.watch(`vurderinger.${index}.jobberBrukerAktivMedVirksomheten`) === JaEllerNei.Ja && (
        <RadioGroupJaNei
          name={`vurderinger.${index}.foreliggerEnNæringsfagligVurdering`}
          control={form.control}
          label={'Foreligger det en næringsfaglig vurdering?'}
          horisontal={true}
          rules={{ required: 'Du må svare på om det foreligger en næringsfaglig vurdering' }}
          readOnly={readOnly}
        />
      )}
      {form.watch(`vurderinger.${index}.foreliggerEnNæringsfagligVurdering`) === JaEllerNei.Ja && (
        <RadioGroupJaNei
          name={`vurderinger.${index}.erVirksomhetenNy`}
          control={form.control}
          label={'Er virksomheten ny?'}
          horisontal={true}
          rules={{ required: 'Du må svare på om virksomheten er ny' }}
          readOnly={readOnly}
        />
      )}
      {form.watch(`vurderinger.${index}.erVirksomhetenNy`) === JaEllerNei.Ja && (
        <RadioGroupWrapper
          name={`vurderinger.${index}.eierBrukerVirksomheten`}
          control={form.control}
          label={'Eier bruker virksomheten?'}
          rules={{ required: 'Du må svare på om bruker eier virksomheten' }}
          readOnly={readOnly}
        >
          <Radio value={EierBrukerVirsomheten.EIER_MINST_50_PROSENT}>Ja, bruker eier minst 50% av virksomheten</Radio>
          <Radio value={EierBrukerVirsomheten.EIER_MINST_50_PROSENT_MED_FLER}>
            Ja, bruker eier minst 50% av virksomheten sammen med andre AAP og/eller dagpengemottakere
          </Radio>
          <Radio value={EierBrukerVirsomheten.NEI}>Nei</Radio>
        </RadioGroupWrapper>
      )}
      {(form.watch(`vurderinger.${index}.eierBrukerVirksomheten`) === EierBrukerVirsomheten.EIER_MINST_50_PROSENT ||
        form.watch(`vurderinger.${index}.eierBrukerVirksomheten`) ===
          EierBrukerVirsomheten.EIER_MINST_50_PROSENT_MED_FLER) && (
        <RadioGroupJaNei
          name={`vurderinger.${index}.antasDetAtEtableringenFørerTilSelvforsørgelse`}
          control={form.control}
          label={'Antas det at etablering av virksomheten vil føre til at bruker blir selvforsørget?'}
          horisontal={true}
          rules={{ required: 'Du må svare på om det antas at etablering vil føre til at bruker blir selvforsørget' }}
          readOnly={readOnly}
        />
      )}

      {form.watch(`vurderinger.${index}.antasDetAtEtableringenFørerTilSelvforsørgelse`) === JaEllerNei.Ja && (
        <RadioGroupWrapper
          name={`vurderinger.${index}.fase`}
          control={form.control}
          label={'Hvilken fase er virksomheten i?'}
          rules={{ required: 'Virksomheten må enten være i utviklings- eller oppstartsfase' }}
          readOnly={readOnly}
        >
          <Radio value={'UTVIKLING'}>Utviklingsfase</Radio>
          <Radio value={'OPPSTART'}>Oppstartsfase</Radio>
        </RadioGroupWrapper>
      )}

      {form.watch(`vurderinger.${index}.fase`) === 'UTVIKLING' && (
        <>
          <BodyShort size={'small'} weight={'semibold'}>
            Maks varighet i utviklingsfasen
          </BodyShort>
          <BodyShort size={'small'}>{maksVarighetDato(6, form.watch(`vurderinger.${index}.fraDato`))}</BodyShort>
        </>
      )}

      {form.watch(`vurderinger.${index}.fase`) === 'OPPSTART' && (
        <RadioGroupJaNei
          name={`vurderinger.${index}.erRegistrertINødvendigeOffentligeRegister`}
          control={form.control}
          label={'Er det dokumentert at virksomheten er registrert i de nødvendige offentlige registrene'}
          horisontal={true}
          rules={{ required: 'Du må svare på om virksomheten er registrert i offentlige registre' }}
          readOnly={readOnly}
        />
      )}

      {form.watch(`vurderinger.${index}.fase`) === 'OPPSTART' && (
        <>
          <BodyShort size={'small'} weight={'semibold'}>
            Maks varighet i oppstartsfasen
          </BodyShort>
          <BodyShort size={'small'}>{maksVarighetDato(3, form.watch(`vurderinger.${index}.fraDato`))}</BodyShort>
        </>
      )}

      <InfoCard data-color="info" aria-label={'info alert'} size={'small'}>
        <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
          <InfoCard.Title>Har du husket: </InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content>
          <VStack>
            <ul>
              <li>{'at når AAP under etablering er vedtatt skal det registreres i aktivitetsplanen?'}</li>
              <li>{'å opprette en oppfølgingsoppgave før utgangen av neste periode?'}</li>
            </ul>
          </VStack>
        </InfoCard.Content>
      </InfoCard>
    </VStack>
  );
};
