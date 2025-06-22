// https://tiptap.dev/api/nodes/details

import { Details, DetailsContent, DetailsSummary } from '@tiptap/extension-details';
import type { Editor } from '@tiptap/core';

import customMessages from '../i18n/custom-messages';
import { defineTool } from '../lib';

export default defineTool({
  key: 'details',
  name: customMessages.tools.details,
  icon: 'featured_play_list',
  extension: [
    Details.configure({
      persist: true,
      openClassName: 'is-open',
      HTMLAttributes: {
        class: 'details',
      },
    }),
    DetailsSummary,
    DetailsContent,
  ],
  shortcut: ['meta', 'shift', 'D'],
  action: (editor: Editor) => editor.chain().focus().setDetails().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().setDetails().run(),
  active: (editor: Editor) => editor.isActive('details'),
});
