import DocxImportButton from '../components/DocxImportButton.vue';
import customMessages from '../i18n/custom-messages';
import { defineTool } from '../lib';

export default defineTool({
  key: 'docx-import',
  name: customMessages.tools.docxImport,
  icon: 'file_upload',
  extension: [], // No TipTap extension needed, just functionality
  excludeFromOptions: false,
  toolbarButton: DocxImportButton,
  action: () => {
    // Action will be handled by the custom toolbar button component
  },
  disabled: () => false,
  active: () => false,
});
