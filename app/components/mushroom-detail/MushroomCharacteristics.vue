<script setup lang="ts">
import type Shroom from '@/types/Shroom'
import { toHexColor } from '@/utils/utils'

const props = defineProps<{ shroom: Shroom }>()
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-xl font-serif font-bold text-tan-900 flex items-center gap-2">
      <span>Bestimmungsmerkmale</span>
    </h2>

    <div class="space-y-8">
      <div v-if="shroom.cap_color" class="flex gap-4 group">
        <div class="w-1 rounded-full bg-tan-200 shrink-0"></div>
        <div>
          <h3 class="font-bold text-tan-900 text-lg mb-1">Hut</h3>
          <p class="text-tan-600 leading-relaxed">
            Der <strong>{{ shroom.size_from }}–{{ shroom.size_to }} cm</strong> breite Hut ist
            <strong>{{shroom.cap_color.map(c => $t(c)).join('-')}}</strong> gefärbt.
            <span v-if="shroom.cap_shape">Die Form ist meist {{shroom.cap_shape.map(s => $t(s)).join(', ')}}.</span>
            <span v-if="shroom.traits?.includes('hygrophanous')"> Er ist hygrophan (Die Hutfarbe ändert sich bei
              Feuchtigkeit).</span>
          </p>
        </div>
      </div>

      <div v-if="shroom.gills_color" class="flex gap-4">
        <div class="w-1 rounded-full bg-tan-200 shrink-0"></div>
        <div>
          <h3 class="font-bold text-tan-900 text-lg mb-1">
            {{ shroom.type?.includes('poroid') ? 'Röhren' :
                shroom.type?.includes('gilled') ? 'Lamellen' : 'Unterseite'
            }}
          </h3>
          <p class="text-tan-600 leading-relaxed">
            Die Unterseite zeigt Farben von <strong>{{shroom.gills_color.map(c => $t(c)).join('/')}}</strong>.
            <span v-if="shroom.gills_attachment">Sie sind {{shroom.gills_attachment.map(a => $t(a)).join(', ')
            }}.</span>
          </p>
        </div>
      </div>

      <div v-if="shroom.stem_color" class="flex gap-4">
        <div class="w-1 rounded-full bg-tan-200 shrink-0"></div>
        <div>
          <h3 class="font-bold text-tan-900 text-lg mb-1">Stiel</h3>
          <p class="text-tan-600 leading-relaxed">
            Der Stiel ist <strong>{{shroom.stem_color.map(c => $t(c)).join('-')}}</strong>.
            <span v-if="shroom.stem_traits">Besondere Merkmale: {{shroom.stem_traits.map(t => $t(t)).join(', ')
            }}.</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>