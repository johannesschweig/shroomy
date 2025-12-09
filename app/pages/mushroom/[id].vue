<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import { useStore } from '@/stores/store'
import PoroidIcon from '@/assets/poroid.svg'
import GilledIcon from '@/assets/gills.svg'
import CapIcon from '@/assets/cap.svg'
import GillsColorIcon from '@/assets/gill-color.svg'
import StemIcon from '@/assets/stem.svg'
import FleshIcon from '@/assets/flesh.svg'
import MushroomImage from '@/components/MushroomImage.vue'
import Card from '@/components/Card.vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import ChevronIcon from '@/assets/chevron.svg'
import { useMushroomById, useMushroomLookAlikes } from '@/composables/composables'
import { createSlug } from '@/utils/utils'

const route = useRoute()
const router = useRouter()
const store = useStore()

defineOptions({
  name: 'MushroomDetail'
})

const id = computed(() => {
  const param = String(route.params.id)
  
  // If it contains a dash, take only the part before it
  if (param.includes('-')) {
    return Number(param.split('-')[0])
  }
  
  // Otherwise it's just a number
  return Number(param)
})

const { shroom, loading } = useMushroomById(id)

const lookAlikeIds = ref<number[]>([])
const { lookAlikes } = useMushroomLookAlikes(lookAlikeIds)

const mobileScrollContainer = ref<HTMLElement | null>(null)
const lightboxVisible = ref(false)
const currentIndex = ref(0)
const images = computed(() =>
  shroom.value?.photos?.map(p => ({
    src: getInaturalistImageUrl(p.url, "medium"),
    title: p.attribution || ''
  })) || []
)
function openLightbox(i: number) { currentIndex.value = i; lightboxVisible.value = true }

// when shroom changes, update lookAlikeIds
watch(shroom, (val) => {
  if (val?.look_alikes) {
    lookAlikeIds.value = val.look_alikes
  }
})

// on route change, change id, so shroom is refetched
watch(
  () => route.params.id,
  (newId) => {
    id.value = Number(newId)
  }
)

watch(shroom, (newShroom) => {
  if (newShroom && route.params.id) {
    const currentParam = String(route.params.id)
    const slug = createSlug(newShroom.preferred_common_name || newShroom.name)
    const newParam = `${newShroom.id}-${slug}`
    
    // Only update if the slug isn't already in the URL
    if (currentParam !== newParam) {
      navigateTo(`/mushroom/${newParam}`, { replace: true })
    }
  }
}, { immediate: true })



// reset x scroll pos of mobile scroll container
watch(() => id, () => {
  if (mobileScrollContainer.value) {
    mobileScrollContainer.value.scrollLeft = 0
  }
})

const iconData = computed(() => shroom.value ? getMushroomIcon(shroom.value) : { icon: null, class: '', text: '' })
const currentMonth = computed(() => new Date().getMonth() + 1)

function isMonthActive(month: number) {
  const from = shroom.value?.season_from ?? 1
  const to = shroom.value?.season_to ?? 12
  var months: number[] = []
  if (from <= to) {
    months = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  } else { // e.g. from 11 (nov) to 3 (mar)
    const endOfYear = Array.from({ length: 12 - from + 1 }, (_, i) => from + i);
    const startOfYear = Array.from({ length: to }, (_, i) => i + 1);
    months = [...endOfYear, ...startOfYear];
  }
  return months.includes(month);
}

function svgStyle(attr: string) {
  const value = getNested(shroom.value, attr)
  return {
    '--primary': toHexColor(Array.isArray(value) ? value[0] : value), // selected color
    '--secondary': '#78716c', // grey: bg-stone-500
  }
}

function searchGenus() {
  if (shroom.value) {
    store.setSearch(shroom.value.name.split(' ')[0])
    router.push('/')
  }
}

// SEO meta tags
const url = `https://fungio.de/mushroom/${id.value}`

const title = computed(() => {
  if (!shroom.value) return 'Pilz wird geladen... | Fungio'
  const name = shroom.value.preferred_common_name || shroom.value.name
  return `${name} - Pilzinformationen | Fungio`
})

const description = computed(() => {
  if (!shroom.value) return 'Lade Pilzinformationen...'
  const name = shroom.value.preferred_common_name || shroom.value.name
  const latinName = shroom.value.name
  const edibility = iconData.value.text
  let desc = `${name} (${latinName})`
  if (edibility) {
    desc += ` - ${edibility}`
  }
  desc += '. Detaillierte Informationen zu Merkmalen, Lebensraum und Verwechslungsgefahr.'
  // Truncate to 160 chars for meta description
  return desc.length > 160 ? desc.substring(0, 157) + '...' : desc
})

const image = computed(() => {
  if (!shroom.value?.photos?.[0]?.url) return 'https://fungio.de/mushroom.png'
  return getInaturalistImageUrl(shroom.value.photos[0].url, 'medium')
})

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogUrl: url,
  ogImage: image,
  ogType: 'article'
})
</script>

<template>
  <div v-if="shroom" class="max-w-xl mx-auto flex flex-col gap-4">
    <NuxtLink to="/" class="btn btn-secondary w-fit">
      Zurück
    </NuxtLink>
    <h1 v-if="shroom.preferred_common_name" class="text-3xl font-bold">{{ shroom.preferred_common_name }}</h1>
    <component :is="shroom.preferred_common_name ? 'span' : 'h1'" class="text-lg text-stone-600 italic flex gap-1">
      <button class="cursor-pointer hover:underline hover:text-stone-800 capitalize" @click="searchGenus()">{{
        shroom.name.split(' ')[0] }}</button>
      <span>{{ shroom.name.split(' ').slice(1)[0] }}</span>
    </component>

    <VueEasyLightbox :visible="lightboxVisible" :imgs="images" :index="currentIndex" @hide="lightboxVisible = false" />

    <div v-if="shroom.photos && shroom.photos.length">
      <!-- Mobile image area -->
      <div ref="mobileScrollContainer" class="flex md:hidden flex-row overflow-x-auto w-full gap-x-2 pr-2">
        <MushroomImage v-for="(photo, index) in shroom.photos" :key="`${shroom.id}-${index}`" :shroom="shroom"
          :index="index" class="flex-shrink-0 w-64 h-48 object-cover rounded-lg cursor-pointer"
          @click="openLightbox(index)" />
      </div>
      <!-- Desktop image area -->
      <div class="hidden md:flex md:gap-4 md:h-[500px]">
        <!-- Left large image -->
        <div class="w-2/3">
          <MushroomImage :shroom="shroom" :index="0" :key="`${shroom.id}-0`" class="w-full h-full object-cover"
            @click="openLightbox(0)" />
        </div>
        <!-- Right stacked small images -->
        <div class="flex flex-col w-1/3 gap-4">
          <MushroomImage v-if="shroom.photos.length > 1" :shroom="shroom" :index="1" :key="`${shroom.id}-1`"
            class="w-full h-1/2 object-cover" @click="openLightbox(1)" />
          <MushroomImage v-if="shroom.photos.length > 2" :shroom="shroom" :index="2" :key="`${shroom.id}-2`"
            :moreImages="shroom.photos.length - 3" class="w-full h-1/2 object-cover" @click="openLightbox(2)" />
        </div>
      </div>
    </div>


    <div class="flex gap-2 flex-wrap">
      <!-- edibility/toxicity -->
      <div v-if="shroom.edibility || shroom.toxicity" class="p-3 rounded-lg bg-stone-200 flex w-fit gap-2 items-center">
        <component v-if="iconData.icon" :is="iconData.icon" :class="iconData.class" class="w-8 h-8" />
        {{ iconData.text }}
      </div>

      <!-- poroid or gilled -->
      <div v-if="shroom.type" class="p-3 rounded-lg bg-stone-200 flex w-fit gap-2 items-center">
        <PoroidIcon v-if="shroom.type.includes('poroid')" class="w-8 h-8" />
        <GilledIcon v-if="shroom.type.includes('gilled')" class="w-8 h-8" />
        <div>{{ shroom.type.includes('gilled') ? 'Lamellen' : shroom.type.includes('poroid') ? 'Röhren' :
          'Andere Gattung' }}</div>
      </div>

      <!-- milky -->
      <div v-if="shroom.gills_traits && shroom.gills_traits.includes('milky')"
        class="p-3 rounded-lg bg-stone-200 flex w-fit gap-2 items-center">
        Milchend
      </div>

      <!-- frequency -->
      <div v-if="shroom.obs_count_ger" class="p-3 rounded-lg bg-stone-200 flex w-fit gap-2 items-center"
        :title="String(shroom.obs_count_ger)">
        {{ shroom.obs_count_ger < 10 ? 'Sehr selten' : shroom.obs_count_ger < 30 ? 'Selten' : shroom.obs_count_ger < 70
          ? 'Häufig' : 'Sehr häufig' }} </div>
      </div>

      <h2 v-if="shroom.id_123" class="text-xl mt-6 text-stone-800">Details</h2>
      <div class="flex flex-col gap-3 text-stone-700">
        <!-- Cap -->
        <div v-if="shroom.cap_color" class="mb-4">
          <h3 class="text-lg">Hut</h3>
          <div class="flex items-center gap-2 mb-2">
            <CapIcon class="w-8 h-8" :style="svgStyle('cap_color')" />
            {{shroom.cap_color.map(c => $t(c)).join(', ')}}
          </div>
          <div v-if="shroom.cap_shape" class="text-sm">Form: {{shroom.cap_shape.filter(e => e != 'other').map(s =>
            $t(s)).join(', ')}}</div>
        </div>
        <!-- Gills -->
        <div v-if="shroom.gills_color" class="mb-4">
          <h3 class="text-lg">{{ shroom.type && shroom.type.includes('poroid') ? 'Röhren' : 'Lamellen' }}</h3>
          <div v-if="shroom.gills_color" class="flex items-center gap-2 mb-2">
            <GillsColorIcon class="w-8 h-8" :style="svgStyle('gills_color')" />
            {{shroom.gills_color.map(c => $t(c)).join(', ')}}
          </div>
          <div class="text-sm">{{shroom.gills_attachment?.map(s => $t(s)).join(', ')}}
            {{shroom.gills_traits?.map(s => $t(s)).join(', ')}}
          </div>
          <div v-if="shroom.spore_color" class="text-sm">
            Sporenpulverfarbe: {{shroom.spore_color.map(s => $t(s)).join(', ')}}
          </div>
        </div>
        <!-- Stem -->
        <div v-if="shroom.stem_color" class="mb-4">
          <h3 class="text-lg">Stiel</h3>
          <div class="flex items-center gap-2 mb-2">
            <div v-if="shroom.stem_color" class="flex items-center gap-2">
              <StemIcon class="w-8 h-8" :style="svgStyle('stem_color')" />
              {{shroom.stem_color.map(c => $t(c)).join(', ')}}
            </div>
          </div>
          <div class="text-sm flex gap-1">
            <span v-for='trait in shroom.stem_traits' class="capitalize" :key="trait">
              {{ $t(trait) }}
            </span>
          </div>
        </div>
        <!-- Flesh -->
        <div v-if="shroom.flesh_color" class="mb-4">
          <h3 class="text-lg">Fleisch</h3>
          <div class="flex items-center gap-2">
            <FleshIcon class="w-8 h-8" :style="svgStyle('flesh_color')" />
            {{shroom.flesh_color.map(c => $t(c)).join(', ')}}
          </div>
          <div v-if="shroom.flesh_bruising_color" class="flex items-center gap-2">
            <FleshIcon class="w-8 h-8" :style="svgStyle('flesh_bruising_color')" />
            Verfärbung:<br />{{shroom.flesh_bruising_color?.map(c => $t(c)).join(', ')}}
          </div>
        </div>
        <!-- Smell -->
        <div class="mb-4" v-if="shroom.smell">
          <h3 class="text-lg">Geruch</h3>
          <div>
            {{shroom.smell.map(c => $t(c)).join(', ')}}
          </div>
        </div>
        <!-- Taste -->
        <div v-if="shroom.taste" class="mb-4">
          <h3 class="text-lg">Geschmack</h3>
          <div>
            {{shroom.taste.map(c => $t(c)).join(', ')}}
          </div>
        </div>
        <!-- Habitat -->
        <div v-if="shroom.habitat" class="mb-4">
          <h3 class="text-lg">Lebensraum</h3>
          <div>
            {{shroom.habitat.map(c => $t(c)).join(', ')}}
          </div>
        </div>
        <!-- Season -->
        <div v-if="shroom.season_from && shroom.season_to" class="mb-4">
          <h3 class="text-lg">Jahreszeit</h3>
          <div class="flex flex-wrap gap-1">
            <div v-for="i in 12" class="w-8 h-8 rounded-lg text-sm text-center leading-8 relative" :class='[isMonthActive(i) ? "bg-amber-300 text-stone-800 " : "bg-stone-100 text-stone-600",
            i === currentMonth ? "border border-stone-600" : ""]' :key="i">
              {{ GERMAN_MONTHS[i - 1].slice(0, 3) }}
              <ChevronIcon v-if="i === currentMonth" class="text-stone-800 w-1.5 h-1.5 absolute bottom-0 left-3" />
            </div>

          </div>
        </div>
        <!-- Size -->
        <div v-if="shroom.size_from && shroom.size_to" class="mb-4">
          <h3 class="text-lg">Größe</h3>
          <div>
            {{ `${shroom.size_from}–${shroom.size_to} cm` }}
          </div>
        </div>
        <!-- Further details -->
        <div v-if="shroom.traits" class="mb-4">
          <h3 class="text-lg">Weitere Merkmale</h3>
          <div class="text-sm flex gap-1">
            <span v-for='trait in shroom.traits' class="capitalize" :key="trait">
              {{ $t(trait) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Look alikes -->
      <div v-if="shroom.look_alikes">
        <h2 class="text-lg text-stone-700 mb-2">Verwechslungspartner</h2>
        <div class="flex flex-col gap-2">
          <Card v-for="lookalike in lookAlikes.sort((a, b) => b.obs_count_ger - a.obs_count_ger)" :key="lookalike.id"
            :shroom="lookalike" />
        </div>
      </div>

      <div>
        <h2 class="text-lg text-stone-700">Mehr Infos</h2>
        <div class="flex gap-2">
          <a :href="`https://www.inaturalist.org/taxa/${shroom.id}`" target="_blank"
            class="text-amber-600 underline text-sm">
            iNaturalist
          </a>
          <a v-if="shroom.id_123" :href="`https://www.123pilzsuche.de/daten/details/${shroom.id_123}`" target="_blank"
            class="text-amber-600 underline text-sm">
            123Pilzsuche
          </a>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="text-center p-8 text-stone-500">
      Lade Pilzdaten...
    </div>
    <div v-else class="text-center p-8 text-stone-500">
      Pilz nicht gefunden
    </div>
</template>