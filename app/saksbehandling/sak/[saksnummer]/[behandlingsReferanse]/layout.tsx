import { ReactNode } from 'react';
import { BehandlingLayout } from 'components/behandling/BehandlingLayout';

interface Props {
  children: ReactNode;
  params: Promise<{ saksnummer: string; behandlingsReferanse: string }>;
}

const Layout = async (props: Props) => {
  const params = await props.params;

  const { children } = props;

  return (
    <BehandlingLayout saksnummer={params.saksnummer} behandlingsReferanse={params.behandlingsReferanse}>
      {children}
    </BehandlingLayout>
  );
};

export default Layout;
