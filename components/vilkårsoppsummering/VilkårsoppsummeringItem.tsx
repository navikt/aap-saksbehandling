import styles from 'components/vilkårsoppsummering/Vilkårsoppsummering.module.css';
import { Accordion } from '@navikt/ds-react';
import { FlytGruppe } from 'lib/types/types';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { mapGruppeTypeToGruppeNavn } from 'components/gruppeelement/GruppeElement';
import { mapStegTypeTilStegNavn } from 'lib/utils/steg';
import { gruppeStegErOppfylt, stegErOppfylt } from 'components/vilkårsoppsummering/Vilkårsoppsummering';

interface Props {
  gruppeSteg: FlytGruppe;
}
export const VilkårsoppsummeringItem = ({ gruppeSteg }: Props) => {
  return (
    <Accordion.Item>
      <Accordion.Header>
        <div className={styles.title}>
          {gruppeStegErOppfylt(gruppeSteg) ? (
            <CheckmarkCircleFillIcon title="gruppesteg-oppfylt" className={styles.oppfyltIcon} />
          ) : (
            <XMarkOctagonFillIcon title={'gruppesteg-avslått'} className={styles.avslåttIcon} />
          )}
          {mapGruppeTypeToGruppeNavn(gruppeSteg.stegGruppe)}
        </div>
      </Accordion.Header>
      <Accordion.Content>
        {gruppeSteg.steg.map((steg) => (
          <div key={steg.stegType} className={styles.title}>
            {stegErOppfylt(steg) ? (
              <CheckmarkCircleFillIcon title="steg-oppfylt" className={styles.oppfyltIcon} />
            ) : (
              <XMarkOctagonFillIcon title={'steg-avslått'} className={styles.avslåttIcon} />
            )}
            {mapStegTypeTilStegNavn(steg.stegType)}
          </div>
        ))}
      </Accordion.Content>
    </Accordion.Item>
  );
};
