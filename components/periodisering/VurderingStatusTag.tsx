'use client';

import { Tag, TagProps } from '@navikt/ds-react';

export enum VurderingStatus {
  Oppfylt = 'Oppfylt',
  IkkeOppfylt = 'Ikke oppfylt',
  Overskrevet = 'Overskrevet',
  Reduksjon = 'Reduksjon',
  IkkeReduksjon = 'Ikke reduksjon',
}

interface Props {
  status?: VurderingStatus | null;
}

export const VurderingStatusTag = ({ status }: Props) => {
  if (!status) {
    return null;
  }

  return (
    <Tag size="xsmall" variant={getTagVariant(status)}>
      {mapVurderingStatusToVurderingTekst(status)}
    </Tag>
  );
};

function getTagVariant(status: VurderingStatus): TagProps['variant'] {
  switch (status) {
    case VurderingStatus.Oppfylt:
      return 'success-moderate';
    case VurderingStatus.IkkeOppfylt:
      return 'error-moderate';
    case VurderingStatus.Overskrevet:
      return 'neutral-moderate';
    case VurderingStatus.Reduksjon:
      return 'warning-moderate';
    case VurderingStatus.IkkeReduksjon:
      return 'success-moderate';
  }
}

function mapVurderingStatusToVurderingTekst(status: VurderingStatus): string {
  switch (status) {
    case VurderingStatus.Reduksjon:
      return 'Reduksjon';
    case VurderingStatus.IkkeReduksjon:
      return 'Ikke reduksjon';
    case VurderingStatus.Oppfylt:
      return 'Oppfylt';
    case VurderingStatus.IkkeOppfylt:
      return 'Ikke oppfylt';
    case VurderingStatus.Overskrevet:
      return 'Overskrevet';
  }
}

export function getErReduksjonEllerIkke(
  erReduksjon: boolean
): VurderingStatus.Reduksjon | VurderingStatus.IkkeReduksjon | undefined {
  if (erReduksjon === undefined) {
    return undefined;
  }

  return erReduksjon ? VurderingStatus.Reduksjon : VurderingStatus.IkkeReduksjon;
}

export function getErOppfyltEllerIkkeStatus(
  oppfylt: boolean | undefined
): VurderingStatus.Oppfylt | VurderingStatus.IkkeOppfylt | undefined {
  if (oppfylt === undefined) {
    return undefined;
  }

  return oppfylt ? VurderingStatus.Oppfylt : VurderingStatus.IkkeOppfylt;
}
