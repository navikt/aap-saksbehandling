'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { MellomlagretVurdering, YrkesskadeVurderingGrunnlag, YrkesskadeVurderingResponse } from 'lib/types/types';
import { Checkbox, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { erProsent } from 'lib/utils/validering';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { FormEvent } from 'react';

interface Props {
  grunnlag: YrkesskadeVurderingGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  behandlingsReferanse: string;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  begrunnelse: string;
  erÅrsakssammenheng: string;
  relevanteSaker?: string[];
  andelAvNedsettelsen?: number;
}

type DraftFormFields = Partial<FormFields>;

export const Yrkesskade = ({
  grunnlag,
  behandlingVersjon,
  behandlingsReferanse,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_YRKESSKADE');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.YRKESSKADE_KODE, initialMellomlagretVurdering);

  const vurderingerString = grunnlag?.yrkesskadeVurdering;

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(vurderingerString);

  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        defaultValue: defaultValues.begrunnelse,
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
        label: 'Tilknytt eventuelle yrkesskader som er helt eller delvis årsak til den nedsatte arbeidsevnen.',
        defaultValue: grunnlag.yrkesskadeVurdering?.relevanteSaker,
        rules: { required: 'Du må velge minst én yrkesskade' },
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(
      (data) => {
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
      },
      () => nullstillMellomlagretVurdering()
    )(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={'§ 11-22 AAP ved yrkesskade'}
      steg={'VURDER_YRKESSKADE'}
      vilkårTilhørerNavKontor={false}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag.yrkesskadeVurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(
            grunnlag?.yrkesskadeVurdering
              ? mapVurderingToDraftFormFields(grunnlag.yrkesskadeVurdering)
              : emptyDraftFormFields()
          );
        });
      }}
      readOnly={readOnly}
    >
      <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
      <FormField form={form} formField={formFields.erÅrsakssammenheng} horizontalRadio />
      {form.watch('erÅrsakssammenheng') === JaEllerNei.Ja && (
        <>
          <FormField form={form} formField={formFields.relevanteSaker}>
            <TableStyled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textSize={'small'}>Tilknytt yrkesskade</Table.HeaderCell>
                  <Table.HeaderCell textSize={'small'}>Saksnummer</Table.HeaderCell>
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
                      <Table.DataCell textSize={'small'}>{yrkesskade.saksnummer}</Table.DataCell>
                      <Table.DataCell textSize={'small'}>{yrkesskade.kilde}</Table.DataCell>
                      <Table.DataCell textSize={'small'}>
                        {yrkesskade.skadedato ? formaterDatoForFrontend(yrkesskade.skadedato) : 'Ukjent'}
                      </Table.DataCell>
                    </Table.Row>
                  ))}
                </Table.Body>
              )}
            </TableStyled>
          </FormField>
          <FormField form={form} formField={formFields.andelAvNedsettelsen} className={'prosent_input'} />
        </>
      )}
    </VilkårskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(vurdering?: YrkesskadeVurderingResponse): DraftFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse,
    erÅrsakssammenheng: getJaNeiEllerUndefined(vurdering?.erÅrsakssammenheng),
    relevanteSaker: vurdering?.relevanteSaker,
    andelAvNedsettelsen: vurdering?.andelAvNedsettelsen ?? undefined,
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    erÅrsakssammenheng: '',
    relevanteSaker: [],
    andelAvNedsettelsen: undefined,
  };
}
