<script setup lang="ts">
import { onMounted, watch, ref, computed } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { useStore } from '@/stores/store'
import type Shroom from '@/types/Shroom'
import { GERMAN_MONTHS, getMushroomIcon, toHexColor, getNested } from '@/utils'
import PoroidIcon from '@/assets/poroid.svg'
import GilledIcon from '@/assets/gills.svg'
import CapIcon from '@/assets/cap.svg'
import GillsColorIcon from '@/assets/gill-color.svg'
import StemIcon from '@/assets/stem.svg'
import FleshIcon from '@/assets/flesh.svg'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const store = useStore()
const { t } = useI18n()


const shroom = ref<Shroom | null>(null)

onMounted(() => {
  setTimeout(() => {
    shroom.value = store.shrooms.find(s => s['taxon_id'] === Number(route.params.id)) || null
  }, 500)
})

onBeforeRouteLeave(async (_to, _from) => {
  shroom.value = null
})

watch(() => route.params.id, () => {
  if (route.params.id) {
    setTimeout(() => {
      shroom.value = store.shrooms.find(s => s['taxon_id'] === Number(route.params.id)) || null
    }, 500)
  }
})

const seasonText = computed(() => {
   if (!shroom.value) return '';
  const from = GERMAN_MONTHS[shroom.value.season.from - 1];
  const to = GERMAN_MONTHS[shroom.value.season.to - 1];
  return `Von ${from} bis ${to}`;
})

const sizeText = computed(() => {
  if (!shroom.value) return ''
  return `${shroom.value.size.min_diameter_cm}–${shroom.value.size.max_diameter_cm} cm`
})

function joinAttr(attr: string[] | null | undefined) {
  return attr?.join(', ') || '-'
}

const iconData = computed(() => shroom.value ? getMushroomIcon(shroom.value) : { icon: null, class: '', text: '' })

function svgStyle(attr: string) {
  const value = getNested(shroom.value, attr)
  return {
    '--primary': toHexColor(Array.isArray(value) ? value[0] : value), // selected color
    '--secondary': '#78716c', // grey: bg-stone-500
  }
}
</script>

<template>
  <div v-if="shroom" class="max-w-xl mx-auto p-4 flex flex-col gap-4">
    <router-link to="/" class="btn btn-secondary w-fit">
      Zurück
    </router-link>
    <h1 class="text-3xl font-bold">{{ shroom.name.de[0] }}</h1>
    <h2 class="text-lg text-stone-600 italic">{{ shroom.taxon_name }}</h2>

    <img :src="shroom.photo_url.replace('square', 'medium') || shroom.image" :alt="shroom.name.de[0]"
      class="object-cover rounded-lg shadow-md md:aspect-3/2" />

    <div class="flex gap-2 flex-wrap">
      <!-- edibility/toxicity -->
      <div class="p-3 rounded-lg bg-stone-200 flex w-fit gap-2 items-center">
        <component v-if="iconData.icon" :is="iconData.icon" :class="iconData.class" class="w-8 h-8" />
        {{ iconData.text }}
      </div>

      <!-- poroid or gilled -->
      <div class="p-3 rounded-lg bg-stone-200 flex w-fit gap-2 items-center">
        <PoroidIcon v-if="shroom.traits.includes('poroid')" class="w-8 h-8" />
        <GilledIcon v-if="shroom.traits.includes('gilled')" class="w-8 h-8" />
        <div>{{ shroom.traits.includes('gilled') ? 'Lamellen' : shroom.traits.includes('poroid') ? 'Poren' :
          'Andere Gattung' }}</div>
      </div>

      <!-- milky -->
      <div v-if="shroom.traits.includes('milky')" class="p-3 rounded-lg bg-stone-200 flex w-fit gap-2 items-center">
        Milchend
      </div>
    </div>

    <div class="text-xl mt-6 text-stone-800">Details</div>
    <div class="flex flex-col gap-3 text-stone-700">
      <!-- Cap -->
      <div class="mb-4">
        <div class="text-lg">Hut</div>
        <div class="flex items-center gap-2 mb-2">
          <CapIcon class="w-8 h-8" :style="svgStyle('cap.color')" />
          {{shroom.cap.color.map(c => t(c)).join(', ')}}
        </div>
        <div class="text-sm">Form: {{shroom.cap.shape.map(s => t(s)).join(', ')}} {{
          shroom.traits.includes('grooved_cap') ? t('grooved_cap') : '' }}</div>
      </div>
      <!-- Gills -->
      <div class="mb-4">
        <div class="text-lg">Lamellen</div>
        <div class="flex items-center gap-2 mb-2">
          <GillsColorIcon class="w-8 h-8" :style="svgStyle('gills.color')" />
          {{shroom.gills.color.map(c => t(c)).join(', ')}}
        </div>
        <div class="text-sm">{{shroom.gills.attachment?.map(s => t(s)).join(', ')}}
          {{ shroom.traits.includes('crowded_gills') ? t('crowded_gills') : '' }}
          {{ shroom.traits.includes('sawtooth_gills') ? t('sawtooth_gills') : '' }}
          {{ shroom.traits.includes('forked_gills') ? t('forked_gills') : '' }}
        </div>
        <div class="text-sm">
          Sporenpulverfarbe: {{shroom.spore_color.map(s => t(s)).join(', ')}}
        </div>
      </div>
      <!-- Stem -->
      <div class="mb-4">
        <div class="text-lg">Stiel</div>
        <div class="flex items-center gap-2 mb-2">
          <div v-if="shroom.stem" class="flex items-center gap-2">
            <StemIcon class="w-8 h-8" :style="svgStyle('stem.color')" />
            {{shroom.stem.color.map(c => t(c)).join(', ')}}
          </div>
        </div>
        <div class="text-sm flex gap-1">
          <!-- TODO this leads to empty space as every trait is rendered -->
          <span
            v-for='trait in ["ring", "brittle_stem", "bulbous_base", "fibrous", "netted_stem", "scaly", "speckled_stem", "hollow_stem"]'
            class="capitalize" :key="trait">
            {{ shroom.traits.includes(trait) ? t(trait) : '' }}
          </span>
        </div>
      </div>
      <!-- Flesh -->
      <div class="mb-4">
        <div class="text-lg">Fleisch</div>
        <div class="flex items-center gap-2">
          <FleshIcon class="w-8 h-8" :style="svgStyle('flesh.color')" />
          {{shroom.flesh.color.map(c => t(c)).join(', ')}}
        </div>
        <div class="flex items-center gap-2">
          <FleshIcon class="w-8 h-8" :style="svgStyle('flesh.bruising_color')" />
          Verfärbung:<br />{{shroom.flesh.bruising_color?.map(c => t(c)).join(', ')}}
        </div>
      </div>
      <!-- Smell -->
      <div class="mb-4" v-if="shroom.smell.length">
        <div class="text-lg">Geruch</div>
        <div>
          {{shroom.smell.map(c => t(c)).join(', ')}}
        </div>
      </div>
      <!-- Taste -->
      <div class="mb-4">
        <div class="text-lg">Geschmack</div>
        <div>
          {{shroom.taste?.map(c => t(c)).join(', ')}}
        </div>
      </div>
      <!-- Habitat -->
      <div class="mb-4">
        <div class="text-lg">Lebensraum</div>
        <div>
          {{shroom.habitat.map(c => t(c)).join(', ')}}
        </div>
      </div>
      <!-- Season -->
      <div class="mb-4">
        <div class="text-lg">Jahreszeit</div>
        <div>
          {{ seasonText }}
        </div>
      </div>
      <!-- Size -->
      <div class="mb-4">
        <div class="text-lg">Größe</div>
        <div>
          {{ sizeText }}
        </div>
      </div>
      <!-- Further details -->
      <div class="mb-4">
        <div class="text-lg">Weitere Merkmale</div>
        <!-- TODO this leads to empty space as every trait is rendered -->
        <div class="text-sm flex gap-1">
          <span v-for='trait in ["tufted", "hygrophanous", "rooting_base", "slimy"]' class="capitalize" :key="trait">
            {{ shroom.traits.includes(trait) ? t(trait) : '' }}
          </span>
        </div>
      </div>
    </div>

    <a :href="shroom.url" target="_blank" class="mt-4 text-amber-600 underline">
      Mehr Details auf 123Pilzsuche
    </a>
  </div>

  <div v-else class="text-center p-8 text-stone-500">
    Pilz nicht gefunden
  </div>
</template>