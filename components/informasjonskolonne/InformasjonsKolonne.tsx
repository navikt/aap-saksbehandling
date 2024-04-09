'use client';

import { Detail, Heading, Label } from '@navikt/ds-react';
import { StegType } from 'lib/types/types';
import { mapStegTypeTilDetaljertSteg } from 'lib/utils/steg';
import styles from './InformasjonsKolonne.module.css';

interface Props {
  stegSomSkalVises: StegType[];
  className: string;
}

export const InformasjonsKolonne = ({ stegSomSkalVises, className }: Props) => {
  return (
    <div className={className}>
      <div className={styles.infoColumnContainer}>
        <Heading level="2" size="small" spacing>
          Vilkårsvurderinger
        </Heading>
        {stegSomSkalVises.map((steg) => {
          const detaljertSteg = mapStegTypeTilDetaljertSteg(steg);
          return (
            <a href={`#${steg}`} key={steg}>
              <Label as="p">{detaljertSteg.navn}</Label>
              {detaljertSteg.paragraf && <Detail>§ {detaljertSteg.paragraf}</Detail>}
            </a>
          );
        })}
      </div>
    </div>
  );
};
