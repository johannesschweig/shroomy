<template>
  <div class="bg-tan-900 text-white ">
    <div class="max-w-7xl mx-auto px-4 py-12 xl:px-0 grid grid-cols-1 md:grid-cols-3 gap-y-6">
      <div>
        <div class="flex gap-2 mb-4">
          <img src="/mushroom.png" alt="Fungio Logo" class="w-8 h-8 inline-block text-tan-100" />
          <div class="text-lg font-bold font-serif">Fungio</div>
        </div>
        <div class="text-tan-300 text-sm">Schnelle und einfache Pilzsuche</div>
      </div>

      <div class="text-sm flex gap-4 flex-col">
        <div class="font-bold">Entdecken</div>
        <NuxtLink to="/" class="link-dark block">Pilzsuche</NuxtLink>
        <NuxtLink to="/all" class="link-dark block">Alle Pilze nach Alphabet</NuxtLink>
        <NuxtLink to="/season" class="link-dark block">Pilze nach Saison</NuxtLink>
        <NuxtLink to="/top-edible" class="link-dark block">Die 10 besten Speisepilze</NuxtLink>
        <NuxtLink to="/region" class="link-dark block">Pilze nach Region</NuxtLink>
      </div>

      <div class="text-sm flex gap-4 flex-col">
        <div class="font-bold">Rechtliches</div>
        <NuxtLink to="/disclaimer" class="link-dark block">Haftungsauschluss</NuxtLink>
      </div>
    </div>
  </div>
</template>