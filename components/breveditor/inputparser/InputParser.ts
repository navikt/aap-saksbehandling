import { BaseEditor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import { CustomElementType, CustomLeafType } from 'components/breveditor/BrevEditor';

export function withHtml(editor: BaseEditor & ReactEditor) {
  const { insertData } = editor;

  editor.insertData = (data) => {
    const html = data.getData('text/html');
    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const fragment = deserialize(parsed.body);
      console.log('fragment', fragment);

      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
}

function deserialize(htmlElement: HTMLElement | ChildNode): any {
  if (htmlElement.nodeType === 3) {
    const inneholderTekstOgNewLine = new RegExp(/\w+\n\w+/);
    const newlineRegex = new RegExp(/\n/g);
    const kunNewLines = new RegExp(/\n+/);
    if (htmlElement.textContent?.match(inneholderTekstOgNewLine)) {
      return htmlElement.textContent?.replaceAll(newlineRegex, ' ');
    }
    if (htmlElement.textContent?.match(kunNewLines)) {
      return null;
    }
    return htmlElement.textContent;
  } else if (htmlElement.nodeType !== 1) {
    return null;
  } else if (htmlElement.nodeName === 'BR') {
    return '\n';
  }

  const { nodeName } = htmlElement;

  const blockAttributes = getBlockAttributes(nodeName);
  const leafAttributes = getLeafAttributes(nodeName);

  let parent = htmlElement;

  if (nodeName === 'PRE' && htmlElement.childNodes[0] && htmlElement.childNodes[0].nodeName === 'CODE') {
    parent = htmlElement.childNodes[0];
  }

  console.log(parent);

  let children = Array.from(parent.childNodes).map(deserialize).flat();

  console.log('children', children, nodeName, htmlElement.nodeType);

  if (children.length === 0) {
    children = [{ text: '' }];
  }

  if (htmlElement.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  if (blockAttributes) {
    return jsx('element', blockAttributes, children);
  }

  if (leafAttributes) {
    return children.map((child) => jsx('text', leafAttributes, child));
  }

  return children;
}

interface BlockAttribute {
  type: CustomElementType;
}

function getBlockAttributes(nodeName: string): BlockAttribute | undefined {
  switch (nodeName) {
    case 'H1':
      return { type: 'heading-one' };
    case 'H2':
      return { type: 'heading-two' };
    case 'H3':
      return { type: 'heading-three' };
    case 'H4':
      return { type: 'heading-four' };
    case 'P':
      return { type: 'paragraph' };
  }
}

type LeafAttribute = Partial<Record<CustomLeafType, boolean>>;

function getLeafAttributes(nodeName: string): LeafAttribute | undefined {
  switch (nodeName) {
    case 'EM':
      return { italic: true };
    case 'I':
      return { italic: true };
    case 'STRONG':
      return { bold: true };
    case 'B':
      return { bold: true };
    case 'U':
      return { underline: true };
  }
}
