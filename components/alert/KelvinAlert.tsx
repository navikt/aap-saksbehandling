import React, { ReactNode } from 'react';
import { InfoCard, InfoCardProps } from '@navikt/ds-react';
import { ExclamationmarkTriangleIcon, InformationSquareIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';

interface Props extends InfoCardProps {
  variant: 'warning' | 'info' | 'error' | 'success';
  children: ReactNode;
  className?: string;
}

export const KelvinAlert = ({ variant, children, size = 'small', className, ...rest }: Props) => {
  switch (variant) {
    case 'success':
      return (
        <InfoCard data-color="success" size={size} className={className} {...rest}>
          <InfoCard.Message icon={<ExclamationmarkTriangleIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );

    case 'warning':
      return (
        <InfoCard data-color="warning" size={size} className={className} {...rest}>
          <InfoCard.Message icon={<ExclamationmarkTriangleIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );
    case 'info':
      return (
        <InfoCard data-color="info" size={size} className={className} {...rest}>
          <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );
    case 'error':
      return (
        <InfoCard data-color="danger" size={size} className={className} {...rest}>
          <InfoCard.Message icon={<XMarkOctagonIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );
  }
};
