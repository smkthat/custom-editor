import { UndoRedo } from "@tiptap/extensions";
import { defineTool } from "../lib";
import customMessages from "../i18n/custom-messages";
import type { Editor } from "@tiptap/core";

const undo = defineTool({
key: "undo",
name: customMessages.tools.undo,
icon: "undo",
extension: [UndoRedo],
shortcut: ["meta", "Z"],
action: (editor: Editor) => editor.chain().focus().undo().run(),
disabled: (editor: Editor) => !editor.can().chain().focus().undo().run(),
active: () => false,
});
const redo = defineTool({
key: "redo",
name: customMessages.tools.redo,
icon: "redo",
extension: [UndoRedo],
shortcut: ["meta", "shift", "Z"],
action: (editor: Editor) => editor.chain().focus().redo().run(),
disabled: (editor: Editor) => !editor.can().chain().focus().redo().run(),
active: () => false,
});

export default { undo, redo };