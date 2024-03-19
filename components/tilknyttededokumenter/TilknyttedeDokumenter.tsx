import { BodyShort, List } from '@navikt/ds-react';

interface Props {
  dokumenter?: string[];
}

export const TilknyttedeDokumenter = ({ dokumenter }: Props) => {
  return (
    <List as={'ul'} title={'Tilknyttede dokumenter'} size={'small'}>
      {dokumenter && dokumenter.length > 0 ? (
        dokumenter?.map((dokument) => <List.Item key={dokument}>{dokument}</List.Item>)
      ) : (
        <BodyShort as={'p'} size={'small'}>
          Ingen dokumenter er valgt
        </BodyShort>
      )}
    </List>
  );
};
