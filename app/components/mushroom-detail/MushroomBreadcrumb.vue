<script setup>
import { supabase } from '~/supabase'
import { getTaxonUrl, TAXON_PAGE_RANKS } from '@/utils/utils'

const props = defineProps({
  // reich, stamm, unterstamm, klasse, unterklasse, ordnung, familie, unterfamilie, gattung, sektion, untersektion, komplex (spezies)
  ancestry: {
    type: String,
    default: ""
  },
  // only ancestors with a rank_level strictly above this are shown (excludes the current
  // page's own taxon from its breadcrumb when reused on a /taxa/ page)
  currentRankLevel: {
    type: Number,
    default: 0
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
      sortedTaxa.value = ids.map(id => data.find(t => t.id === id)).filter(t =>
        t &&
        t.rank_level > props.currentRankLevel &&
        (t.rank_level === 20 || t.rank_level === 10 || t.rank_level === 30 || t.rank_level === 40)
      );
    }
  } catch (err) {
    console.error("Fehler beim Laden der Taxonomie:", err);
  }
};

onMounted(() => {
  fetchTaxaChain();
});

watch(() => [props.ancestry, props.currentRankLevel], () => {
  fetchTaxaChain();
});
</script>

<template>
  <nav v-if="ancestry" class="flex items-center overflow-x-auto no-scrollbar text-sm">
    <ol class="flex md:items-center whitespace-nowrap flex-col md:flex-row">
      <li class="flex items-center">
        <NuxtLink to="/taxa" class="text-tan-600 hover:text-tan-900 hover:underline transition-colors">
          Taxonomie
        </NuxtLink>
      </li>

      <li v-for="taxon in sortedTaxa" :key="taxon.id" class="flex items-center">
        <span class="mx-2 text-tan-400 select-none">/</span>

        <NuxtLink v-if="TAXON_PAGE_RANKS.includes(taxon.rank_level)" :to="getTaxonUrl(taxon)"
          class="text-tan-600 hover:text-tan-900 hover:underline transition-colors">
          {{ taxon.preferred_common_name || taxon.name }}
        </NuxtLink>
        <span v-else class="text-tan-600">
          {{ taxon.preferred_common_name || taxon.name }}
        </span>
      </li>
    </ol>
  </nav>
</template>