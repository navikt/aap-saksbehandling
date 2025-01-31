'use client';

import { FigureIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { AktivitetspliktHendelse, SaksInfo } from 'lib/types/types';
import { SideProsessKort } from 'components/sideprosesskort/SideProsessKort';
import { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { AktivitetspliktForm } from 'components/aktivitetsplikt/aktivitetspliktform/AktivitetspliktForm';
import { AktivitetspliktHendelser } from 'components/aktivitetsplikt/aktivitetsplikthendelser/AktivitetspliktHendelser';

interface Props {
  aktivitetspliktHendelser: AktivitetspliktHendelse[];
  sak: SaksInfo;
}

export const Aktivitetsplikt = ({ aktivitetspliktHendelser, sak }: Props) => {
  const [skalRegistrereBrudd, setSkalRegistrereBrudd] = useState(false);

  return (
    <>
      <SideProsessKort
        heading={'Registrer fravær eller brudd på aktivitetsplikten'}
        icon={<FigureIcon fontSize={'inherit'} aria-hidden />}
      >
        <div className={'flex-column'}>
          {skalRegistrereBrudd ? (
            <AktivitetspliktForm sak={sak} setSkalRegistrereBrudd={setSkalRegistrereBrudd} />
          ) : (
            <Button onClick={() => setSkalRegistrereBrudd(true)} className={'fit-content'}>
              Registrer fravær eller brudd
            </Button>
          )}
        </div>
      </SideProsessKort>
      <SideProsessKort
        heading="Registrerte brudd på aktivitetsplikten"
        icon={<FigureIcon fontSize={'inherit'} aria-hidden />}
      >
        <AktivitetspliktHendelser
          hendelser={aktivitetspliktHendelser.map((hendelse) => {
            return {
              id: uuidv4(),
              ...hendelse,
            };
          })}
        />
      </SideProsessKort>
    </>
  );
};
