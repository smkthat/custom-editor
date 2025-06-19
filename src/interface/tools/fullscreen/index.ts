import customMessages from '../../i18n/custom-messages';
import { defineTool } from '../../lib';
import ToolButton from './ToolButton.vue';

export default defineTool({
  key: 'fullscreen',
  name: customMessages.tools.fullscreen,
  extension: [],
  toolbarButton: ToolButton,
  disabledInSingleLineMode: true,
});
