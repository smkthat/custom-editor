import { BulletList, ListItem } from '@tiptap/extension-list';
import type { Editor } from '@tiptap/core';

import customMessages from '../i18n/custom-messages';
import { defineTool } from '../lib';

export default defineTool({
  key: 'bulletList',
  name: customMessages.tools.bullet_list,
  icon: 'format_list_bulleted',
  extension: [BulletList, ListItem],
  shortcut: ['meta', 'shift', '8'],
  action: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().toggleBulletList().run(),
  active: (editor: Editor) => editor.isActive('bulletList'),
});
