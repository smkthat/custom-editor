// https://tiptap.dev/api/marks/subscript

import Subscript from '@tiptap/extension-subscript';
import type { Editor } from '@tiptap/core';

import customMessages from '../i18n/custom-messages';
import { defineTool, extendMarkRangeIfUnselected } from '../lib';

export default defineTool({
  key: 'subscript',
  name: customMessages.tools.subscript,
  icon: 'subscript',
  extension: [Subscript],
  shortcut: ['meta', ','],
  action: (editor: Editor) => extendMarkRangeIfUnselected(editor, 'subscript').toggleSubscript().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().toggleSubscript().run(),
  active: (editor: Editor) => editor.isActive('subscript'),
});
