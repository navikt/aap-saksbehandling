import { StønadsperiodeVurdering } from 'lib/types/types';
import type { AkselColorRole } from '@navikt/ds-tokens/types';
import { BodyShort, Tag } from '@navikt/ds-react';

type KravType = StønadsperiodeVurdering['relevantKravType']['type'];

interface Props {
  type: KravType;
}

export const KravTag = ({ type }: Props) => {
  const [farge, tekst] = ((): [AkselColorRole, string] => {
    switch (type) {
      case 'AVSLAG':
        return ['danger', 'Avslag § 12'];
      case 'GJENINNTREDEN_ETTER_OPPHØR':
        return ['info', 'Gjeninntreden etter opphør'];
      case 'GJENOPPTAK_ETTER_STANS':
        return ['meta-purple', 'Gjenopptak etter stans'];
      case 'NY_STØNADSPERIODE':
        return ['success', 'Krav om ny stønadsperiode'];
      case 'MIGRERT_STØNADSPERIODE':
        return ['success', 'Migrert stønadsperiode'];
    }
  })();

  return (
    <Tag size="xsmall" variant={'strong'} data-color={farge}>
      <BodyShort size={'small'}>{tekst}</BodyShort>
    </Tag>
  );
};
