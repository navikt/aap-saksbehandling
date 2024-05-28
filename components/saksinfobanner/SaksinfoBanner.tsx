'use client';

import { Button, Detail, HStack, Label } from '@navikt/ds-react';
import styles from './SaksinfoBanner.module.css';
import { Tag } from 'components/DsClient';
import { PdlInformasjon } from 'lib/services/pdlservice/pdlService';
import { SaksInformasjon } from 'lib/clientApi';
import { SaksInfo } from 'lib/types/types';
import { useState } from 'react';
import { SettBehandllingPåVentModal } from 'components/settbehandlingpåventmodal/SettBehandllingPåVentModal';
import { AktivitetsbruddModal } from 'components/aktivitetsbruddmodal/AktivitetsbruddModal';

interface Props {
  personInformasjon: PdlInformasjon;
  saksInfo: SaksInformasjon;
  sak: SaksInfo;
  referanse: string;
  behandlingVersjon: number;
}

export const SaksinfoBanner = ({ personInformasjon, saksInfo, sak, behandlingVersjon, referanse }: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [aktivitetsbruddModalIsOpen, setAktivitetsbruddModalIsOpen] = useState(false);

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
      <HStack gap={'4'} justify={'end'}>
        <Button variant={'secondary'} size={'small'} onClick={() => setModalIsOpen(true)}>
          Sett behandling på vent
        </Button>
        <Button variant={'secondary'} size={'small'} onClick={() => setAktivitetsbruddModalIsOpen(true)}>
          Aktivitetsplikt
        </Button>
      </HStack>

      <SettBehandllingPåVentModal
        referanse={referanse}
        behandlingVersjon={behandlingVersjon}
        isOpen={modalIsOpen}
        setIsOpen={setModalIsOpen}
      />
      <AktivitetsbruddModal isOpen={aktivitetsbruddModalIsOpen} setIsOpen={setAktivitetsbruddModalIsOpen} />
    </div>
  );
};
