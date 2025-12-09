<script setup lang="ts">
const title = 'Haftungsausschluss - Fungio'
const description = 'Wichtige rechtliche Hinweise zur Nutzung von Fungio. Bitte vor der Pilzbestimmung lesen.'
const image = 'https://fungio.de/mushroom.png'
const url = 'https://fungio.de/disclaimer'

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
  ]
})
</script>

<template>
  <div class="max-w-xl mx-auto">
    <NuxtLink to="/" class="btn btn-secondary w-fit mb-2">Zurück</NuxtLink>
    <div class="text-xl mb-2">Haftungsauschluss</div>
    <p>Die auf dieser Website und in der App zur Verfügung gestellten Informationen zur Pilzbestimmung dienen
      ausschließlich allgemeinen Informationszwecken und erfolgen nach bestem Wissen und Gewissen. Es wird keine Gewähr
      für die Richtigkeit, Vollständigkeit, Aktualität oder Qualität der bereitgestellten Inhalte übernommen. Die
      Nutzung der Informationen erfolgt ausdrücklich auf eigene Gefahr.</p>
    <p>Insbesondere wird darauf hingewiesen, dass sich Pilzmerkmale örtlich und zeitlich unterscheiden können und
      Fehldiagnosen nicht ausgeschlossen werden können. Vor dem Verzehr eines Pilzes ist immer eine fachkundige
      Kontrolle durch einen geprüften Pilzsachverständigen empfohlen.</p>
    <p>Eine Haftung für materielle oder gesundheitliche Schäden, die aus der Nutzung der über die Website und App
      bereitgestellten Informationen entstehen, ist ausgeschlossen – es sei denn, es liegt ein nachweislich
      vorsätzliches oder grob fahrlässiges Verschulden seitens des Betreibers vor.</p>
    <p>Die Website enthält ggf. Links zu externen Seiten Dritter. Für deren Inhalte wird keine Haftung übernommen.</p>
  </div>
</template>