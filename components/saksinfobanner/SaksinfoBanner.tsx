'use client';

import { Button } from '@navikt/ds-react';
import styles from './SaksinfoBanner.module.css';
import { SaksInformasjon } from 'lib/clientApi';
import { SakPersoninfo, SaksInfo as SaksInfoType } from 'lib/types/types';
import { useState } from 'react';
import { SettBehandllingPåVentModal } from 'components/settbehandlingpåventmodal/SettBehandllingPåVentModal';
import { SaksInfo } from 'components/saksinfo/SaksInfo';

interface Props {
  personInformasjon: SakPersoninfo;
  saksInfo: SaksInformasjon;
  sak: SaksInfoType;
  referanse: string;
  behandlingVersjon: number;
}

export const SaksinfoBanner = ({ personInformasjon, saksInfo, sak, behandlingVersjon, referanse }: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className={styles.saksinfoBanner}>
      <SaksInfo saksInfo={saksInfo} sak={sak} personInformasjon={personInformasjon} />
      <Button variant={'secondary'} size={'small'} onClick={() => setModalIsOpen(true)}>
        Sett behandling på vent
      </Button>

      <SettBehandllingPåVentModal
        referanse={referanse}
        behandlingVersjon={behandlingVersjon}
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
    </div>
  );
};
