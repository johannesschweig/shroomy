<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/stores/store'
import { GERMAN_MONTHS, getMushroomIcon, toHexColor, getNested, getInaturalistImageUrl, capitalizeFirstLetter } from '@/utils'
import PoroidIcon from '@/assets/poroid.svg'
import GilledIcon from '@/assets/gills.svg'
import CapIcon from '@/assets/cap.svg'
import GillsColorIcon from '@/assets/gill-color.svg'
import StemIcon from '@/assets/stem.svg'
import FleshIcon from '@/assets/flesh.svg'
import { useI18n } from 'vue-i18n'
import MushroomImage from '@/components/MushroomImage.vue'
import router from '@/router'
import Card from '@/components/Card.vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import ChevronIcon from '@/assets/chevron.svg'
import { useMushroomById, useMushroomLookAlikes } from '@/graphql/composables'

const route = useRoute()
const store = useStore()
const { t } = useI18n()

defineOptions({
  name: 'MushroomDetail'
})
const id = ref(Number(route.params.id))
const { shroom } = useMushroomById(id)

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

// change tab title
watch(
  () => shroom.value,
  (newShroom) => {
    if (newShroom) {
      document.title = newShroom.preferred_common_name ? 
      newShroom.preferred_common_name : capitalizeFirstLetter(newShroom.name)
    }
  },
  { immediate: true }
)

// reset x scroll pos of mobile scroll container
watch(() => id, () => {
  if (mobileScrollContainer.value) {
    mobileScrollContainer.value.scrollLeft = 0
  }
})

const iconData = computed(() => shroom.value ? getMushroomIcon(shroom.value) : { icon: null, class: '', text: '' })
const currentMonth = computed(() => new Date().getMonth() + 1)

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
</script>

<template>
  <div v-if="shroom" class="max-w-xl mx-auto flex flex-col gap-4">
    <router-link to="/" class="btn btn-secondary w-fit">
      Zurück
    </router-link>
    <h1 class="text-3xl font-bold">{{ shroom.preferred_common_name }}</h1>
    <h2 class="text-lg text-stone-600 italic flex gap-1">
      <button class="cursor-pointer hover:underline hover:text-stone-800 capitalize" @click="searchGenus()">{{ shroom.name.split(' ')[0] }}</button>
      <span>{{ shroom.name.split(' ').slice(1)[0] }}</span>
    </h2>

    <VueEasyLightbox :visible="lightboxVisible" :imgs="images" :index="currentIndex" @hide="lightboxVisible = false" />

    <div v-if="shroom.photos && shroom.photos.length">
      <!-- Mobile image area -->
      <div ref="mobileScrollContainer" class="flex md:hidden flex-row overflow-x-auto w-screen gap-x-2 pr-2">
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
        <div>{{ shroom.type.includes('gilled') ? 'Lamellen' : shroom.type.includes('poroid') ? 'Poren' :
          'Andere Gattung' }}</div>
      </div>

      <!-- milky -->
      <div v-if="shroom.gills_traits && shroom.gills_traits.includes('milky')"
        class="p-3 rounded-lg bg-stone-200 flex w-fit gap-2 items-center">
        Milchend
      </div>

      <!-- frequency -->
      <div v-if="shroom.observations_count" class="p-3 rounded-lg bg-stone-200 flex w-fit gap-2 items-center" :title="String(shroom.observations_count)">
        {{ shroom.observations_count < 100 ? 'Sehr selten' : shroom.observations_count < 500 ? 'Selten' :
          shroom.observations_count < 2500 ? 'Häufig' : 'Sehr häufig' }} </div>
      </div>

      <div v-if="shroom.id_123" class="text-xl mt-6 text-stone-800">Details</div>
      <div class="flex flex-col gap-3 text-stone-700">
        <!-- Cap -->
        <div v-if="shroom.cap_color" class="mb-4">
          <div class="text-lg">Hut</div>
          <div class="flex items-center gap-2 mb-2">
            <CapIcon class="w-8 h-8" :style="svgStyle('cap_color')" />
            {{shroom.cap_color.map(c => t(c)).join(', ')}}
          </div>
          <div v-if="shroom.cap_shape" class="text-sm">Form: {{shroom.cap_shape.filter(e => e != 'other').map(s =>
            t(s)).join(', ')}}</div>
        </div>
        <!-- Gills -->
        <div v-if="shroom.gills_color" class="mb-4">
          <div class="text-lg">Lamellen</div>
          <div v-if="shroom.gills_color" class="flex items-center gap-2 mb-2">
            <GillsColorIcon class="w-8 h-8" :style="svgStyle('gills_color')" />
            {{shroom.gills_color.map(c => t(c)).join(', ')}}
          </div>
          <div class="text-sm">{{shroom.gills_attachment?.map(s => t(s)).join(', ')}}
            {{shroom.gills_traits?.map(s => t(s)).join(', ')}}
          </div>
          <div v-if="shroom.spore_color" class="text-sm">
            Sporenpulverfarbe: {{shroom.spore_color.map(s => t(s)).join(', ')}}
          </div>
        </div>
        <!-- Stem -->
        <div v-if="shroom.stem_color" class="mb-4">
          <div class="text-lg">Stiel</div>
          <div class="flex items-center gap-2 mb-2">
            <div v-if="shroom.stem_color" class="flex items-center gap-2">
              <StemIcon class="w-8 h-8" :style="svgStyle('stem_color')" />
              {{shroom.stem_color.map(c => t(c)).join(', ')}}
            </div>
          </div>
          <div class="text-sm flex gap-1">
            <span v-for='trait in shroom.stem_traits' class="capitalize" :key="trait">
              {{ t(trait) }}
            </span>
          </div>
        </div>
        <!-- Flesh -->
        <div v-if="shroom.flesh_color" class="mb-4">
          <div class="text-lg">Fleisch</div>
          <div class="flex items-center gap-2">
            <FleshIcon class="w-8 h-8" :style="svgStyle('flesh_color')" />
            {{shroom.flesh_color.map(c => t(c)).join(', ')}}
          </div>
          <div v-if="shroom.flesh_bruising_color" class="flex items-center gap-2">
            <FleshIcon class="w-8 h-8" :style="svgStyle('flesh_bruising_color')" />
            Verfärbung:<br />{{shroom.flesh_bruising_color?.map(c => t(c)).join(', ')}}
          </div>
        </div>
        <!-- Smell -->
        <div class="mb-4" v-if="shroom.smell">
          <div class="text-lg">Geruch</div>
          <div>
            {{shroom.smell.map(c => t(c)).join(', ')}}
          </div>
        </div>
        <!-- Taste -->
        <div v-if="shroom.taste" class="mb-4">
          <div class="text-lg">Geschmack</div>
          <div>
            {{shroom.taste.map(c => t(c)).join(', ')}}
          </div>
        </div>
        <!-- Habitat -->
        <div v-if="shroom.habitat" class="mb-4">
          <div class="text-lg">Lebensraum</div>
          <div>
            {{shroom.habitat.map(c => t(c)).join(', ')}}
          </div>
        </div>
        <!-- Season -->
        <div v-if="shroom.season_from && shroom.season_to" class="mb-4">
          <div class="text-lg">Jahreszeit</div>
          <div class="flex flex-wrap gap-1">
            <div v-for="i in 12" class="w-8 h-8 rounded-lg text-sm text-center leading-8 relative"
            :class='[i >= shroom.season_from && i <= shroom.season_to ? "bg-amber-300 text-stone-800 " : "bg-stone-100 text-stone-600",
            i === currentMonth ? "border border-stone-600" : ""]' :key="i">
              {{ GERMAN_MONTHS[i - 1].slice(0, 3) }}
              <ChevronIcon v-if="i === currentMonth" class="text-stone-800 w-1.5 h-1.5 absolute bottom-0 left-3"/>
            </div>

          </div>
        </div>
        <!-- Size -->
        <div v-if="shroom.size_from && shroom.size_to" class="mb-4">
          <div class="text-lg">Größe</div>
          <div>
            {{ `${shroom.size_from}–${shroom.size_to} cm` }}
          </div>
        </div>
        <!-- Further details -->
        <div v-if="shroom.traits" class="mb-4">
          <div class="text-lg">Weitere Merkmale</div>
          <div class="text-sm flex gap-1">
            <span v-for='trait in shroom.traits' class="capitalize" :key="trait">
              {{ t(trait) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Look alikes -->
      <div v-if="shroom.look_alikes">
        <div class="text-lg text-stone-700 mb-2">Verwechslungspartner</div>
        <div class="flex flex-col gap-2">
          <Card v-for="lookalike in lookAlikes" :key="lookalike.id"
            :shroom="lookalike" />
        </div>
      </div>

      <div>
        <div class="text-lg text-stone-700">Mehr Infos</div>
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

    <div v-else class="text-center p-8 text-stone-500">
      Pilz nicht gefunden
    </div>
</template>