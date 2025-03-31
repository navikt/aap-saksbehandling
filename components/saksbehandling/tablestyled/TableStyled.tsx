'use client';

import { Table, TableProps } from '@navikt/ds-react';
import styles from './TableStyled.module.css';

export const TableStyled = (props: TableProps) => {
  return (
    <Table className={`${styles.styledTabell} ${props.className}`} {...props}>
      {props.children}
    </Table>
  );
};
