'use client';

import { BodyShort, Button, Heading, HStack, Label, Radio, Table, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import { HvordanLeggeTilSluttdatoReadMore } from 'components/hvordanleggetilsluttdatoreadmore/HvordanLeggeTilSluttdatoReadMore';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { EtableringAvEgenVirksomhetForm } from 'components/behandlinger/sykdom/etableringegenvirksomhet/EtableringAvEgenVirksomhet';
import { JaEllerNei } from 'lib/utils/form';
import { EtableringEierBrukerVirksomheten, lagEnumObjektFraUnionType } from 'lib/types/types';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';

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
export const EtableringAvEgenVirksomhetFormInput = ({ index, form, readOnly }: Props) => {
  const utviklingsperioder = useFieldArray({ control: form.control, name: `vurderinger.${index}.utviklingsperioder` });
  const oppstartsperioder = useFieldArray({ control: form.control, name: `vurderinger.${index}.oppstartsperioder` });
  return (
    <VStack gap={'4'}>
      <Heading level={'2'} size={'medium'}>
        Vilkårsvurdering
      </Heading>
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
        className={'begrunnelse'}
      />
      <RadioGroupJaNei
        name={`vurderinger.${index}.foreliggerEnNæringsfagligVurdering`}
        control={form.control}
        label={'Foreligger det en næringsfaglig vurdering?'}
        horisontal={true}
        rules={{ required: 'Du må svare på om det foreligger en nøringsfaglig vurdering' }}
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
      {form.watch(`vurderinger.${index}.antasDetAtEtableringenFørerTilSelvforsørgelse`) === JaEllerNei.Ja && (
        <>
          <Heading level={'2'} size={'medium'}>
            Etableringsplan
          </Heading>
          <VStack gap={'4'}>
            <VStack>
              <Label size={'small'}>Utviklingsperiode</Label>
              <BodyShort textColor={'subtle'} size={'small'}>
                Kan gis for inntil 6 måneder
              </BodyShort>
            </VStack>
            <VStack gap={'4'}>
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
                          <HStack gap={'2'} align={'center'}>
                            <DateInputWrapper
                              name={`vurderinger.${index}.utviklingsperioder.${i}.fom`}
                              control={form.control}
                            />
                            {'-'}
                            <DateInputWrapper
                              name={`vurderinger.${index}.utviklingsperioder.${i}.tom`}
                              control={form.control}
                            />
                          </HStack>
                        </Table.DataCell>
                        <Table.DataCell>
                          <Button
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
                  size={'small'}
                  variant={'secondary'}
                  type={'button'}
                  icon={<PlusCircleIcon />}
                  onClick={() => utviklingsperioder.append({ fom: '', tom: '' })}
                >
                  Legg til ny periode
                </Button>
              </HStack>
            </VStack>
          </VStack>
          <VStack gap={'4'}>
            <VStack>
              <Label size={'small'}>Oppstartsperiode</Label>
              <BodyShort textColor={'subtle'} size={'small'}>
                Kan gis for inntil 3 måneder
              </BodyShort>
            </VStack>
            <VStack gap={'4'}>
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
                          <HStack gap={'2'} align={'center'}>
                            <DateInputWrapper
                              name={`vurderinger.${index}.oppstartsperioder.${i}.fom`}
                              control={form.control}
                            />
                            {'-'}
                            <DateInputWrapper
                              name={`vurderinger.${index}.oppstartsperioder.${i}.tom`}
                              control={form.control}
                            />
                          </HStack>
                        </Table.DataCell>
                        <Table.DataCell>
                          <Button
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
                  size={'small'}
                  variant={'secondary'}
                  type={'button'}
                  icon={<PlusCircleIcon />}
                  onClick={() => oppstartsperioder.append({ fom: '', tom: '' })}
                >
                  Legg til ny periode
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </>
      )}
    </VStack>
  );
};
