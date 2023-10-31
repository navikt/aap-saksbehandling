'use client';

import { RenderElementProps } from 'slate-react';
import { Heading } from '@navikt/ds-react';

export const Element = (props: RenderElementProps) => {
  if (props.element.type === 'paragraph') {
    return <p>{props.children}</p>;
  }
  if (props.element.type === 'heading-one') {
    return (
      <Heading level={'1'} size={'large'}>
        {props.children}
      </Heading>
    );
  }
  if (props.element.type === 'heading-two') {
    return (
      <Heading level={'2'} size={'medium'}>
        {props.children}
      </Heading>
    );
  }
  if (props.element.type === 'heading-three') {
    return (
      <Heading level={'3'} size={'small'}>
        {props.children}
      </Heading>
    );
  }
  if (props.element.type === 'heading-four') {
    return (
      <Heading level={'4'} size={'xsmall'}>
        {props.children}
      </Heading>
    );
  }
};
