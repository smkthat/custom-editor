<template>
    <v-menu
        show-arrow
        placement="bottom-start"
        :fullHeight="true"
    >
        <template #activator="{ toggle }">
            <ToolButton
                :title="title"
                :icon="icon"
                :display="false"
                :shortcut="[]"
                :disabled="disabled"
                :active="active"
                :action="toggle"
            />
        </template>
        
        <div class="image-options-menu">
            <div class="image-upload-section">
                <v-button 
                    @click="openFileDialog"
                    small
                    full-width
                    icon="file_upload"
                >
                    Upload Image
                </v-button>
                <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    style="display: none"
                    @change="handleFileSelect"
                />
            </div>
            
            <v-divider />
            
            <div class="image-url-section">
                <v-input
                    v-model="imageUrl"
                    placeholder="Or enter image URL..."
                    small
                />
                <v-button 
                    @click="insertImageFromUrl"
                    :disabled="!imageUrl"
                    small
                    full-width
                    icon="link"
                >
                    Insert from URL
                </v-button>
            </div>
            
            <v-divider />
            
            <div class="image-settings-section">
                <div class="setting-group">
                    <label>Size:</label>
                    <v-select
                        v-model="imageSize"
                        :items="sizeOptions"
                        small
                    />
                </div>
                
                <div class="setting-group">
                    <label>Alignment:</label>
                    <v-select
                        v-model="imageAlignment"
                        :items="alignmentOptions"
                        small
                    />
                </div>
                
                <div class="setting-group">
                    <label>Caption:</label>
                    <v-input
                        v-model="imageCaption"
                        placeholder="Optional caption..."
                        small
                    />
                </div>
                
                <div class="setting-group">
                    <label>Alt Text:</label>
                    <v-input
                        v-model="imageAlt"
                        placeholder="Alt text for accessibility..."
                        small
                    />
                </div>
            </div>
        </div>
    </v-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { type Editor } from '@tiptap/vue-3';
import ToolButton from '../../components/ToolButton.vue';
import type { CustomToolButtonProps } from '../../types';
import { useApi } from '@directus/extensions-sdk';

const props = defineProps<CustomToolButtonProps>();

const api = useApi();
const fileInput = ref<HTMLInputElement | null>(null);
const imageUrl = ref('');
const imageSize = ref('medium');
const imageAlignment = ref('left');
const imageCaption = ref('');
const imageAlt = ref('');

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

const openFileDialog = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

// Helper function to upload image to Directus
const uploadImageToDirectus = async (imageBlob: Blob, filename: string): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('file', imageBlob, filename);
        formData.append('folder', '88f605c8-e61f-4e64-9839-24e42c7bf82d');
        
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

const getSizeStyles = (size: string): string => {
    switch (size) {
        case 'small': return 'width: 25%; max-width: 200px;';
        case 'medium': return 'width: 50%; max-width: 400px;';
        case 'large': return 'width: 75%; max-width: 600px;';
        case 'full': return 'width: 100%;';
        case 'original': return '';
        default: return 'width: 50%; max-width: 400px;';
    }
};

const getAlignmentClass = (alignment: string): string => {
    switch (alignment) {
        case 'center': return 'image-center';
        case 'right': return 'image-right';
        case 'left':
        default: return 'image-left';
    }
};

const insertImage = (src: string, alt: string, caption: string) => {
    const sizeStyles = getSizeStyles(imageSize.value);
    const alignmentClass = getAlignmentClass(imageAlignment.value);
    
    // Create image with wrapper for styling and caption
    let imageHtml = `<div class="image-wrapper ${alignmentClass}">`;
    imageHtml += `<img src="${src}" alt="${alt}" style="${sizeStyles}" class="custom-editor-image" />`;
    if (caption) {
        imageHtml += `<p class="image-caption">${caption}</p>`;
    }
    imageHtml += `</div>`;
    
    props.editor.chain().focus().insertContent(imageHtml).run();
    
    // Reset form
    imageUrl.value = '';
    imageCaption.value = '';
    imageAlt.value = '';
};

const handleFileSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;
    
    try {
        // Generate filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop() || 'jpg';
        const filename = `editor-image-${timestamp}.${extension}`;
        
        // Upload to Directus
        const fileId = await uploadImageToDirectus(file, filename);
        
        // Insert image
        const assetUrl = `${window.location.origin}/assets/${fileId}`;
        const alt = imageAlt.value || `Uploaded image: ${file.name}`;
        
        insertImage(assetUrl, alt, imageCaption.value);
        
        console.log(`✅ Uploaded and inserted image: ${fileId}`);
        
        // Clear the file input
        if (fileInput.value) {
            fileInput.value.value = '';
        }
        
    } catch (error) {
        console.error('Error uploading image:', error);
    }
};

const insertImageFromUrl = () => {
    if (!imageUrl.value) return;
    
    const alt = imageAlt.value || 'Image from URL';
    insertImage(imageUrl.value, alt, imageCaption.value);
    
    console.log(`✅ Inserted image from URL: ${imageUrl.value}`);
};
</script>

<style scoped>
.image-options-menu {
    padding: 12px;
    min-width: 280px;
    background: var(--theme--background);
    border-radius: var(--theme--border-radius);
}

.image-upload-section,
.image-url-section,
.image-settings-section {
    margin-bottom: 12px;
}

.image-url-section .v-input {
    margin-bottom: 8px;
}

.setting-group {
    margin-bottom: 8px;
}

.setting-group label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 4px;
    color: var(--theme--foreground-subdued);
}

.setting-group .v-input,
.setting-group .v-select {
    width: 100%;
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