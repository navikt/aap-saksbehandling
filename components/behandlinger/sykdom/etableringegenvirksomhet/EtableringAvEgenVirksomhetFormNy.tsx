'use client';

import { Radio, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { UseFormReturn } from 'react-hook-form';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { EtableringAvEgenVirksomhetForm } from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhetNy';
import { JaEllerNei } from 'lib/utils/form';
import { EtableringEierBrukerVirksomheten, lagEnumObjektFraUnionType } from 'lib/types/types';
import { useEffect } from 'react';
import { nyVurderingErOppfylt } from './etablering-av-egen-virksomhet-utils-ny';
import styles from './EtableringAvEgenVirksomhet.module.css';
import { Alert } from '../../../alert/Alert';

const EierBrukerVirsomheten = lagEnumObjektFraUnionType<NonNullable<EtableringEierBrukerVirksomheten>>({
  EIER_MINST_50_PROSENT: 'EIER_MINST_50_PROSENT',
  EIER_MINST_50_PROSENT_MED_FLER: 'EIER_MINST_50_PROSENT_MED_FLER',
  NEI: 'NEI',
});

type Props = {
  form: UseFormReturn<EtableringAvEgenVirksomhetForm>;
  readOnly: boolean;
  index: number;
};
export const EtableringAvEgenVirksomhetFormInputNy = ({ index, form, readOnly }: Props) => {
  useEffect(() => {
    form.clearErrors(`vurderinger`);
  }, [form]);

  const valgtFase = form.watch(`vurderinger.${index}.fase`);
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
          <Radio description={'Maks varighet: 6 måneder'} value={'UTVIKLING'}>
            Utviklingsfase
          </Radio>
          <Radio description={'Maks varighet: 3 måneder'} value={'OPPSTART'}>
            Oppstartsfase
          </Radio>
        </RadioGroupWrapper>
      )}

      {valgtFase === 'OPPSTART' && (
        <RadioGroupJaNei
          name={`vurderinger.${index}.erRegistrertINødvendigeOffentligeRegister`}
          control={form.control}
          label={'Er det dokumentert at virksomheten er registrert i de nødvendige offentlige registrene?'}
          description={'Enhetsregisteret og merverdiavgiftsregisteret'}
          horisontal={true}
          rules={{ required: 'Du må svare på om virksomheten er registrert i offentlige registre' }}
          readOnly={readOnly}
        />
      )}

      {valgtFase !== undefined && (
        <Alert variant={'warning'} className={styles.maksBredde}>
          {
            'Sluttdatoen settes automatisk basert på maksimal varighet for fasen bedriften er i, minus tiden som allerede er brukt. Ønsker du å sette en tidligere sluttdato, må du velge «Legg til ny vurdering».'
          }
        </Alert>
      )}

      {nyVurderingErOppfylt(form.watch(`vurderinger.${index}`)) && (
        <Alert variant={'info'} className={styles.maksBredde}>
          {
            'Husk å opprette aktivitetskort for den aktuelle etableringsfasen i aktivitetsplanen og fastsett oppfølgingspunkter i dialogen/samtalereferat. Når brukeren går over på ordinær AAP skal du revurdere §§ 11-5 og 11-6'
          }
        </Alert>
      )}
    </VStack>
  );
};

