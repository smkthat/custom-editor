<template>
  <v-icon
    v-if="duplicationWarning"
    name="warning"
    class="warning"
    v-tooltip="t('duplication_warning')"
    left
    @click.stop
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { M2AStoreItem } from '../composables/use-m2a-store';
  import type { UUID } from '../types';

  import { useI18nFallback } from '../composables/use-i18n-fallback';
  import { useM2aStore } from '../composables/use-m2a-store';

  interface Props {
    nodeId: UUID;
  }
  const props = defineProps<Props>();

  const { t } = useI18nFallback(useI18n());

  const m2aStore = useM2aStore();
  const duplicationWarning = computed(() => {
    const itemInStore = (item: M2AStoreItem) => item.nodeId === props.nodeId;
    const storeItem = m2aStore.state.value.find(itemInStore);
    return !!storeItem?.duplicationWarning;
  });
</script>

<style scoped>
  .warning {
    --v-icon-color: var(--theme--warning, var(--warning));
  }

  .warning:hover {
    --v-icon-color: var(--theme--warning-accent, var(--warning-110));
  }
</style>
