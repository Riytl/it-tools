<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import FavoriteButton from './FavoriteButton.vue';
import type { Tool } from '@/tools/tools.types';

const props = defineProps<{ tool: Tool & { category: string } }>();
const { tool } = toRefs(props);
const theme = useThemeVars();
</script>

<template>
  <router-link :to="tool.path" class="tool-link decoration-none">
    <c-card class="tool-card h-full">
      <div flex items-center justify-between>
        <span class="tool-icon"><n-icon size="30" :component="tool.icon" /></span>

        <div flex items-center gap-8px>
          <div
            v-if="tool.isNew"
            class="rounded-full px-8px py-3px text-xs text-white dark:text-neutral-800"
            :style="{
              'background-color': theme.primaryColor,
            }"
          >
            {{ $t('toolCard.new') }}
          </div>

          <FavoriteButton :tool="tool" />
        </div>
      </div>

      <div class="tool-name my-5px text-lg">
        {{ tool.name }}
      </div>

      <div class="tool-description line-clamp-2">
        {{ tool.description }}
      </div>
    </c-card>
  </router-link>
</template>

<style scoped>
.tool-card { border-radius: 14px; transition: border-color .2s, transform .2s, box-shadow .2s; }
.tool-link:hover .tool-card, .tool-link:focus-visible .tool-card { border-color: #6d90b8; transform: translateY(-3px); box-shadow: 0 12px 28px #032b741a; }
.tool-link:focus-visible { outline: none; }
.tool-icon { display: inline-flex; width: 48px; height: 48px; align-items: center; justify-content: center; border-radius: 13px; color: #032b74; background: #eaf0f8; }
.tool-name { color: #182742; font-weight: 700; }
.tool-description { color: #62718b; line-height: 1.55; }
:global(html.dark .tool-link:hover .tool-card), :global(html.dark .tool-link:focus-visible .tool-card) { border-color: #6d90b8; box-shadow: 0 12px 28px #0004; }
:global(html.dark .tool-icon) { color: #dce9f8; background: #2c4269; }
:global(html.dark .tool-name) { color: #f5f8fd; }
:global(html.dark .tool-description) { color: #adbfda; }
</style>
