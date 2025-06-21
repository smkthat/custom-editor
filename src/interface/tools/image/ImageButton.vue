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
      <v-list-item clickable @click="uploadDrawerOpened = true" :disabled="disabled">
        <v-list-item-content>
          <v-text-overflow :text="t('image.upload')" />
        </v-list-item-content>
      </v-list-item>

      <!-- Image settings - only show when image is selected -->
      <template v-if="isImageSelected">
        <v-divider />

        <!-- Size Options -->
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

        <!-- Alignment Options -->
        <v-list-group>
          <template #activator>
            <v-text-overflow :text="t('image.alignment')" />
          </template>
          <v-list-item clickable @click="updateImageAlignment('left')" :active="currentAlignment === 'left'">
            <v-list-item-content>
              <v-text-overflow text="Left" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item clickable @click="updateImageAlignment('center')" :active="currentAlignment === 'center'">
            <v-list-item-content>
              <v-text-overflow text="Center" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item clickable @click="updateImageAlignment('right')" :active="currentAlignment === 'right'">
            <v-list-item-content>
              <v-text-overflow text="Right" />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-divider />

        <!-- Remove Buttons -->
        <v-list-item :disabled="currentCaption === ''" clickable @click="removeImageCaption('')">
          <v-list-item-icon>
            <v-icon name="format_clear" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-text-overflow :text="t('image.caption_remove')" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item clickable @click="removeImage">
          <v-list-item-icon>
            <v-icon name="delete" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-text-overflow :text="t('image.remove')" class="text-danger" />
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>

  <v-drawer
    v-if="haveFilesAccess && !disabled"
    :model-value="uploadDrawerOpened"
    icon="image"
    :title="t('upload_from_device')"
    :cancelable="true"
    @update:model-value="uploadDrawerOpened = false"
    @cancel="uploadDrawerOpened = false"
  >
    <div class="uploader-drawer-content">
      <v-upload
        :ref="uploaderComponentElement"
        :multiple="false"
        :folder="folder"
        from-library
        from-url
        @input="handleFile"
      />
    </div>
  </v-drawer>
</template>

<script setup lang="ts">
  import { useApi, useStores } from '@directus/extensions-sdk';
  import { computed, inject, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { CustomToolButtonProps } from '../../types';
  import type { Ref } from 'vue';

  import useDirectusToken from '../../composables/use-directus-token';
  import { useI18nFallback } from '../../composables/use-i18n-fallback';
  import { translateShortcut } from '../../directus-core/utils/translate-shortcut';

  type FileInfo = {
    id: string;
    title: string;
    type: string;
  };

  const { t } = useI18nFallback(useI18n());

  const api = useApi();
  const { addTokenToURL } = useDirectusToken(api);

  const props = defineProps<CustomToolButtonProps>();

  const uploadDrawerOpened = ref(false);
  const uploaderComponentElement = ref<HTMLElement>();
  const currentSize = ref('medium');
  const currentAlignment = ref('left');
  const currentCaption = ref('');
  const currentAlt = ref('');

  const { useCollectionsStore } = useStores();
  const collectionStore = useCollectionsStore();
  const haveFilesAccess = Boolean(collectionStore.getCollection('directus_files'));

  const handleFile = (file: FileInfo) => {
    const src_url = addTokenToURL(api.defaults.baseURL + 'assets/' + file.id);

    props.editor
      .chain()
      .focus()
      .setImage({
        src: src_url,
        alt: file.title,
        title: file.title,
        size: 'medium',
        alignment: 'left',
        caption: '',
      })
      .run();

    uploadDrawerOpened.value = false;
  };

  const small = computed(() => props.icon || props.display);
  const fullscreen = inject('fullscreen') as Ref;
  const tooltipPlacement = computed(() => (fullscreen.value ? 'bottom' : 'top'));

  // ToolButton props handling
  const tooltip = computed(() => {
    if (!props.shortcut?.length) return props.title;
    return `${props.title} (${translateShortcut(props.shortcut)})`;
  });

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
        currentAlignment.value = attrs.alignment || 'left';
        currentCaption.value = attrs.caption || '';
        currentAlt.value = attrs.alt || '';
      }
    },
    { deep: true }
  );

  const updateImageSize = (size: string) => {
    currentSize.value = size;
    updateImageAttributes({ size });
  };

  const updateImageAlignment = (alignment: string) => {
    currentAlignment.value = alignment;
    updateImageAttributes({ alignment });
  };

  const removeImageCaption = (caption: string) => {
    currentCaption.value = caption;
    updateImageAttributes({ caption });
  };

  const updateImageAlt = (alt: string) => {
    currentAlt.value = alt;
    updateImageAttributes({ alt });
  };

  const updateImageAttributes = (attrs: Record<string, any>) => {
    if (!props.editor) return;

    props.editor.chain().focus().updateAttributes('customImage', attrs).run();
  };

  const removeImage = () => {
    props.editor.chain().focus().deleteSelection().run();
  };
</script>

<style scoped>
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
