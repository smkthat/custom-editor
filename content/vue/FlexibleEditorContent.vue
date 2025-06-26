<template>
  <RenderNodes
    v-if="content"
    :content="content"
    :serializers="serializers"
    :componentSerializers="componentSerializers"
  />
</template>

<script setup lang="ts">
  import { Mark, Node } from '@tiptap/core';
  import RenderNodes from 'tiptap-render-view/vue';
  import type { Extensions, JSONContent, VueComponentSerializers, VueRelationNodeSerializers } from './types';

  import extensions from '../../shared/extensions';

  const props = defineProps<{
    content: JSONContent;
    serializers?: Extensions;
    componentSerializers?: VueComponentSerializers;
    relationBlocks?: VueRelationNodeSerializers;
    relationInlineBlocks?: VueRelationNodeSerializers;
    relationMarks?: VueRelationNodeSerializers;
  }>();

  // `.slice(0)` to clone the extensions array
  const serializers = props.serializers ?? extensions.slice(0) ?? [];

  const relationBlockSerializer = Node.create({
    name: 'relation-block',
    renderHTML({ node, HTMLAttributes }) {
      if (props.relationBlocks) {
        for (const { collection, component } of props.relationBlocks) {
          if (HTMLAttributes.collection == collection) return [component, HTMLAttributes, 0] as any;
        }
      }

      return [node.type, HTMLAttributes, 0] as any;
    },
  });

  const relationInlineBlockSerializer = Node.create({
    name: 'relation-inline-block',
    renderHTML({ node, HTMLAttributes }) {
      if (props.relationInlineBlocks) {
        for (const { collection, component } of props.relationInlineBlocks) {
          if (HTMLAttributes.collection == collection) return [component, HTMLAttributes, 0] as any;
        }
      }

      return [node.type, HTMLAttributes, 0] as any;
    },
  });

  const relationMarkSerializer = Mark.create({
    name: 'relation-mark',
    renderHTML({ HTMLAttributes }) {
      if (props.relationMarks) {
        for (const { collection, component } of props.relationMarks) {
          if (HTMLAttributes.collection == collection) return [component, HTMLAttributes, 0] as any;
        }
      }

      return ['span', HTMLAttributes, 0] as any;
    },
  });

  serializers.push(relationBlockSerializer);
  serializers.push(relationInlineBlockSerializer);
  serializers.push(relationMarkSerializer);
</script>
