import { useState } from 'react';
import { BehandlingsHistorikk } from 'lib/types/types';
import { BehandlingsHendelse } from 'components/behandlingshistorikk/BehandlingsHendelse';

interface Props {
  hendelser: BehandlingsHistorikk['hendelser'];
  defaultKollapset: boolean;
}

export const BehandlingsHendelserTidslinje = ({ hendelser, defaultKollapset }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultKollapset);
  function toggleCollapsed() {
    setIsCollapsed(!isCollapsed);
  }
  return (
    <ol style={{ padding: '0' }}>
      {isCollapsed && (
        <>
          <BehandlingsHendelse
            førsteHendelse={true}
            sisteHendelse={false}
            hendelse={hendelser[0]}
            visLinje={hendelser.length > 1}
            medKollapsKnapp={hendelser.length > 1}
            erKollapset={isCollapsed}
            toggleKollaps={toggleCollapsed}
          />
          {hendelser.length > 1 && (
            <BehandlingsHendelse
              førsteHendelse={false}
              sisteHendelse={true}
              hendelse={hendelser[hendelser.length - 1]}
              visLinje={false}
            />
          )}
        </>
      )}
      {!isCollapsed &&
        hendelser.map((hendelse, hendelseIndex) => (
          <BehandlingsHendelse
            key={`hendelse-${hendelseIndex}`}
            førsteHendelse={hendelseIndex === 0}
            sisteHendelse={hendelseIndex === hendelser.length - 1}
            hendelse={hendelse}
            // vis linje mellom hendelser, ikke under siste hendelse
            visLinje={hendelseIndex < hendelser.length - 1}
            // kollapsknapp vises under øverste hendelse, men bare hvis det er mer enn en hendelse
            medKollapsKnapp={hendelseIndex === 0 && hendelser.length > 1}
            erKollapset={isCollapsed}
            toggleKollaps={toggleCollapsed}
          />
        ))}
    </ol>
  );
};
