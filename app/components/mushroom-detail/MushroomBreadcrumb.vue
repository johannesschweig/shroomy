<script setup>
import { supabase } from '~/supabase'

const props = defineProps({
  // reich, stamm, unterstamm, klasse, unterklasse, ordnung, familie, unterfamilie, gattung, sektion, untersektion, komplex (spezies)
  ancestry: {
    type: String,
    default: ""
  }
});

const sortedTaxa = ref([]);

const fetchTaxaChain = async () => {
  if (!props.ancestry) return;

  const ids = props.ancestry.split('/').map(id => parseInt(id)).filter(id => !isNaN(id)).slice(4);

  if (ids.length === 0) return;

  try {
    const { data, error } = await supabase
      .from('taxa')
      .select('id, name, preferred_common_name, rank_level')
      .in('id', ids);

    if (error) throw error;

    if (data) {
      sortedTaxa.value = ids.map(id => data.find(t => t.id === id)).filter(t => t.rank_level === 20 || t.rank_level === 10 || t.rank_level === 30 || t.rank_level === 40);
    }
  } catch (err) {
    console.error("Fehler beim Laden der Taxonomie:", err);
  }
};

onMounted(() => {
  fetchTaxaChain();
});

watch(() => props.ancestry, () => {
  fetchTaxaChain();
});
</script>

<template>
  <nav v-if="sortedTaxa.length > 0" class="flex items-center overflow-x-auto no-scrollbar text-sm">
    <ol class="flex md:items-center whitespace-nowrap flex-col md:flex-row">
      <li v-for="(taxon, index) in sortedTaxa" :key="taxon.id" class="flex items-center">
        <span v-if="index > 0" class="mx-2 text-tan-400 select-none">/</span>

        <!-- <NuxtLink :to="`/taxa/${taxon.id}`" class="group flex flex-col transition-colors link"> -->
        <span class="text-tan-600">
          {{ taxon.preferred_common_name || taxon.name }}
        </span>
      </li>
    </ol>
  </nav>
</template>