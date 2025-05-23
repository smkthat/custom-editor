import { OrderedList, ListItem } from "@tiptap/extension-list";
import { defineTool } from "../lib";
import customMessages from "../i18n/custom-messages";
import type { Editor } from "@tiptap/core";

export default defineTool({
    key: "orderedList",
    name: customMessages.tools.ordered_list,
    icon: "format_list_numbered",
    extension: [OrderedList, ListItem],
    shortcut: ["meta", "shift", "7"],
    action: (editor: Editor) =>
        editor.chain().focus().toggleOrderedList().run(),
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().toggleOrderedList().run(),
    active: (editor: Editor) => editor.isActive("orderedList"),
});
