import { Skeleton } from '@navikt/ds-react/Skeleton';
import { VStack } from '@navikt/ds-react/Stack';

export const TabellSkeleton = () => {
  return (
    <VStack gap={'space-4'}>
      <Skeleton variant="rectangle" width="100%" height={40} />
      <Skeleton variant="rectangle" width="100%" height={40} />
      <Skeleton variant="rectangle" width="100%" height={40} />
      <Skeleton variant="rectangle" width="100%" height={40} />
      <Skeleton variant="rectangle" width="100%" height={40} />
      <Skeleton variant="rectangle" width="100%" height={40} />
      <Skeleton variant="rectangle" width="100%" height={40} />
    </VStack>
  );
};
