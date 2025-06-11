import type { RelationNodeAttrs } from '../../types';
import type { Editor } from '@tiptap/core';

import customMessages from '../../i18n/custom-messages';
import { defineTool } from '../../lib';
import ToolButton from './ToolButton.vue';

export default defineTool({
  // Custom
  key: 'relation-block',
  name: customMessages.tools.relation_block,
  icon: 'library_add',
  excludeFromOptions: true,
  // Already imported
  extension: [],
  toolbarButton: ToolButton,
  action: (editor: Editor, attrs: RelationNodeAttrs) => {
    focusAfterSelectionIfNotEmpty();
    editor.chain().focus().setRelationBlock(attrs).run();
    focusAfterSelectionIfNotEmpty();

    function focusAfterSelectionIfNotEmpty() {
      // We need this workaround to prevent selecting the relation block after inserting it, if the editor content was empty (https://github.com/ueberdosis/tiptap/issues/3355)
      if (!editor.view.state.selection.empty) {
        editor.chain().focus(editor.view.state.selection.to).run();
      }
    }
  },
  disabled: (editor: Editor) => !editor.can().chain().focus().setRelationBlock().run(),
  disabledInSingleLineMode: true,
  active: (editor: Editor) => editor.isActive('relation-block'),
});
