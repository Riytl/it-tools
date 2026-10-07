<script setup lang="ts">
import { useHead } from '@vueuse/head';
import ToolCard from '../components/ToolCard.vue';
import { useToolStore } from '@/tools/tools.store';

const toolStore = useToolStore();
const { t } = useI18n();
useHead(computed(() => ({ title: t('home.pageTitle') })));

const favoriteTools = computed(() => toolStore.favoriteTools);
</script>

<template>
  <div class="home-page">
    <section class="hero">
      <span class="eyebrow">{{ $t('home.eyebrow') }}</span>
      <h1>{{ $t('home.title') }}</h1>
      <p>{{ $t('home.subtitle') }}</p>
      <div class="hero-footer">
        <c-button class="hero-action" type="primary" to="/campus-gap-assistant">{{ $t('home.primaryAction') }}</c-button>
        <span>{{ $t('home.privacyNote') }}</span>
      </div>
    </section>

    <section v-if="favoriteTools.length" class="tool-section">
      <h2>{{ $t('home.categories.favoriteTools') }}</h2>
      <div class="tool-grid">
        <ToolCard v-for="tool in favoriteTools" :key="tool.path" :tool="tool" />
      </div>
    </section>

    <section v-for="group in toolStore.toolsByCategory" :key="group.name" class="tool-section">
      <div class="section-heading">
        <h2>{{ group.name }}</h2>
        <span>{{ group.components.length }} {{ $t('home.toolsCount') }}</span>
      </div>
      <div class="tool-grid">
        <ToolCard v-for="tool in group.components" :key="tool.path" :tool="tool" />
      </div>
    </section>

    <footer class="home-footer">
      {{ $t('home.footerNote') }}
    </footer>
  </div>
</template>

<style scoped>
.home-page { width: 100%; max-width: 1180px; margin: 0 auto; padding-bottom: 2rem; }
.hero { position: relative; isolation: isolate; overflow: hidden; margin: .25rem 0 2.5rem; padding: clamp(1.75rem, 5vw, 3.5rem); border-radius: 24px; color: #fff; background: linear-gradient(122deg, #032b74 6%, #274983 62%, #576398 100%); box-shadow: 0 20px 48px #032b7424; }
.hero::before { position: absolute; inset: 0 auto 0 0; width: 7px; background: linear-gradient(#bd1b3e, #ef4e55); content: ''; }
.hero::after { position: absolute; right: -7rem; bottom: -16rem; width: 36rem; height: 36rem; border: 1px solid #ffffff45; border-radius: 50%; box-shadow: 0 0 0 3.5rem #ffffff0a, 0 0 0 7rem #ffffff09, 0 0 0 10.5rem #ffffff07; content: ''; z-index: -1; }
.eyebrow { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: .6rem; letter-spacing: .14em; font-size: .75rem; font-weight: 700; color: #dce9f8; }
.eyebrow::before { width: .55rem; height: .55rem; border-radius: 50%; background: #ef4e55; content: ''; }
.hero h1 { position: relative; z-index: 1; max-width: 740px; margin: .8rem 0 .7rem; font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.12; letter-spacing: -.02em; }
.hero > p { position: relative; z-index: 1; max-width: 660px; margin: 0; font-size: 1.05rem; line-height: 1.7; color: #e4edf9; }
.hero-footer { position: relative; z-index: 1; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-top: 1.7rem; }
.hero :deep(.hero-action) { color: #fff; background: #bd1b3e; font-weight: 700; box-shadow: 0 8px 22px #101e4d42; }
.hero :deep(.hero-action:hover) { color: #fff; background: #a91134; }
.hero-footer span { font-size: .9rem; color: #dce9f8; }
.tool-section { margin-top: 2.2rem; }
.section-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
.section-heading h2, .tool-section > h2 { margin: 0 0 .9rem; padding-left: .8rem; border-left: 4px solid #bd1b3e; font-size: 1.15rem; font-weight: 700; color: #032b74; }
.section-heading span { color: #6b7d99; font-size: .85rem; }
.tool-grid { display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 14px; }
.home-footer { padding: 2rem .25rem .5rem; color: #6b7d99; font-size: .85rem; }
:global(html.dark .section-heading h2), :global(html.dark .tool-section > h2) { color: #d9e7fa; }
:global(html.dark .section-heading span), :global(html.dark .home-footer) { color: #a8bbd4; }
@media (min-width: 640px) { .tool-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 900px) { .tool-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1200px) { .tool-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
</style>
