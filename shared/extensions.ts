// Used for /content and /src/display
// Add only extensions that are necessary for rendering the content
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import { Details, DetailsContent, DetailsSummary } from '@tiptap/extension-details';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import { BulletList, ListItem, OrderedList, TaskItem, TaskList } from '@tiptap/extension-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import { Dropcursor, Focus, Gapcursor, Placeholder, Selection, UndoRedo } from '@tiptap/extensions';

export default [
  Document,
  Text,
  Typography,
  Paragraph,
  HardBreak,
  Heading,
  CodeBlock,
  BulletList,
  OrderedList,
  ListItem,
  TaskList,
  TaskItem,
  Blockquote,
  HorizontalRule,
  Link,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Subscript,
  Superscript,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TextAlign,
  Image,
  Dropcursor,
  Gapcursor,
  UndoRedo,
  Placeholder,
  Focus,
  Selection,
  Details,
  DetailsSummary,
  DetailsContent,
];
