// NOTE: [guide] Add a `Tool` by creating a new file in this directory, importing it and adding it to the `tools: Tool[]` array below! If you import a tiptap extension that also renders content, make sure to add it to /shared/extensions.ts as well!

import type { InterfaceOption, Tool, ToolSelection } from '../types';
import type { AnyExtension } from '@tiptap/core';

import blockquote from './blockquote';
import bold from './bold';
import bulletList from './bullet-list';
import code from './code';
import codeBlock from './code-block';
import details from './details';
import docxImport from './docx-import';
import fullscreen from './fullscreen';
import hardBreak from './hard-break';
import heading from './heading';
import history from './history';
import horizontalRule from './horizontal-rule';
import image from './image';
import indent from './indent';
import italic from './italic';
import link from './link';
import orderedList from './ordered-list';
import outdent from './outdent';
import paragraph from './paragraph';
import relationBlock from './relation-block';
import relationInlineBlock from './relation-inline-block';
import relationMark from './relation-mark';
import strike from './strike';
import subscript from './subscript';
import superscript from './superscript';
import table from './table';
import taskList from './task-list';
import textAlign from './text-align';
import underline from './underline';

const tools: Tool[] = [
  relationBlock,
  relationInlineBlock,
  relationMark,
  paragraph,
  codeBlock,
  heading(1),
  heading(2),
  heading(3),
  heading(4),
  heading(5),
  heading(6),
  bold,
  italic,
  strike,
  underline,
  code,
  subscript,
  superscript,
  link.add,
  link.remove,
  link.auto,
  hardBreak,
  horizontalRule,
  textAlign,
  bulletList,
  orderedList,
  taskList,
  blockquote,
  table,
  history.undo,
  history.redo,
  fullscreen,
  docxImport,
  image,
  indent,
  outdent,
  details,
];

export const selectedTools = (selection: ToolSelection, includeRelationNodes = false) =>
  tools.filter(
    ({ key }) =>
      selection.indexOf(key) >= 0 ||
      (includeRelationNodes && ['relation-block', 'relation-inline-block', 'relation-mark'].indexOf(key) >= 0)
  );

export const toolsExtensions = (selection: ToolSelection): AnyExtension[] => {
  const toolsExtensions: AnyExtension[] = [];
  const uniqueNames: string[] = [];

  selectedTools(selection).forEach(({ extension }) =>
    extension.forEach((item) => {
      const extensionItem = typeof item === 'function' ? item(selection) : item;
      const extensionNotExists = uniqueNames.indexOf(extensionItem.name) < 0;

      if (extensionNotExists) {
        uniqueNames.push(extensionItem.name);
        toolsExtensions.push(extensionItem);
      }
    })
  );

  return toolsExtensions;
};

const optionalTools: Tool[] = tools.filter((tool) => !tool.excludeFromOptions);

export const interfaceOptions: InterfaceOption[] = optionalTools.map(({ key, name }) => ({ text: name, value: key }));

export const interfaceOptionsDefault: string[] = optionalTools.map(({ key }) => key);
