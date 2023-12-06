import { PortableTextObject } from '@sanity/types/src/portableText/types';
import { JSONContent } from '@tiptap/core';

export interface PortableText {
  _type: string;
  _key: string;
  children: PortableTextChild[];
  markDefs?: PortableTextObject[];
  listItem?: string;
  style?: PortableTextElement;
  level?: number;
}

export interface PortableTextChild {
  _type: PortableTextLeaf;
  _key: string;
  text: string;
  marks: Array<PortableTextMark>;
}

export function deserialize(innhold?: Array<PortableText>): JSONContent {
  const content = innhold?.map((block) => {
    const content = block.children.map((child) => {
      const marks = child.marks?.map((mark) => {
        return { type: mapPortableTextMarkToTipTapMark(mark) };
      });

      return { type: mapPortableTextLeafToTipTapLeaf(child._type), text: child.text, marks };
    });

    return { type: mapPortableTextElementToTipTapElement(block.style), content };
  });

  return { type: 'doc', content };
}

type PortableTextMark = 'strong' | 'em' | 'underline';
type TipTapMark = 'bold' | 'italic' | 'underline';
function mapPortableTextMarkToTipTapMark(value: PortableTextMark): TipTapMark {
  switch (value) {
    case 'strong':
      return 'bold';
    case 'em':
      return 'italic';
    case 'underline':
      return 'underline';
  }
}

type PortableTextElement = 'normal';
type TipTapElement = 'paragraph' | 'heading';
function mapPortableTextElementToTipTapElement(value?: PortableTextElement): TipTapElement {
  switch (value) {
    case 'normal':
      return 'paragraph';
    default:
      return 'paragraph';
  }
}

type PortableTextLeaf = 'span';
type TipTapLeaf = 'text';
function mapPortableTextLeafToTipTapLeaf(value?: PortableTextLeaf): TipTapLeaf {
  switch (value) {
    case 'span':
      return 'text';
    default:
      return 'text';
  }
}
