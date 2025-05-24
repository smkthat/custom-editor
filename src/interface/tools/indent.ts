import { type Dispatch, type Editor, Extension } from '@tiptap/core'
import {
  AllSelection,
  type EditorState,
  TextSelection,
  type Transaction,
} from '@tiptap/pm/state'
import { defineTool } from "../lib";
import customMessages from "../i18n/custom-messages";

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType
    }
    outdent: {
      outdent: () => ReturnType
    }
  }
}

// Helper function to check if something is a function
const isFunction = (fn: any): fn is Function => typeof fn === 'function';

// @weiruo/tiptap-extension-indent Version:2.0.4-1
const classAttrPrefix = 'indent-'
const IndentExtension = Extension.create({
  name: 'indent',
  addOptions() {
    return {
      types: ['heading', 'listItem', 'taskItem', 'paragraph'],
      minLevel: 0,
      maxLevel: 5,
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: null,
            renderHTML: (attributes) => {
              if (!attributes.indent) {
                return {}
              }
              if (attributes.indent > this.options.minLevel) {
                return {
                  class: `${classAttrPrefix}${attributes.indent}`,
                }
              }
              return {}
            },
            parseHTML: (element) => {
              let indentClassName = ''
              // Fix the iteration issue by converting DOMTokenList to array
              const classList = Array.from(element.classList);
              for (const className of classList) {
                if (className.startsWith(classAttrPrefix)) {
                  indentClassName = className
                  break
                }
              }
              if (indentClassName) {
                const level = Number.parseInt(
                  indentClassName.slice(classAttrPrefix.length),
                  10,
                )
                return level && level > this.options.minLevel ? level : null
              }
              return null
            },
          },
        },
      },
    ]
  },
  addCommands() {
    const setNodeIndentMarkup = (
      tr: Transaction,
      pos: number,
      delta: number,
    ) => {
      const node = tr.doc.nodeAt(pos) ?? null
      if (node) {
        const nextLevel = (node.attrs.indent || 0) + delta
        const { minLevel, maxLevel } = this.options
        let indent = nextLevel
        if (nextLevel < minLevel) {
          indent = minLevel
        } else if (nextLevel > maxLevel) {
          indent = maxLevel
        }
        if (indent !== node.attrs.indent) {
          const clonedAttrs = { ...node.attrs }
          delete clonedAttrs.indent

          const nodeAttrs =
            indent > minLevel ? { ...clonedAttrs, indent } : clonedAttrs
          return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks)
        }
      }
      return tr
    }
    const updateIndentLevel = (tr: Transaction, delta: number) => {
      const { doc, selection } = tr
      if (
        doc &&
        selection &&
        (selection instanceof TextSelection ||
          selection instanceof AllSelection)
      ) {
        const { from, to } = selection
        doc.nodesBetween(from, to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            tr = setNodeIndentMarkup(tr, pos, delta)
            return false
          }
          return true
        })
      }
      return tr
    }
    const applyIndent =
      (direction: number) =>
      () =>
      ({
        tr,
        state,
        dispatch,
        editor,
      }: {
        tr: Transaction
        state: EditorState
        dispatch?: Dispatch
        editor: Editor
      }) => {
        const { selection } = state
        tr.setSelection(selection)
        tr = updateIndentLevel(tr, direction)
        if (tr.docChanged) {
          if (dispatch && isFunction(dispatch)) {
            dispatch(tr)
          }
          return true
        }
        return false
      }
    return {
      indent: applyIndent(1),
      outdent: applyIndent(-1),
    }
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (
          this.editor.isActive('bulletList') ||
          this.editor.isActive('orderedList')
        ) {
          return this.editor.commands.sinkListItem('listItem')
        }
        if (this.editor.isActive('taskList')) {
          return this.editor.commands.sinkListItem('taskItem')
        }
        return this.editor.commands.indent()
      },
      'Shift-Tab': () => {
        if (
          this.editor.isActive('bulletList') ||
          this.editor.isActive('orderedList')
        ) {
          return this.editor.commands.liftListItem('listItem')
        }
        if (this.editor.isActive('taskList')) {
          return this.editor.commands.liftListItem('taskItem')
        }
        return this.editor.commands.outdent()
      },
    }
  },
})

// Define the indent tool
export default defineTool({
    key: "indent",
    name: customMessages.tools.indent,
    icon: "format_indent_increase",
    extension: [IndentExtension],
    excludeFromOptions: false,
    excludeFromToolbar: false,
    action: (editor) => {
        editor.chain().focus().indent().run();
    },
    disabled: (editor) => !editor.can().indent(),
    active: () => false,
});

// Define the outdent tool
export const outdentTool = defineTool({
    key: "outdent", 
    name: "Outdent",
    icon: "format_indent_decrease",
    extension: [], // Extension is already added by indent tool
    excludeFromOptions: false,
    excludeFromToolbar: false,
    action: (editor) => {
        editor.chain().focus().outdent().run();
    },
    disabled: (editor) => !editor.can().outdent(),
    active: () => false,
}); 