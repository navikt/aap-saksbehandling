import React, { ReactNode } from 'react';
import { InfoCard, InfoCardProps } from '@navikt/ds-react';
import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  InformationSquareFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';

interface Props extends Omit<InfoCardProps, 'data-color'> {
  variant: 'warning' | 'info' | 'error' | 'success';
  children: ReactNode;
  className?: string;
}

export const KelvinAlert = ({ variant, children, size = 'small', className, ...rest }: Props) => {
  switch (variant) {
    case 'success':
      return (
        <InfoCard data-color="success" aria-label={'suksess alert'} size={size} className={className} {...rest}>
          <InfoCard.Message icon={<CheckmarkCircleFillIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );

    case 'warning':
      return (
        <InfoCard data-color="warning" aria-label={'warning alert'} size={size} className={className} {...rest}>
          <InfoCard.Message icon={<ExclamationmarkTriangleFillIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );
    case 'info':
      return (
        <InfoCard data-color="info" aria-label={'info alert'} size={size} className={className} {...rest}>
          <InfoCard.Message icon={<InformationSquareFillIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );
    case 'error':
      return (
        <InfoCard data-color="danger" aria-label={'error alert'} size={size} className={className} {...rest}>
          <InfoCard.Message icon={<XMarkOctagonFillIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );
  }
};
