'use client';

import { useEffect, useRef } from 'react';

import EditorJS from '@editorjs/editorjs';
// @ts-ignore -- mangler typer
import Header from '@editorjs/header';
// @ts-ignore -- mangler typer
import List from '@editorjs/list';
// @ts-ignore -- mangler typer
import Paragraph from '@editorjs/paragraph';

import styles from './Brevredigerer.module.css';

export const Brevredigerer = () => {
  const editorRef = useRef<EditorJS | null>();
  useEffect(() => {
    const initEditor = () => {
      const editor: EditorJS = new EditorJS({
        holder: 'editorHolder',
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              defaultLevel: 1,
            },
          },
          list: { class: List, inlineToolbar: true, config: { defaultStyle: 'unordered' } },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
        },
        onReady: () => (editorRef.current = editor),
        onChange: async () => {
          const content = await editorRef.current?.save();
          console.log(content);
        },
      });
    };
    if (editorRef.current === null) {
      initEditor();
    }
    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  return (
    <main>
      <h1>Brevskriver</h1>
      <div id={'editorHolder'} className={styles.brevredigerer} />
    </main>
  );
};
