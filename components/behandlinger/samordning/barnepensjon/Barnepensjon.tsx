'use client';

import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { MellomlagretVurdering, Periode } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { useFieldArray } from 'react-hook-form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype } from 'lib/utils/form';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { BodyLong, BodyShort, Button, Label, Table, VStack } from '@navikt/ds-react';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { PlusCircleIcon } from '@navikt/aksel-icons';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface Barnepensjon {
  periode: Periode;
  månedsytelse: string;
}

interface FormFields {
  begrunnelse: string;
  barnepensjon: Barnepensjon[];
}

export const Barnepensjon = ({ readOnly, initialMellomlagretVurdering }: Props) => {
  // TODO Fiks rikitg behovstype backend har opprettet dette
  const { mellomlagretVurdering, lagreMellomlagring, nullstillMellomlagretVurdering, slettMellomlagring } =
    useMellomlagring(Behovstype.AVKLAR_HELSEINSTITUSJON);
  // TODO Fiks rikitg steg når backend har opprettet dette
  const { status, løsBehovOgGåTilNesteStegError, isLoading } = useLøsBehovOgGåTilNesteSteg('BREV');
  // TODO Fiks rikitg steg når backend har opprettet dette
  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'BREV',
    initialMellomlagretVurdering
  );

  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder samordning med barnepensjon',
        rules: { required: 'Du må vurdere samordning med barnepensjon.' },
      },
      barnepensjon: {
        type: 'fieldArray',
      },
    },
    { readOnly: formReadOnly }
  );

  const { fields, remove, append } = useFieldArray({ control: form.control, name: 'barnepensjon' });

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'§ 11-27 Samordning barnepensjon (valgfritt)'}
      steg={'BREV'} // TODO Fiks når steget er lagt inn i backend
      onSubmit={form.handleSubmit((data) => {
        console.log(data);
        nullstillMellomlagretVurdering();
      })}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      visningModus={visningModus}
      visningActions={visningActions}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset())}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      mellomlagretVurdering={mellomlagretVurdering}
      formReset={() => form.reset()}
    >
      <VStack gap={'8'}>
        <FormField form={form} formField={formFields.begrunnelse} />

        <VStack gap={'space-8'}>
          <Label size={'small'}>Legg til periode med samordning av barnepensjon</Label>
          <BodyLong size={'small'}>Legg til perioder med barnepensjon som skal samordnes med AAP.</BodyLong>
          <TableStyled size={'small'}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Ytelse</Table.HeaderCell>
                <Table.HeaderCell>Periode</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell>Månedsytelse</Table.HeaderCell>
                <Table.HeaderCell>Dagsats</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {fields.map((field, index) => {
                return (
                  <Table.Row key={field.id}>
                    <Table.DataCell textSize={'small'}>
                      <BodyShort>Barnepensjon</BodyShort>
                    </Table.DataCell>
                    <Table.DataCell>
                      <div>PLACEHOLDER fom</div>
                    </Table.DataCell>
                    <Table.DataCell>
                      <div>PLACEHOLDER tom</div>
                    </Table.DataCell>
                    <Table.DataCell>
                      <SelectWrapper name={`barnepensjon.${index}.månedsytelse`} control={form.control}>
                        <option value=""></option>
                        <option value="hei">Hei</option>
                        <option value="hå">Hå</option>
                      </SelectWrapper>
                    </Table.DataCell>
                    <Table.DataCell>
                      <div>PLACEHOLDER DAGSATS</div>
                    </Table.DataCell>
                    <Table.DataCell>
                      <Button variant={'tertiary'} onClick={() => remove(index)}>
                        Fjern
                      </Button>
                    </Table.DataCell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </TableStyled>
          <div>
            <Button
              onClick={() =>
                append({
                  periode: { fom: '', tom: '' },
                  månedsytelse: '',
                })
              }
              variant={'tertiary'}
              type={'button'}
              icon={<PlusCircleIcon />}
              size={'small'}
            >
              Legg til
            </Button>
          </div>
        </VStack>
      </VStack>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};
