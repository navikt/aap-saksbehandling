import { Skeleton, VStack } from '@navikt/ds-react';

export const TabellSkeleton = () => {
  return (
    <VStack gap={"space-4"}>
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
