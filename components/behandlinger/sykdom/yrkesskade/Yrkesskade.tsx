'use client';

import { HandBandageIcon } from '@navikt/aksel-icons';
import { Veiledning } from 'components/veiledning/Veiledning';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { CheckboxWrapper } from 'components/input/CheckboxWrapper';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { YrkesskadeVurderingGrunnlag } from 'lib/types/types';
import { Checkbox, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { erProsent } from 'lib/utils/validering';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';

interface Props {
  grunnlag: YrkesskadeVurderingGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  behandlingsReferanse: string;
}

interface FormFields {
  begrunnelse: string;
  erÅrsakssammenheng: string;
  relevanteSaker?: string[];
  andelAvNedsettelsen?: number;
}

export const Yrkesskade = ({ grunnlag, behandlingVersjon, behandlingsReferanse, readOnly }: Props) => {
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('VURDER_YRKESSKADE');
  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder om yrkesskade er medvirkende årsak til nedsatt arbeidsevne',
        defaultValue: grunnlag.yrkesskadeVurdering?.begrunnelse,
        rules: { required: 'Du må begrunne' },
      },
      erÅrsakssammenheng: {
        type: 'radio',
        label: 'Finnes det en årsakssammenheng mellom yrkesskade og nedsatt arbeidsevne?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag.yrkesskadeVurdering?.erÅrsakssammenheng),
        rules: { required: 'Du må svare på om det finnes en årsakssammenheng' },
      },
      relevanteSaker: {
        type: 'checkbox_nested',
        defaultValue: grunnlag.yrkesskadeVurdering?.relevanteSaker,
      },
      andelAvNedsettelsen: {
        type: 'text',
        label: 'Hvor stor andel totalt av nedsatt arbeidsevne skyldes yrkesskadene?',
        defaultValue: grunnlag.yrkesskadeVurdering?.andelAvNedsettelsen?.toString(),
        rules: {
          required: 'Du må svare på hvor stor andel av den nedsatte arbeidsevnen skyldes yrkesskadene',
          validate: (value) => {
            const valueAsNumber = Number(value);
            if (isNaN(valueAsNumber)) {
              return 'Prosent må være et tall';
            } else if (!erProsent(valueAsNumber)) {
              return 'Prosent kan bare være mellom 0 og 100';
            }
          },
        },
      },
    },
    { readOnly }
  );

  return (
    <VilkårsKort
      heading={'Yrkesskade §§ 11-22 1.ledd'}
      steg={'VURDER_YRKESSKADE'}
      vilkårTilhørerNavKontor={false}
      icon={<HandBandageIcon />}
    >
      <Form
        steg={'VURDER_YRKESSKADE'}
        onSubmit={form.handleSubmit((data) => {
          løsBehovOgGåTilNesteSteg({
            behov: {
              behovstype: Behovstype.YRKESSKADE_KODE,
              yrkesskadesvurdering: {
                begrunnelse: data.begrunnelse,
                erÅrsakssammenheng: data.erÅrsakssammenheng === JaEllerNei.Ja,
                andelAvNedsettelsen: data?.andelAvNedsettelsen,
                relevanteSaker: data.relevanteSaker || [],
              },
            },
            behandlingVersjon: behandlingVersjon,
            referanse: behandlingsReferanse,
          });
        })}
        isLoading={isLoading}
        status={status}
        visBekreftKnapp={!readOnly}
      >
        <Veiledning />
        <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
        <FormField form={form} formField={formFields.erÅrsakssammenheng} />
        {form.watch('erÅrsakssammenheng') === JaEllerNei.Ja && (
          <>
            <CheckboxWrapper
              name={'relevanteSaker'}
              control={form.control}
              label={'Tilknytt eventuelle yrkesskader som er helt eller delvis årsak til den nedsatte arbeidsevnen.'}
              readOnly={readOnly}
              rules={{ required: 'Du må velge minst én yrkesskade' }}
            >
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textSize={'small'}>Tilknytt yrkesskade</Table.HeaderCell>
                    <Table.HeaderCell textSize={'small'}>Skadenummer</Table.HeaderCell>
                    <Table.HeaderCell textSize={'small'}>Kilde</Table.HeaderCell>
                    <Table.HeaderCell textSize={'small'}>Skadedato</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                {grunnlag.opplysninger.innhentedeYrkesskader.length > 0 && (
                  <Table.Body>
                    {grunnlag.opplysninger.innhentedeYrkesskader.map((yrkesskade) => (
                      <Table.Row key={yrkesskade.ref}>
                        <Table.DataCell textSize={'small'}>
                          <Checkbox size={'small'} hideLabel value={yrkesskade.ref}>
                            Tilknytt yrkesskade til vurdering
                          </Checkbox>
                        </Table.DataCell>
                        <Table.DataCell textSize={'small'}>{yrkesskade.ref}</Table.DataCell>
                        <Table.DataCell textSize={'small'}>{yrkesskade.kilde}</Table.DataCell>
                        <Table.DataCell textSize={'small'}>
                          {formaterDatoForFrontend(yrkesskade.skadedato)}
                        </Table.DataCell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                )}
              </Table>
            </CheckboxWrapper>
            <FormField form={form} formField={formFields.andelAvNedsettelsen} className={'prosent_input'} />
          </>
        )}
      </Form>
    </VilkårsKort>
  );
};
