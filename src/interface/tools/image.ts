// https://tiptap.dev/api/nodes/image

import customMessages from '../i18n/custom-messages';
import { defineTool } from '../lib';
import ImageButton from './image/ImageButton.vue';
import CustomImage from './image/node-extension';

export default defineTool({
  key: 'image',
  name: customMessages.tools.image,
  icon: 'image',
  extension: [
    CustomImage.configure({
      HTMLAttributes: {
        class: 'custom-editor-image',
      },
      allowBase64: false, // We upload to Directus instead
      inline: false,
    }),
  ],
  excludeFromOptions: false,
  excludeFromToolbar: false, // Show in toolbar
  toolbarButton: ImageButton,
  action: () => {
    // Action will be handled by the custom toolbar button component
  },
  disabled: () => false,
  active: (editor) => editor.isActive('customImage'),
});
