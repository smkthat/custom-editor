<template>
  <ToolButton
    :title="title"
    :icon="icon"
    :display="false"
    :shortcut="[]"
    :disabled="disabled"
    :active="false"
    :action="openFileDialog"
  />
  <input ref="fileInput" type="file" accept=".docx" style="display: none" @change="handleFileSelect" />
</template>

<script setup lang="ts">
  import { useApi } from '@directus/extensions-sdk';
  import { onMounted, ref } from 'vue';
  import type { CustomToolButtonProps } from '../types';

  import CustomDocxStyleMap from '../data/docx-style-map.json';
  import ToolButton from './ToolButton.vue';

  const props = defineProps<CustomToolButtonProps>();

  const fileInput = ref<HTMLInputElement | null>(null);
  const mammothLoaded = ref(false);
  const api = useApi();

  // Load mammoth from CDN
  onMounted(async () => {
    try {
      // Check if mammoth is already loaded
      if (window.mammoth) {
        mammothLoaded.value = true;
        return;
      }

      // Load mammoth from CDN
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/mammoth@1.6.0/mammoth.browser.min.js';
      script.onload = () => {
        mammothLoaded.value = true;
      };
      script.onerror = () => {
        console.error('Failed to load mammoth library');
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error loading mammoth:', error);
    }
  });

  const openFileDialog = () => {
    if (!mammothLoaded.value) {
      console.warn('Mammoth library not yet loaded');
      return;
    }
    if (fileInput.value) {
      fileInput.value.click();
    }
  };

  // Helper function to convert base64 to blob
  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  // Helper function to upload image to Directus
  const uploadImageToDirectus = async (imageBlob: Blob, filename: string): Promise<string> => {
    try {
      const formData = new FormData();
      // Specific folder for imported images
      formData.append('folder', props.folder || '');
      // Append the image file
      formData.append('file', imageBlob, filename);

      const response = await api.post('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data.id;
    } catch (error) {
      console.error('Error uploading image to Directus:', error);
      throw error;
    }
  };

  // Helper function to process HTML and upload images
  const processImagesInHtml = async (html: string): Promise<string> => {
    console.log('🖼️ Original HTML:', html.substring(0, 500) + '...');

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('img');

    console.log(`🖼️ Found ${images.length} images to process`);

    for (let i = 0; i < images.length; i++) {
      const img = images[i]!;
      const src = img.getAttribute('src');

      console.log(`🖼️ Processing image ${i + 1}: ${src?.substring(0, 50)}...`);

      if (src && src.startsWith('data:')) {
        try {
          // Extract base64 data and mime type
          const matches = src.match(/^data:([^;]+);base64,(.+)$/);
          if (matches) {
            const mimeType = matches[1];
            const base64Data = matches[2];

            // Create blob from base64
            const imageBlob = base64ToBlob(base64Data!, mimeType!);

            // Generate filename based on image index and mime type
            const extension = mimeType!.split('/')[1];
            const filename = `docx-import-image-${Date.now()}-${i + 1}.${extension}`;

            // Upload to Directus
            const fileId = await uploadImageToDirectus(imageBlob, filename);

            // Replace src with absolute Directus asset URL
            const assetUrl = `${window.location.origin}/assets/${fileId}`;
            img.setAttribute('src', assetUrl);

            // Ensure the image has proper attributes
            if (!img.getAttribute('alt')) {
              img.setAttribute('alt', `Imported image ${i + 1}`);
            }

            console.log(`✅ Uploaded image ${i + 1} as file ID: ${fileId}, URL: ${assetUrl}`);
          }
        } catch (error) {
          console.error(`❌ Error processing image ${i + 1}:`, error);
          // Keep original base64 if upload fails
        }
      }
    }

    // Get the full HTML content, not just body
    const processedHtml = new XMLSerializer().serializeToString(doc);
    const bodyMatch = processedHtml.match(/<body[^>]*>(.*?)<\/body>/s);
    const finalHtml = bodyMatch ? bodyMatch[1] : processedHtml;

    console.log('🖼️ Processed HTML:', finalHtml!.substring(0, 500) + '...');
    console.log(`🖼️ Final image count: ${(finalHtml!.match(/<img/g) || []).length}`);

    return finalHtml!;
  };

  const handleFileSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file || !mammothLoaded.value) return;

    try {
      // Use mammoth to convert DOCX to HTML
      const arrayBuffer = await file.arrayBuffer();
      const result = await window.mammoth.convertToHtml(
        { arrayBuffer },
        // Set your custom style map in src/interface/data/docx-style-map.json
        { styleMap: JSON.parse(JSON.stringify(CustomDocxStyleMap)) }
      );
      let html = result.value;

      // Process images in the HTML and upload them to Directus
      html = await processImagesInHtml(html);

      // Insert the processed HTML content into the editor at the current cursor position
      props.editor.chain().focus().insertContent(html).run();

      // Log any conversion warnings
      if (result.messages.length > 0) {
        console.warn('DOCX conversion warnings:', result.messages);
      }

      // Clear the file input for future use
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    } catch (error) {
      console.error('Error importing DOCX file:', error);
    }
  };

  // Add mammoth type declaration
  declare global {
    interface Window {
      mammoth: any;
    }
  }
</script>
