<template>
    <NodeViewWrapper>
        <figure 
            class="custom-image-figure"
            :style="getFigureStyle()"
        >
            <img
                :src="src"
                :alt="alt || ''"
                :title="title || ''"
                :class="['custom-editor-image']"
                :style="getImageStyle()"
                @click="handleImageClick"
            />
            <figcaption
                v-if="showCaption"
                contenteditable="true"
                :class="['custom-image-caption']"
                :style="getCaptionStyle()"
                @input="updateCaption"
                @keydown="handleCaptionKeydown"
                @blur="handleCaptionBlur"
                ref="captionRef"
                :placeholder="'Enter caption...'"
            >{{ caption }}</figcaption>
            <div
                v-if="!showCaption && selected"
                class="add-caption-placeholder"
                :style="getCaptionStyle()"
                @click="addCaption"
            >
                Click to add caption
            </div>
        </figure>
    </NodeViewWrapper>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';

const props = defineProps(nodeViewProps);

const captionRef = ref<HTMLElement>();

// Extract attributes with safe defaults
const src = computed(() => props.node?.attrs?.src || '');
const alt = computed(() => props.node?.attrs?.alt || '');
const title = computed(() => props.node?.attrs?.title || '');
const size = computed(() => props.node?.attrs?.size || 'medium');
const alignment = computed(() => props.node?.attrs?.alignment || 'left');
const caption = computed(() => props.node?.attrs?.caption || '');
const link = computed(() => props.node?.attrs?.link || null);

const showCaption = computed(() => caption.value || props.selected);

const handleImageClick = (event: MouseEvent) => {
    if (link.value) {
        event.preventDefault();
        event.stopPropagation();
        window.open(link.value, '_blank', 'noopener,noreferrer');
    }
};

const getFigureStyle = (): Record<string, string> => {
    const styles: Record<string, string> = {};
    
    // Ensure figure spans full width
    styles.width = '100%';
    styles.display = 'flex';
    styles.flexDirection = 'column';
    
    switch (alignment.value) {
        case 'center':
            styles.alignItems = 'center';
            break;
        case 'right':
            styles.alignItems = 'flex-end';
            break;
        case 'left':
        default:
            styles.alignItems = 'flex-start';
            break;
    }
    
    return styles;
};

const getImageStyle = (): Record<string, string> => {
    const styles: Record<string, string> = {};
    
    // Set width based on size relative to the editor width
    switch (size.value) {
        case 'small':
            styles.width = '25%';
            styles.maxWidth = '200px';
            break;
        case 'medium':
            styles.width = '50%';
            styles.maxWidth = '400px';
            break;
        case 'large':
            styles.width = '75%';
            styles.maxWidth = '600px';
            break;
        case 'full':
            styles.width = '100%';
            break;
        case 'original':
            styles.width = 'auto';
            styles.maxWidth = '100%';
            break;
        default:
            styles.width = '50%';
            styles.maxWidth = '400px';
            break;
    }
    
    // Ensure image is responsive
    styles.height = 'auto';
    styles.display = 'block';
    
    return styles;
};

const getCaptionStyle = (): Record<string, string> => {
    const styles: Record<string, string> = {};
    
    // Align caption with the image
    switch (alignment.value) {
        case 'center':
            styles.textAlign = 'center';
            break;
        case 'right':
            styles.textAlign = 'right';
            break;
        case 'left':
        default:
            styles.textAlign = 'left';
            break;
    }
    
    return styles;
};

const updateCaption = (event: Event) => {
    const newCaption = (event.target as HTMLElement).textContent || '';
    props.updateAttributes({ caption: newCaption });
};

const handleCaptionKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        // Exit caption editing
        (event.target as HTMLElement).blur();
    }
};

const handleCaptionBlur = () => {
    // Update caption when losing focus
    const newCaption = captionRef.value?.textContent || '';
    props.updateAttributes({ caption: newCaption });
};

const addCaption = async () => {
    props.updateAttributes({ caption: 'Enter caption here' });
    await nextTick();
    if (captionRef.value) {
        captionRef.value.focus();
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(captionRef.value);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
    }
};
</script>

<style scoped>
.custom-image-figure {
    margin: 1rem 0;
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    position: relative;
}

.custom-editor-image {
    height: auto;
    border-radius: var(--theme--border-radius);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    object-fit: contain;
    display: block;
}

.custom-editor-image:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.custom-image-caption {
    margin: 0.5rem 0 0 0;
    font-size: 0.875rem;
    font-style: italic;
    color: var(--theme--foreground-subdued);
    border: none;
    outline: none;
    padding: 4px;
    border-radius: var(--theme--border-radius);
    transition: background-color 0.2s ease;
    direction: ltr !important;
    text-align: left !important;
    writing-mode: horizontal-tb !important;
    unicode-bidi: normal !important;
    min-height: 1.2em;
    width: fit-content;
    max-width: 100%;
}

.custom-image-caption:focus {
    background-color: var(--theme--background-normal);
    outline: 2px solid var(--theme--primary);
}

.custom-image-caption:empty::before {
    content: attr(placeholder);
    color: var(--theme--foreground-subdued);
    opacity: 0.7;
}

.add-caption-placeholder {
    margin: 0.5rem 0 0 0;
    font-size: 0.875rem;
    font-style: italic;
    color: var(--theme--foreground-subdued);
    text-align: left;
    padding: 4px;
    cursor: pointer;
    border-radius: var(--theme--border-radius);
    transition: background-color 0.2s ease;
    opacity: 0.7;
    border: 2px dashed var(--theme--border-color);
    width: fit-content;
    max-width: 100%;
}

.add-caption-placeholder:hover {
    background-color: var(--theme--background-normal);
    opacity: 1;
}

/* Node selection styles */
.ProseMirror-selectednode .custom-image-figure {
    outline: 2px solid var(--theme--primary);
    outline-offset: 2px;
    border-radius: var(--theme--border-radius);
}

/* Ensure the figure inherits the editor's full width */
.ProseMirror .custom-image-figure {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box;
}

/* Size classes for debugging */
.size-small .custom-editor-image {
    width: 25% !important;
    max-width: 200px !important;
}

.size-medium .custom-editor-image {
    width: 50% !important;
    max-width: 400px !important;
}

.size-large .custom-editor-image {
    width: 75% !important;
    max-width: 600px !important;
}

.size-full .custom-editor-image {
    width: 100% !important;
}

.size-original .custom-editor-image {
    width: auto !important;
    max-width: 100% !important;
}

/* Alignment classes */
.align-center {
    text-align: center !important;
}

.align-right {
    text-align: right !important;
}

.align-left {
    text-align: left !important;
}
</style> 