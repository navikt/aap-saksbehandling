import { ReactNode } from 'react';
import { BehandlingLayout } from 'components/behandling/BehandlingLayout';

interface Props {
  children: ReactNode;
  params: Promise<{ saksId: string; behandlingsReferanse: string }>;
}

const Layout = async (props: Props) => {
  const params = await props.params;

  const { children } = props;

  return (
    <BehandlingLayout saksId={params.saksId} behandlingsReferanse={params.behandlingsReferanse}>
      {children}
    </BehandlingLayout>
  );
};

export default Layout;
