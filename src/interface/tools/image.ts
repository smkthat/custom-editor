// https://tiptap.dev/api/nodes/image

import Image from "@tiptap/extension-image";
import customMessages from "../i18n/custom-messages";
import { defineTool } from "../lib";

export default defineTool({
    key: "image",
    name: customMessages.tools.image,
    icon: "image",
    extension: [Image],
    excludeFromOptions: false,
    excludeFromToolbar: true, // We don't need a separate toolbar button for images since they're inserted via DOCX import
    action: () => {
        // No direct action needed - images are inserted via DOCX import or other means
    },
    disabled: () => false,
    active: () => false,
}); 