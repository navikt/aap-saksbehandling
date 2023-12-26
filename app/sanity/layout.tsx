import { VisualEditing } from 'components/visualediting/VisualEditing';
import React from 'react';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <VisualEditing />
    </>
  );
};

export default Layout;
