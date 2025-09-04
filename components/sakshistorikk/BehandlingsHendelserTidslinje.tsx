import { useState } from 'react';
import { BehandlingsHistorikk } from 'lib/types/types';
import { BehandlingsHendelse } from 'components/sakshistorikk/BehandlingsHendelse';
import { Link, Process } from '@navikt/ds-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

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
    <Process>
      {hendelser.map((hendelse, hendelseIndex) => (
        <>
          {(!isCollapsed || hendelseIndex === 0 || hendelseIndex === hendelser.length - 1) && (
            <BehandlingsHendelse key={`hendelse-${hendelseIndex}`} hendelse={hendelse} />
          )}
          {hendelseIndex === 0 && hendelser.length > 2 && (
            <Process.Event
              key={`hendelse-toggle-${hendelseIndex}`}
              bullet={
                isCollapsed ? (
                  <ChevronDownIcon title="a11y-title" fontSize="1.1rem" />
                ) : (
                  <ChevronUpIcon title="a11y-title" fontSize="1.1rem" />
                )
              }
            >
              <Link
                as={'button'}
                style={{ border: '0', margin: '0', padding: '0', backgroundColor: 'white' }}
                onClick={() => toggleCollapsed && toggleCollapsed()}
              >
                {isCollapsed ? `Se all historikk i behandlingen` : `Skjul all historikk i behandlingen`}
              </Link>
            </Process.Event>
          )}
        </>
      ))}
    </Process>
  );
};
