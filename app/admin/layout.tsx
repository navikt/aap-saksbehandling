import { isDev, isLocal } from 'lib/utils/environment';
import { notFound } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  if (!isLocal() && !isDev()) {
    notFound();
  }

  return <>{children}</>;
};

export default Layout;
