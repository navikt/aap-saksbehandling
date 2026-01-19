'use client';

import { Tag } from '@navikt/ds-react';

export type VurderingStatus = 'Oppfylt' | 'Ikke oppfylt' | 'Overskrevet';
interface Props {
  oppfylt: boolean | null | undefined;
  overskrevet?: boolean;
}

export const VurderingStatusTag = ({ oppfylt, overskrevet = false }: Props) => {
  const status = getVurderingStatus(oppfylt, overskrevet);
  if (!status) {
    return null;
  }
  return (
    <Tag size={'xsmall'} variant={getTagVariant(status)}>
      {status}
    </Tag>
  );
};

function getTagVariant(status: VurderingStatus) {
  switch (status) {
    case 'Oppfylt':
      return 'success-moderate';
    case 'Ikke oppfylt':
      return 'error-moderate';
    case 'Overskrevet':
      return 'neutral-moderate';
  }
}
function getVurderingStatus(oppfylt: boolean | undefined | null, strekUtHele: boolean) {
  if (strekUtHele) return 'Overskrevet';
  if (oppfylt != null) {
    return oppfylt ? 'Oppfylt' : 'Ikke oppfylt';
  }
}
