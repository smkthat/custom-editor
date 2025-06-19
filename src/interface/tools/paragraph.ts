// https://tiptap.dev/api/nodes/paragraph

import type { Editor } from '@tiptap/core';

import customMessages from '../i18n/custom-messages';
import { defineTool } from '../lib';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    paragraph: {
      setParagraph: () => ReturnType;
    };
  }
}

export default defineTool({
  key: 'paragraph',
  name: customMessages.tools.paragraph,
  // Because we want “Paragraph” selectable from the formats menu, we don’t `excludeFromOptions: true`
  // Already imported
  extension: [],
  groups: ['format'],
  shortcut: ['meta', 'alt', '0'],
  action: (editor: Editor) => editor.chain().focus().setParagraph().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().setParagraph().run(),
  active: (editor: Editor) => editor.isActive('paragraph'),
});
