import { Link, Tag } from '@navikt/ds-react';
import { ExternalLinkIcon, LinkIcon } from '@navikt/aksel-icons';
import { useFeatureFlag } from 'context/UnleashContext';
import { ArenaSakOppsummeringKontrakt } from 'lib/services/apiinternservice/apiInternServiceDTOs';

const arenaVisningsklientBaseUrl = process.env.NEXT_PUBLIC_ARENA_VISNINGSKLIENT_BASE_URL ?? '';

interface Props {
  arenaSak?: ArenaSakOppsummeringKontrakt;
}

export const KantIKantMedArenaStatus = ({ arenaSak }: Props) => {
  const visLenke = useFeatureFlag('ArenasakerLenkeTilVisninsklient');

  const tag = (
    <Tag data-color="meta-purple" icon={<LinkIcon />} variant={'moderate'} size={'small'}>
      Kant i kant med Arena
      {visLenke && arenaSak && <ExternalLinkIcon title="åpnes i ny fane" />}
    </Tag>
  );

  if (!visLenke || !arenaSak) {
    return tag;
  }

  return (
    <Link
      href={`${arenaVisningsklientBaseUrl}sak/${arenaSak.aar}-${arenaSak.lopenummer}`}
      target="_blank"
      underline={false}
    >
      {tag}
    </Link>
  );
};
