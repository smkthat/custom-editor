<template>
  <ToolButton :title :icon :disabled :active="fullscreen" :action="toggleFullscreen" />
</template>

<script setup lang="ts">
  import { computed, inject } from 'vue';
  import type { CustomToolButtonProps } from '../../types';
  import type { Ref } from 'vue';

  import ToolButton from '../../components/ToolButton.vue';

  const props = defineProps<CustomToolButtonProps>();

  const fullscreen = inject('fullscreen') as Ref;

  function toggleFullscreen() {
    fullscreen.value = !fullscreen.value;
    props.editor.chain().focus();
  }

  const icon = computed(() => (fullscreen.value ? 'fullscreen_exit' : 'fullscreen'));
</script>
