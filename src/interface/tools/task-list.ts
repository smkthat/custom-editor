import { TaskList, TaskItem } from "@tiptap/extension-list";
import type { Editor } from "@tiptap/core";
import { defineTool } from "../lib";
import customMessages from "../i18n/custom-messages";

export default defineTool({
    key: "taskList",
    name: customMessages.tools.task_list,
    icon: "checklist",
    extension: [
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
    ],
    shortcut: ["meta", "shift", "9"],
    action: (editor: Editor) =>
        editor.chain().focus().toggleTaskList().run(),
    disabled: (editor: Editor) =>
        !editor.can().chain().focus().toggleTaskList().run(),
    active: (editor: Editor) => editor.isActive("taskList"),
});
