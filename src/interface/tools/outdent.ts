import { defineTool } from "../lib";
import customMessages from "../i18n/custom-messages";

export default defineTool({
    key: "outdent",
    name: customMessages.tools.outdent,
    icon: "format_indent_decrease",
    shortcut: ["shift", "tab"],
    extension: [], // Extension is already added by indent tool
    excludeFromOptions: false,
    excludeFromToolbar: false,
    action: (editor) => {
        editor.chain().focus().outdent().run();
    },
    disabled: (editor) => !editor.can().outdent(),
    active: () => false,
});
