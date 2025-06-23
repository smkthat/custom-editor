import type { RelationNodeSerializers } from '../types';
import type { Component } from 'vue';

export type * from 'tiptap-render-view/vue';

export type * from '../types';
export type VueRelationNodeSerializers = RelationNodeSerializers<Component>;

// TODO: [Stage 2][deprecated] type VueRelationBlockSerializers
export type VueRelationBlockSerializers = VueRelationNodeSerializers;
