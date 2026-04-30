'use client';

import { Alert, BodyShort, Button, Heading, HStack, Label, Radio, Table, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import { HvordanLeggeTilSluttdatoReadMore } from 'components/hvordanleggetilsluttdatoreadmore/HvordanLeggeTilSluttdatoReadMore';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { useFieldArray, UseFormReturn, useWatch } from 'react-hook-form';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { EtableringAvEgenVirksomhetForm } from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhet';
import { JaEllerNei } from 'lib/utils/form';
import {
  EtableringEgenVirksomhetGrunnlagResponse,
  EtableringEierBrukerVirksomheten,
  lagEnumObjektFraUnionType,
} from 'lib/types/types';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { useEffect } from 'react';
import { nyVurderingErOppfylt } from 'components/behandlinger/sykdom/etableringegenvirksomhet/etablering-av-egen-virksomhet-utils';

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
  const utviklingsperioder = useFieldArray({ control: form.control, name: `vurderinger.${index}.utviklingsperioder` });
  const oppstartsperioder = useFieldArray({ control: form.control, name: `vurderinger.${index}.oppstartsperioder` });

  const utviklingperiodeList = useWatch({
    control: form.control,
    name: `vurderinger.${index}.utviklingsperioder`,
  });

  const oppstartsperiodeList = useWatch({
    control: form.control,
    name: `vurderinger.${index}.oppstartsperioder`,
  });

  useEffect(() => {
    form.clearErrors(`vurderinger`);
  }, [utviklingperiodeList, oppstartsperiodeList, form.clearErrors]);

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
        name={`vurderinger.${index}.foreliggerEnNæringsfagligVurdering`}
        control={form.control}
        label={'Foreligger det en næringsfaglig vurdering?'}
        horisontal={true}
        rules={{ required: 'Du må svare på om det foreligger en næringsfaglig vurdering' }}
        readOnly={readOnly}
      />
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
      {nyVurderingErOppfylt(form.watch(`vurderinger.${index}`)) && (
        <VStack gap={'space-16'} paddingBlock={'space-16 space-0'}>
          <Heading level={'2'} size={'small'}>
            Etableringsplan
          </Heading>
          <VStack gap={'space-16'}>
            <VStack>
              <Label size={'small'}>Utviklingsfase</Label>
              <VStack gap={'space-4'}>
                <BodyShort textColor={'subtle'} size={'small'}>
                  Kan gis for inntil 6 måneder
                </BodyShort>
                {grunnlag.bruktUtviklingsDager && grunnlag.bruktUtviklingsDager > 0 ? (
                  <BodyShort
                    textColor={'subtle'}
                    size={'small'}
                  >{`Brukt: ${grunnlag.bruktUtviklingsDager} arbeidsdager`}</BodyShort>
                ) : null}
              </VStack>
            </VStack>
            {form.formState.errors.vurderinger?.[index]?.utviklingsperioder && (
              <Alert variant={'error'}>{form.formState.errors.vurderinger[index].utviklingsperioder.message}</Alert>
            )}
            <VStack gap={'space-16'}>
              <Table size="small">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell scope="col" textSize={'small'}>
                      <BodyShort textColor={'subtle'} size={'small'}>
                        Periode
                      </BodyShort>
                    </Table.HeaderCell>
                    <Table.HeaderCell />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {utviklingsperioder.fields.map(({ id }, i) => {
                    return (
                      <Table.Row key={id}>
                        <Table.DataCell>
                          <HStack gap={'space-8'} align={'center'}>
                            <DateInputWrapper
                              readOnly={readOnly}
                              name={`vurderinger.${index}.utviklingsperioder.${i}.fom`}
                              control={form.control}
                            />
                            {'-'}
                            <DateInputWrapper
                              readOnly={readOnly}
                              name={`vurderinger.${index}.utviklingsperioder.${i}.tom`}
                              control={form.control}
                            />
                          </HStack>
                        </Table.DataCell>
                        <Table.DataCell>
                          <Button
                            disabled={readOnly}
                            size={'small'}
                            variant={'secondary'}
                            type={'button'}
                            icon={<TrashIcon />}
                            onClick={() => utviklingsperioder.remove(i)}
                          />
                        </Table.DataCell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
              <HStack>
                <Button
                  disabled={readOnly}
                  size={'small'}
                  variant={'secondary'}
                  type={'button'}
                  icon={<PlusCircleIcon />}
                  onClick={() => {
                    form.clearErrors();
                    utviklingsperioder.append({ fom: '', tom: '' });
                  }}
                >
                  Legg til ny periode
                </Button>
              </HStack>
            </VStack>
          </VStack>
          <VStack gap={'space-16'}>
            <VStack>
              <Label size={'small'}>Oppstartsfase</Label>
              <VStack gap={'space-4'}>
                <BodyShort textColor={'subtle'} size={'small'}>
                  Kan gis for inntil 3 måneder.
                </BodyShort>
                {grunnlag.bruktOppstartsdager && grunnlag.bruktOppstartsdager > 0 ? (
                  <BodyShort
                    textColor={'subtle'}
                    size={'small'}
                  >{`Brukt: ${grunnlag.bruktOppstartsdager} arbeidsdager`}</BodyShort>
                ) : null}
              </VStack>
            </VStack>
            {form.formState.errors.vurderinger?.[index]?.oppstartsperioder && (
              <Alert variant={'error'}>{form.formState.errors.vurderinger[index].oppstartsperioder.message}</Alert>
            )}
            <VStack gap={'space-16'}>
              <Table size="small">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell scope="col" textSize={'small'}>
                      <BodyShort textColor={'subtle'} size={'small'}>
                        Periode
                      </BodyShort>
                    </Table.HeaderCell>
                    <Table.HeaderCell />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {oppstartsperioder.fields.map(({ id }, i) => {
                    return (
                      <Table.Row key={id}>
                        <Table.DataCell>
                          <HStack gap={'space-8'} align={'center'}>
                            <DateInputWrapper
                              readOnly={readOnly}
                              name={`vurderinger.${index}.oppstartsperioder.${i}.fom`}
                              control={form.control}
                            />
                            {'-'}
                            <DateInputWrapper
                              readOnly={readOnly}
                              name={`vurderinger.${index}.oppstartsperioder.${i}.tom`}
                              control={form.control}
                            />
                          </HStack>
                        </Table.DataCell>
                        <Table.DataCell>
                          <Button
                            disabled={readOnly}
                            size={'small'}
                            variant={'secondary'}
                            type={'button'}
                            icon={<TrashIcon />}
                            onClick={() => oppstartsperioder.remove(i)}
                          />
                        </Table.DataCell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
              <HStack>
                <Button
                  disabled={readOnly}
                  size={'small'}
                  variant={'secondary'}
                  type={'button'}
                  icon={<PlusCircleIcon />}
                  onClick={() => {
                    form.clearErrors();
                    oppstartsperioder.append({ fom: '', tom: '' });
                  }}
                >
                  Legg til ny periode
                </Button>
              </HStack>
            </VStack>
          </VStack>
          <Alert variant={'info'}>
            <VStack>
              <BodyShort>{'Har du husket'}</BodyShort>
              <BodyShort>
                {'- at når AAP under etablering er vedtatt skal det registreres i aktivitetsplanen?'}
              </BodyShort>
              <BodyShort>{'- å opprette en oppfølgingsoppgave før utgangen av neste periode?'}</BodyShort>
            </VStack>
          </Alert>
        </VStack>
      )}
    </VStack>
  );
};
