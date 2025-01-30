import { BodyShort, Label, Link } from '@navikt/ds-react';
import { SakPersoninfo, SaksInfo as SaksInfoType } from 'lib/types/types';
import styles from './SaksInfo.module.css';

interface Props {
  personInformasjon: SakPersoninfo;
  sak: SaksInfoType;
}
export const SaksInfo = ({ personInformasjon, sak }: Props) => {
  return (
    <div className={styles.søkerinfo}>
      <div className={styles.ikon} />
      <Label size="small">
        <Link href={`/sak/${sak.saksnummer}`} title="Tilbake til K-Hub">
          {personInformasjon.navn}
        </Link>
      </Label>
      <span aria-hidden>/</span>
      <BodyShort>{sak?.ident}</BodyShort>
    </div>
  );
};
