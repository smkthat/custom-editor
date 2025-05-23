import customMessages from "../i18n/custom-messages";
import { defineTool } from "../lib";
import type { Editor } from "@tiptap/core";
import DocxImportButton from "../components/DocxImportButton.vue";

export default defineTool({
    key: "docx-import",
    name: customMessages.tools.docxImport,
    icon: "file_upload",
    extension: [], // No TipTap extension needed, just functionality
    excludeFromOptions: false,
    toolbarButton: DocxImportButton,
    action: (editor: Editor) => {
        // Action will be handled by the custom toolbar button component
    },
    disabled: (editor: Editor) => false,
    active: (editor: Editor) => false,
}); 