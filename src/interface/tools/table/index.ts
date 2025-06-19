import { TableKit } from '@tiptap/extension-table';
import type { Editor } from '@tiptap/core';

import customMessages from '../../i18n/custom-messages';
import { defineTool } from '../../lib';
import ToolButton from './ToolButton.vue';

export default defineTool({
  key: 'table',
  name: customMessages.tools.table,
  icon: 'table',
  extension: [TableKit],
  toolbarButton: ToolButton,
  action: (editor: Editor) => editor.chain().focus().insertTable().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().insertTable().run(),
  disabledInSingleLineMode: true,
  active: (editor: Editor) => editor.isActive('table'),
});
