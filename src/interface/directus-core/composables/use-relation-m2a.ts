// Based on https://github.com/directus/directus/blob/main/app/src/composables/use-relation-m2a.ts

import { useStores } from '@directus/extensions-sdk';
import { computed, Ref } from 'vue';
import type { Field, Relation } from '@directus/types';

import { Collection } from '../types/collections';

export type RelationM2A = {
  allowedCollections: Collection[];
  relationPrimaryKeyFields: Record<string, Field>;
  collectionField: Field;
  junctionCollection: Collection;
  junctionPrimaryKeyField: Field;
  junctionField: Field;
  reverseJunctionField: Field;
  junction: Relation;
  relation: Relation;
  sortField?: string;
  type: 'm2a';
};

/*
One1              Many|Any: junctionCollection          ┌─One2
┌─────────┐       ┌─────────────────────────────┐       │ ┌─────────┐
│id       ├───┐   │id: junctionPKField          │    ┌──┼─┤id       │
│many     │   └──►│one1_id: reverseJunctionField│    │  │ │         │
└─────────┘       │item: junctionField          │◄───┤  │ └─────────┘
                  │sort: sortField              │    │  │
                  │collection: collectionField  │◄───┼──┤
                  └─────────────────────────────┘    │  │
                                                     │  └─One3
                AllowedCollection: [One2,One3]		   │    ┌─────────┐
                relatedPKFields: {One2: id,One3: id} └────┤id       │
                                                          │         │
                                                          └─────────┘
 */

export function useRelationM2A(collection: Ref<string>, field: Ref<string>) {
  const { useCollectionsStore, useFieldsStore, useRelationsStore } = useStores();

  const relationsStore = useRelationsStore();
  const collectionsStore = useCollectionsStore();
  const fieldsStore = useFieldsStore();

  const relationInfo = computed<RelationM2A | undefined>(() => {
    const relations = relationsStore.getRelationsForField(collection.value, field.value);

    const junction = relations.find(
      (relation: Relation) =>
        relation.related_collection === collection.value &&
        relation.meta?.one_field === field.value &&
        relation.meta.junction_field
    );

    if (!junction) return undefined;

    const relation = relations.find(
      (relation: Relation) =>
        relation.collection === junction.collection && relation.field === junction.meta?.junction_field
    );

    if (!relation) return undefined;

    const allowedCollections = (relation.meta?.one_allowed_collections ?? []).reduce(
      (acc: Collection[], collection: Collection) => {
        const collectionInfo = collectionsStore.getCollection(collection);
        if (collectionInfo) acc.push(collectionInfo);
        return acc;
      },
      [] as Collection[]
    );

    const relationPrimaryKeyFields = allowedCollections.reduce((acc: Record<string, Field>, collection: Collection) => {
      const pkField = fieldsStore.getPrimaryKeyFieldForCollection(collection?.collection);
      if (pkField) acc[collection.collection] = pkField;
      return acc;
    }, {});

    return {
      allowedCollections,
      relationPrimaryKeyFields,
      collectionField: fieldsStore.getField(junction.collection, relation.meta?.one_collection_field as string),
      junctionCollection: collectionsStore.getCollection(junction.collection),
      junctionPrimaryKeyField: fieldsStore.getPrimaryKeyFieldForCollection(junction.collection),
      junctionField: fieldsStore.getField(junction.collection, junction.meta?.junction_field as string),
      reverseJunctionField: fieldsStore.getField(junction.collection, relation.meta?.junction_field as string),
      junction: junction,
      relation: relation,
      sortField: junction.meta?.sort_field ?? undefined,
      type: 'm2a',
    } as RelationM2A;
  });

  return { relationInfo };
}
