import { PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack, Table } from '@navikt/ds-react';
import { SamordnetYtelse } from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';

interface Props {
  rad: SamordnetYtelse;
  ytelseLabel: string;
  readOnly: boolean;
  onRediger: () => void;
  onSlett: () => void;
}

export const FerieISykepengeperiodeRad = ({ rad, ytelseLabel, readOnly, onRediger, onSlett }: Props) => (
  <Table.Row>
    <Table.DataCell>
      {rad.periode.fom} - {rad.periode.tom}
    </Table.DataCell>
    <Table.DataCell>{ytelseLabel}</Table.DataCell>
    <Table.DataCell></Table.DataCell>
    <Table.DataCell>
      <HStack gap={'space-4'}>
        <Button
          size={'small'}
          icon={<PencilIcon title={'Rediger'} />}
          variant={'tertiary'}
          type={'button'}
          onClick={onRediger}
          disabled={readOnly}
        />
        <Button
          size={'small'}
          icon={<TrashIcon title={'Slett'} />}
          variant={'tertiary'}
          type={'button'}
          onClick={onSlett}
          disabled={readOnly}
        />
      </HStack>
    </Table.DataCell>
  </Table.Row>
);
