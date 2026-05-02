<script setup lang="ts">
const regionalStats = {
  'DE-BW': { species: 2550, obs: 62475 },
  'DE-BY': { species: 2689, obs: 118227 },
  'DE-BE': { species: 2048,  obs: 56351 },
  'DE-BB': { species: 3075, obs: 65485 },
  'DE-HB': { species: 361,  obs: 2030 },
  'DE-HH': { species: 612,  obs: 4494 },
  'DE-HE': { species: 2000, obs: 49883 },
  'DE-MV': { species: 1940, obs: 25995 },
  'DE-NI': { species: 2220, obs: 51524 },
  'DE-NW': { species: 2676, obs: 56534 },
  'DE-RP': { species: 1546, obs: 24791 },
  'DE-SL': { species: 669, obs: 3374 },
  'DE-SN': { species: 1675, obs: 33922 },
  'DE-ST': { species: 1407, obs: 10949 },
  'DE-SH': { species: 2449, obs: 56862 },
  'DE-TH': { species: 1185, obs: 10252 }
} as const;

type RegionCode = keyof typeof regionalStats;

interface Props {
  regionName: string;
  regionCode: RegionCode;
  totalSpecies: number;
  totalObservations: number;
}

const props = defineProps<Props>();
const GLOBAL_TOTAL_SPECIES = 10000;

const regionDescriptions: Record<RegionCode, string> = {
  'DE-BW': 'Baden-Württemberg vereint die silikatischen Böden des Schwarzwalds mit den kalkreichen Formationen der Schwäbischen Alb, was eine vielfältige Pilzflora mit unterschiedlichen Standortansprüchen begünstigt.',
  'DE-BY': 'Bayern reicht vom Bayerischen Wald bis zu den Kalkalpen und zeigt deutliche Höhengradienten; Nadel- und Mischwälder sowie alpine Lagen bieten Lebensräume für viele Wald- und Gebirgspilze.',
  'DE-BE': 'In Berlin treffen sandige Kiefernstandorte wie im Grunewald auf innerstädtische Parks; diese Mischung ermöglicht sowohl typische Stadtpilze als auch Mykorrhiza-Arten an alten Bäumen.',
  'DE-BB': 'Brandenburg ist von sandigen, nährstoffarmen Böden und Kiefernwäldern geprägt; dort treten häufig Arten auf, die an trockene und gut durchlüftete Standorte angepasst sind.',
  'DE-HB': 'In Bremen dominieren Marschböden und urbane Grünflächen; feuchte Standorte und alte Baumbestände bieten vor allem Lebensraum für holzbewohnende Pilze.',
  'DE-HH': 'Hamburg umfasst sowohl bewaldete Geestbereiche wie die Harburger Berge als auch feuchte Marschlandschaften, wodurch unterschiedliche Pilzlebensräume entstehen.',
  'DE-HE': 'Hessen weist einen vergleichsweise hohen Waldanteil auf; Regionen wie Vogelsberg und Taunus mit ihren Laubwäldern bieten gute Bedingungen für viele Mykorrhizapilze.',
  'DE-MV': 'Mecklenburg-Vorpommern verbindet Küstenwälder mit ausgedehnten Seenlandschaften; die oft hohe Bodenfeuchte begünstigt verschiedene Wald- und Baumpilze.',
  'DE-NI': 'Niedersachsen reicht von Moor- und Heidelandschaften bis in die Mittelgebirgslagen des Harzes und bietet damit unterschiedliche ökologische Nischen für Pilze.',
  'DE-NW': 'Nordrhein-Westfalen umfasst kalkhaltige Mittelgebirgsräume wie die Eifel sowie waldreiche Regionen wie das Sauerland; daneben bieten auch urbane und rekultivierte Flächen geeignete Standorte für verschiedene Pilzarten.',
  'DE-RP': 'Rheinland-Pfalz ist stark bewaldet, unter anderem im Pfälzerwald; die vorherrschenden Sandsteinböden und das vergleichsweise milde Klima begünstigen eine artenreiche Pilzflora.',
  'DE-SL': 'Das Saarland ist durch Mischwälder und unterschiedliche Bodenarten geprägt; besonders in alten Laubwaldbeständen finden sich zahlreiche Mykorrhizapilze.',
  'DE-SN': 'Sachsen bietet mit Mittelgebirgen wie dem Erzgebirge und Flussauen entlang der Elbe unterschiedliche Lebensräume, in denen sowohl montane als auch auentypische Pilzarten vorkommen.',
  'DE-ST': 'Sachsen-Anhalt zeigt Gegensätze zwischen dem Harz und trockeneren Tieflandregionen, was eine Mischung aus waldtypischen und trockenheitsangepassten Pilzarten ermöglicht.',
  'DE-SH': 'Schleswig-Holstein ist durch seine maritime Lage geprägt; Knicks, Wälder und Küstenbereiche bieten verschiedene, teils windgeschützte Lebensräume für Pilze.',
  'DE-TH': 'Thüringen vereint Kalk- und Schieferregionen sowie ausgedehnte Wälder, wodurch sich eine vielfältige Pilzflora in unterschiedlichen Standorttypen entwickelt.'
};
const regionalBlurb = computed(() => regionDescriptions[props.regionCode]);
</script>

<template>
  <section class="mt-16 border-t border-gray-200 pt-10 pb-12 px-4 max-w-4xl mx-auto">
    <div class="prose prose-green max-w-none text-gray-600">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        Hintergrund zur Pilzvielfalt in {{ regionName }}
      </h2>
      
      <p class="mb-6">
        Die Mykologie in <strong>{{ regionName }}</strong> ist geprägt von den spezifischen geografischen und klimatischen Bedingungen der Region. {{ regionalBlurb }} 
        Insgesamt führen wir in unserer Datenbank über <strong>{{ GLOBAL_TOTAL_SPECIES.toLocaleString() }} Pilzarten</strong>, um Sammlern und Naturbegeisterten eine umfassende Bestimmungshilfe zu bieten.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <span class="block text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Regionale Vielfalt</span>
          <span class="text-3xl font-bold text-green-700">~{{ regionalStats[props.regionCode].species.toLocaleString() }} Arten</span>
          <p class="text-xs text-gray-400 mt-2">In {{ regionName }} dokumentierte Pilze</p>
        </div>
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <span class="block text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Datenbasis Region</span>
          <span class="text-3xl font-bold text-green-700">{{ regionalStats[props.regionCode].obs.toLocaleString() }}+ Funde</span>
          <p class="text-xs text-gray-400 mt-2">Aggregierte Meldungen aus der Citizen-Science Community</p>
        </div>
      </div>

      <h3 class="text-lg font-semibold text-gray-800 mb-2">Warum sind diese Pilze so häufig?</h3>
      <p class="mb-4">
        Dass Arten wie der <em>Fliegenpilz (Amanita muscaria)</em> oder der <em>Schopf-Tintling</em> oft ganz oben in der Liste stehen, liegt nicht nur an ihrer tatsächlichen Häufigkeit, sondern auch an ihrer guten Erkennbarkeit. Viele "unsichtbare" Myzelien im Boden von {{ regionName }} leisten wichtige Arbeit für das Ökosystem, werden aber seltener fotografiert und gemeldet als markante Speise- oder Giftpilze.
      </p>

      <p class="text-sm text-gray-400">
        <strong>Datenquelle & Methodik:</strong> Die Auswertung basiert auf den Open-Data-Schnittstellen von 
        <a href="https://www.inaturalist.org" target="_blank" class="underline hover:text-green-600">iNaturalist</a>. 
        Wir filtern die Rohdaten nach Forschungsqualität (Research Grade), entfernen Flechten sowie mikroskopische Kleinpilze, um ein präzises Bild der regionalen Pilzflora zu zeichnen.
      </p>
    </div>
  </section>
</template>