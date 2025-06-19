import { ListItem, OrderedList } from '@tiptap/extension-list';
import type { Editor } from '@tiptap/core';

import customMessages from '../i18n/custom-messages';
import { defineTool } from '../lib';

export default defineTool({
  key: 'orderedList',
  name: customMessages.tools.ordered_list,
  icon: 'format_list_numbered',
  extension: [OrderedList, ListItem],
  shortcut: ['meta', 'shift', '7'],
  action: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().toggleOrderedList().run(),
  active: (editor: Editor) => editor.isActive('orderedList'),
});
