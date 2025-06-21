<template>
  <bubble-menu :editor="editor" :should-show="shouldShow" :tippy-options="{ duration: 100 }" v-if="editor">
    <div class="image-bubble-menu">
      <div class="bubble-menu-section">
        <label>Size:</label>
        <v-select v-model="currentSize" :items="sizeOptions" small @update:model-value="updateImageSize" />
      </div>

      <v-divider />

      <div class="bubble-menu-section">
        <label>Alignment:</label>
        <v-select
          v-model="currentAlignment"
          :items="alignmentOptions"
          small
          @update:model-value="updateImageAlignment"
        />
      </div>

      <v-divider />

      <div class="bubble-menu-section">
        <label>Caption:</label>
        <v-input v-model="currentCaption" placeholder="Add caption..." small @update:model-value="updateImageCaption" />
      </div>

      <v-divider />

      <div class="bubble-menu-section">
        <label>Alt Text:</label>
        <v-input
          v-model="currentAlt"
          placeholder="Alt text for accessibility..."
          small
          @update:model-value="updateImageAlt"
        />
      </div>
    </div>
  </bubble-menu>
</template>

<script setup lang="ts">
  import { BubbleMenu } from '@tiptap/extension-bubble-menu';
  import { ref, watch } from 'vue';
  import type { Editor } from '@tiptap/vue-3';

  const props = defineProps<{
    editor: Editor;
  }>();

  const currentSize = ref('medium');
  const currentAlignment = ref('left');
  const currentCaption = ref('');
  const currentAlt = ref('');

  const sizeOptions = [
    { text: 'Small (25%)', value: 'small' },
    { text: 'Medium (50%)', value: 'medium' },
    { text: 'Large (75%)', value: 'large' },
    { text: 'Full Width (100%)', value: 'full' },
    { text: 'Original Size', value: 'original' },
  ];

  const alignmentOptions = [
    { text: 'Left', value: 'left' },
    { text: 'Center', value: 'center' },
    { text: 'Right', value: 'right' },
  ];

  // Show bubble menu only when an image is selected
  const shouldShow = ({ editor, view, state, oldState, from, to }) => {
    return editor.isActive('customImage');
  };

  // Watch for image selection changes to populate current values
  watch(
    () => props.editor?.state.selection,
    () => {
      if (props.editor.isActive('customImage')) {
        // Get current image attributes
        const { node } = props.editor.state.selection as any;
        if (node && node.type.name === 'customImage') {
          const attrs = node.attrs;

          // Extract current values from the image
          currentAlt.value = attrs.alt || '';
          currentSize.value = attrs.size || 'medium';
          currentAlignment.value = attrs.alignment || 'left';
          currentCaption.value = attrs.caption || '';
        }
      }
    },
    { deep: true }
  );

  const getSizeStyles = (size: string): string => {
    switch (size) {
      case 'small':
        return 'width: 25%; max-width: 200px;';
      case 'medium':
        return 'width: 50%; max-width: 400px;';
      case 'large':
        return 'width: 75%; max-width: 600px;';
      case 'full':
        return 'width: 100%;';
      case 'original':
        return '';
      default:
        return 'width: 50%; max-width: 400px;';
    }
  };

  const getAlignmentClass = (alignment: string): string => {
    switch (alignment) {
      case 'center':
        return 'image-center';
      case 'right':
        return 'image-right';
      case 'left':
      default:
        return 'image-left';
    }
  };

  const updateImageSize = (size: string) => {
    currentSize.value = size;

    props.editor
      .chain()
      .focus()
      .updateAttributes('customImage', {
        size: size,
      })
      .run();
  };

  const updateImageAlignment = (alignment: string) => {
    currentAlignment.value = alignment;

    props.editor
      .chain()
      .focus()
      .updateAttributes('customImage', {
        alignment: alignment,
      })
      .run();
  };

  const updateImageCaption = (caption: string) => {
    currentCaption.value = caption;

    props.editor
      .chain()
      .focus()
      .updateAttributes('customImage', {
        caption: caption,
      })
      .run();
  };

  const updateImageAlt = (alt: string) => {
    currentAlt.value = alt;

    props.editor
      .chain()
      .focus()
      .updateAttributes('customImage', {
        alt: alt,
      })
      .run();
  };
</script>

<style scoped>
  .image-bubble-menu {
    background: var(--theme--background);
    border: 1px solid var(--theme--border-color);
    border-radius: var(--theme--border-radius);
    padding: 12px;
    min-width: 280px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .bubble-menu-section {
    margin-bottom: 8px;
  }

  .bubble-menu-section:last-child {
    margin-bottom: 0;
  }

  .bubble-menu-section label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 4px;
    color: var(--theme--foreground-subdued);
  }

  .bubble-menu-section .v-input,
  .bubble-menu-section .v-select {
    width: 100%;
  }
</style>
