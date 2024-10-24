import { BodyShort, Label, List } from '@navikt/ds-react';

interface Props {
  dokumenter?: string[];
}

export const TilknyttedeDokumenter = ({ dokumenter }: Props) => {
  return (
    <section>
      <Label size={'small'}>Tilknyttede dokumenter</Label>
      <List as={'ul'} size={'small'}>
        {dokumenter && dokumenter.length > 0 ? (
          dokumenter?.map((dokument) => <List.Item key={dokument}>{dokument}</List.Item>)
        ) : (
          <BodyShort as={'p'} size={'small'}>
            Ingen dokumenter er valgt
          </BodyShort>
        )}
      </List>
    </section>
  );
};
