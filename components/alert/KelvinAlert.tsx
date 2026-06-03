import { ReactNode } from 'react';
import { InfoCard } from '@navikt/ds-react';
import { ExclamationmarkTriangleIcon, InformationSquareIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';

interface Props {
  variant: 'warning' | 'info' | 'error' | 'success';
  children: ReactNode;
  size?: 'small' | 'medium';
}

export const KelvinAlert = ({ variant, children, size = 'small' }: Props) => {
  switch (variant) {
    case 'success':
      return (
        <InfoCard data-color="success" size={size}>
          <InfoCard.Message icon={<ExclamationmarkTriangleIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );

    case 'warning':
      return (
        <InfoCard data-color="warning" size={size}>
          <InfoCard.Message icon={<ExclamationmarkTriangleIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );
    case 'info':
      return (
        <InfoCard data-color="info" size={size}>
          <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );
    case 'error':
      return (
        <InfoCard data-color="danger" size={size}>
          <InfoCard.Message icon={<XMarkOctagonIcon aria-hidden />}>{children}</InfoCard.Message>
        </InfoCard>
      );
  }
};
