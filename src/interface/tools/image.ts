// https://tiptap.dev/api/nodes/image

import Image from "@tiptap/extension-image";
import customMessages from "../i18n/custom-messages";
import { defineTool } from "../lib";
import ImageButton from "./image/ImageButton.vue";

export default defineTool({
    key: "image",
    name: customMessages.tools.image,
    icon: "image",
    extension: [Image.configure({
        HTMLAttributes: {
            class: 'custom-editor-image',
        },
        allowBase64: true,
        inline: false,
    })],
    excludeFromOptions: false,
    excludeFromToolbar: false, // Show in toolbar
    toolbarButton: ImageButton,
    action: () => {
        // Action will be handled by the custom toolbar button component
    },
    disabled: () => false,
    active: () => false,
}); 