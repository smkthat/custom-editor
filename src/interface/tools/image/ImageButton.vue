<template>
  <v-menu show-arrow placement="bottom-start">
    <template #activator="{ toggle }">
      <v-button
        @click="toggle"
        tabindex="-1"
        v-tooltip:[tooltipPlacement]="tooltip"
        :aria-label="title"
        :disabled="disabled"
        :aria-disabled="disabled"
        :aria-pressed="active"
        :class="{ 'is-active': active }"
        :icon="small"
        :small="small"
        :x-small="!small"
      >
        <template v-if="icon === false">{{ display ? display : title }}</template>
        <v-icon v-if="icon !== false" :name="icon" />
      </v-button>
    </template>

    <v-list>
      <v-list-item clickable @click="openImageDialog" :disabled="disabled">
        <v-list-item-content>
          <v-text-overflow :text="t('image.upload')" />
        </v-list-item-content>
      </v-list-item>

      <!-- Image settings - only show when image is selected -->
      <template v-if="isImageSelected">
        <v-divider />

        <v-list-group>
          <template #activator>
            <v-text-overflow :text="t('image.size')" />
          </template>

          <v-list-item clickable @click="updateImageSize('small')" :active="currentSize === 'small'">
            <v-list-item-content>
              <v-text-overflow :text="t('image.small')" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item clickable @click="updateImageSize('medium')" :active="currentSize === 'medium'">
            <v-list-item-content>
              <v-text-overflow :text="t('image.medium')" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item clickable @click="updateImageSize('large')" :active="currentSize === 'large'">
            <v-list-item-content>
              <v-text-overflow :text="t('image.large')" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item clickable @click="updateImageSize('full')" :active="currentSize === 'full'">
            <v-list-item-content>
              <v-text-overflow :text="t('image.full')" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item clickable @click="updateImageSize('original')" :active="currentSize === 'original'">
            <v-list-item-content>
              <v-text-overflow :text="t('image.original')" />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item clickable @click="removeImage">
          <v-list-item-content>
            <v-text-overflow :text="t('image.remove')" />
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>

  <!-- Image Upload Dialog -->
  <v-dialog :model-value="imageDialogOpen" @update:model-value="imageDialogOpen = false" persistent>
    <v-sheet>
      <v-toolbar color="transparent" class="dialog-title">
        <v-toolbar-title>{{ t('image.select_image') }}</v-toolbar-title>
        <v-spacer />
        <v-button icon @click="imageDialogOpen = false">
          <v-icon name="close" />
        </v-button>
      </v-toolbar>

      <div class="dialog-content">
        <div class="upload-section">
          <v-notice type="info" class="upload-notice">
            <p>{{ t('image.upload_description') }}</p>
          </v-notice>

          <v-button large class="upload-button" @click="openFilePicker">
            <v-icon name="upload" left />
            {{ t('image.choose_file') }}
          </v-button>

          <div v-if="uploading" class="upload-progress">
            <v-progress-circular indeterminate />
            <p>{{ t('image.uploading') }}</p>
          </div>
        </div>

        <div class="url-section">
          <v-divider />
          <v-notice type="info" class="url-notice">
            <p>{{ t('image.url_description') }}</p>
          </v-notice>

          <v-input v-model="imageUrl" :placeholder="t('image.url_placeholder')" class="url-input" />

          <v-button :disabled="!imageUrl" @click="insertImageFromUrl">
            {{ t('image.insert_from_url') }}
          </v-button>
        </div>
      </div>

      <v-divider />

      <div class="dialog-actions">
        <v-button secondary @click="imageDialogOpen = false">
          {{ t('Cancel') }}
        </v-button>
      </div>
    </v-sheet>
  </v-dialog>

  <!-- Hidden file input -->
  <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="handleFileInputChange" />
</template>

<script setup lang="ts">
  import { useApi } from '@directus/extensions-sdk';
  import { computed, inject, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { CustomToolButtonProps } from '../../types';
  import type { Ref } from 'vue';

  import { useI18nFallback } from '../../composables/use-i18n-fallback';
  import { translateShortcut } from '../../directus-core/utils/translate-shortcut';

  const props = defineProps<CustomToolButtonProps>();

  const api = useApi();
  const { t } = useI18nFallback(useI18n());

  const fileInput = ref<HTMLInputElement>();
  const imageDialogOpen = ref(false);
  const uploading = ref(false);
  const imageUrl = ref('');
  const currentSize = ref('medium');

  // ToolButton props handling
  const tooltip = computed(() => {
    if (!props.shortcut?.length) return props.title;

    return `${props.title} (${translateShortcut(props.shortcut)})`;
  });

  const small = computed(() => props.icon || props.display);
  const fullscreen = inject('fullscreen') as Ref;
  const tooltipPlacement = computed(() => (fullscreen.value ? 'bottom' : 'top'));

  // Image selection detection
  const isImageSelected = computed(() => {
    if (!props.editor) return false;
    return props.editor.isActive('customImage');
  });

  // Watch for image selection changes to get current attributes
  watch(
    () => props.editor?.state,
    () => {
      if (isImageSelected.value) {
        const attrs = props.editor.getAttributes('customImage');
        currentSize.value = attrs.size || 'medium';
        console.log('Current image attributes:', attrs);
      }
    },
    { deep: true }
  );

  const openImageDialog = () => {
    imageDialogOpen.value = true;
    imageUrl.value = '';
  };

  const openFilePicker = () => {
    fileInput.value?.click();
  };

  const insertImageFromUrl = () => {
    if (!imageUrl.value) return;

    // Insert image with default styling
    props.editor
      .chain()
      .focus()
      .setImage({
        src: imageUrl.value,
        size: 'medium',
        alignment: 'left',
        caption: '',
        alt: '',
        title: '',
      })
      .run();

    // Close the dialog
    imageDialogOpen.value = false;
    imageUrl.value = '';
  };

  const handleFileInputChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files?.length) return;

    const file = files[0];
    if (!file) return;

    uploading.value = true;

    try {
      // Upload using Directus's native file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', '88f605c8-e61f-4e64-9839-24e42c7bf82d');

      const response = await api.post('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const fileData = response.data.data;
      const assetUrl = `${window.location.origin}/assets/${fileData.id}`;

      // Insert image with default styling
      props.editor
        .chain()
        .focus()
        .setImage({
          src: assetUrl,
          size: 'medium',
          alignment: 'left',
          caption: '',
          alt: '',
          title: '',
        })
        .run();

      // Close the dialog
      imageDialogOpen.value = false;

      // Reset the input
      if (target) target.value = '';
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      uploading.value = false;
    }
  };

  const updateImageSize = (size: string) => {
    console.log('Updating image size to:', size);
    currentSize.value = size;

    // Update the image attributes directly
    props.editor
      .chain()
      .focus()
      .updateAttributes('customImage', {
        size: size,
      })
      .run();

    console.log('Size updated to:', size);
  };

  const removeImage = () => {
    props.editor.chain().focus().deleteSelection().run();
  };
</script>

<style scoped>
  .dialog-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 24px;
    font-weight: 500;
    padding: 24px;
  }

  .dialog-content {
    padding: 24px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .upload-section {
    margin-bottom: 24px;
  }

  .upload-notice {
    margin-bottom: 16px;
  }

  .upload-button {
    width: 100%;
    margin-bottom: 16px;
  }

  .upload-progress {
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: center;
    padding: 16px;
  }

  .url-section {
    margin-top: 24px;
  }

  .url-notice {
    margin: 16px 0;
  }

  .url-input {
    margin-bottom: 16px;
  }

  .dialog-actions {
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .is-active :deep(.button:not(:disabled)) {
    color: var(--v-button-color-active);
    background-color: var(--v-button-background-color-active);
  }
</style>

<style>
  /* Global styles for inserted images */
  .custom-editor-image {
    max-width: 100%;
    height: auto;
    border-radius: var(--theme--border-radius);
  }

  .image-wrapper {
    margin: 1rem 0;
    display: block;
  }

  .image-wrapper.image-center {
    text-align: center;
  }

  .image-wrapper.image-right {
    text-align: right;
  }

  .image-wrapper.image-left {
    text-align: left;
  }

  .image-caption {
    margin: 0.5rem 0 0 0;
    font-size: 0.875rem;
    font-style: italic;
    color: var(--theme--foreground-subdued);
    text-align: inherit;
  }
</style>
