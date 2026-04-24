'use client';

import { Tag, TagProps } from '@navikt/ds-react';

export enum VurderingStatus {
  Oppfylt = 'Oppfylt',
  IkkeOppfylt = 'Ikke oppfylt',
  Overskrevet = 'Overskrevet',
  Reduksjon = 'Reduksjon',
  IkkeReduksjon = 'Ikke reduksjon',
  VedtaksperiodeAutomatisk = 'Automatisk satt vedtaksperiode',
  VedtaksperiodeManuell = 'Manuell forlengelse',
}

interface Props {
  status?: VurderingStatus | null;
}

export const VurderingStatusTag = ({ status }: Props) => {
  if (!status) {
    return null;
  }

  return (
    <Tag size="xsmall" data-color={getDataColor(status)} variant={getTagVariant(status)}>
      {mapVurderingStatusToVurderingTekst(status)}
    </Tag>
  );
};

function getTagVariant(status: VurderingStatus): TagProps['variant'] {
  switch (status) {
    case VurderingStatus.Oppfylt:
      return 'strong';
    case VurderingStatus.IkkeOppfylt:
      return 'strong';
    case VurderingStatus.Overskrevet:
      return 'strong';
    case VurderingStatus.Reduksjon:
      return 'strong';
    case VurderingStatus.IkkeReduksjon:
      return 'strong';
    case VurderingStatus.VedtaksperiodeAutomatisk:
      return 'strong';
    case VurderingStatus.VedtaksperiodeManuell:
      return 'strong';
  }
}

function getDataColor(status: VurderingStatus): TagProps['data-color'] {
  switch (status) {
    case VurderingStatus.Oppfylt:
      return 'success';
    case VurderingStatus.IkkeOppfylt:
      return 'danger';
    case VurderingStatus.Overskrevet:
      return 'neutral';
    case VurderingStatus.Reduksjon:
      return 'warning';
    case VurderingStatus.IkkeReduksjon:
      return 'success';
    case VurderingStatus.VedtaksperiodeAutomatisk:
      return 'success';
    case VurderingStatus.VedtaksperiodeManuell:
      return 'success';
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
    case VurderingStatus.VedtaksperiodeAutomatisk:
      return 'Automatisk satt vedtaksperiode';
    case VurderingStatus.VedtaksperiodeManuell:
      return 'Manuell forlengelse';
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
