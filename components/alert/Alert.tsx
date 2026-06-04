'use client';

import React, { ReactNode } from 'react';
import { InfoCard, InfoCardProps } from '@navikt/ds-react';
import {
  CheckmarkCircleIcon,
  ExclamationmarkTriangleIcon,
  InformationSquareIcon,
  XMarkOctagonIcon,
} from '@navikt/aksel-icons';

interface Props extends Omit<InfoCardProps, 'data-color'> {
  variant: 'warning' | 'info' | 'error' | 'success';
  children: ReactNode;
}

export const Alert = ({ variant, children, size = 'small', className, ...rest }: Props) => {
  switch (variant) {
    case 'success':
      return (
        <InfoCard data-color="success" aria-label={'success alert'} size={size} className={className} {...rest}>
          <InfoCard.Message icon={<CheckmarkCircleIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );

    case 'warning':
      return (
        <InfoCard data-color="warning" aria-label={'warning alert'} size={size} className={className} {...rest}>
          <InfoCard.Message icon={<ExclamationmarkTriangleIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );
    case 'info':
      return (
        <InfoCard data-color="info" aria-label={'info alert'} size={size} className={className} {...rest}>
          <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );
    case 'error':
      return (
        <InfoCard data-color="danger" aria-label={'error alert'} size={size} className={className} {...rest}>
          <InfoCard.Message icon={<XMarkOctagonIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );
  }
};
