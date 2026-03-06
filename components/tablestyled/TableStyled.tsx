'use client';

import { Table, TableProps } from '@navikt/ds-react';
import styles from 'components/tablestyled/TableStyled.module.css';

interface Props extends TableProps {
  tablelayout?: 'FIXED';
}

export const TableStyled = (props: Props) => {
  return (
    <Table
      className={`${styles.styledTabell} ${props.tablelayout === 'FIXED' && styles.fixed} ${props.className}`}
      {...props}
    >
      {props.children}
    </Table>
  );
};
