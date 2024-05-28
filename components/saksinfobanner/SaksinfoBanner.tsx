'use client';

import { Button, Detail, Label } from '@navikt/ds-react';
import styles from './SaksinfoBanner.module.css';
import { Tag } from 'components/DsClient';
import { PdlInformasjon } from 'lib/services/pdlservice/pdlService';
import { SaksInformasjon } from 'lib/clientApi';
import { SaksInfo } from 'lib/types/types';
import { useState } from 'react';
import { SettBehandllingPåVentModal } from 'components/settbehandlingpåventmodal/SettBehandllingPåVentModal';

interface Props {
  personInformasjon: PdlInformasjon;
  saksInfo: SaksInformasjon;
  sak: SaksInfo;
  referanse: string;
  behandlingVersjon: number;
}

export const SaksinfoBanner = ({ behandlingVersjon, personInformasjon, saksInfo, sak }: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className={styles.saksinfoBanner}>
      <div className={styles.søkerinfo}>
        <div className={styles.ikon} />
        <Label size="small">{personInformasjon.navn}</Label>
        <span aria-hidden>/</span>
        <Detail>{sak?.ident}</Detail>
        {saksInfo.labels.map((label) => (
          <Tag variant="info" size="xsmall" key={label.type}>
            {label.type}
          </Tag>
        ))}
      </div>
      <Button variant={'secondary'} size={'small'} onClick={() => setModalIsOpen(true)}>
        Sett behandling på vent {behandlingVersjon}
      </Button>

      <SettBehandllingPåVentModal
        isOpen={modalIsOpen}
        setIsOpen={setModalIsOpen}
        behandlingVersjon={behandlingVersjon}
      />
    </div>
  );
};
