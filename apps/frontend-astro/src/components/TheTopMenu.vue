<script setup lang="ts">
import { useWindowScroll } from "@vueuse/core";
import { ref, watch } from "vue";
import BaseSideMenu from "./BaseSideMenu.vue";
import BaseTopMenuButton from "./BaseTopMenuButton.vue";
import ToggleColorModeButton from "./ToggleColorModeButton.vue";
import SvgIcon from "./SvgIcon.vue";
import MaterialSymbolsHomeOutline from "../icons/MaterialSymbolsHomeOutline.svg";
import SelectLanguageButton from "./SelectLanguageButton.vue";
import type { Props as SelectLanguageButtonProps } from "./SelectLanguageButton.vue";

export interface Props {
  /**
   * URL for home button (index). If empty, index button is hidden.
   */
  indexButtonUrl?: string;
  selectLanguageButtonProps: SelectLanguageButtonProps;
}

const { indexButtonUrl, selectLanguageButtonProps } = defineProps<Props>();

const hideTopBarBgClasses =
  "bg-transparent border-transparent shadow-transparent";
const topBarClasses = ref(hideTopBarBgClasses);

const { y } = useWindowScroll();

watch(y, () => {
  topBarClasses.value = y.value == 0 ? hideTopBarBgClasses : "";
});
</script>

<template>
  <BaseSideMenu
    class="bg-theme-background-card fixed top-0 right-0 mt-2 flex space-x-2 transition duration-300"
    :class="topBarClasses"
  >
    <BaseTopMenuButton
      v-if="indexButtonUrl"
      as="a"
      :href="indexButtonUrl"
      aria-label="Navigate to home page"
    >
      <SvgIcon
        class="bg-theme-text-base h-6 w-6"
        :src="MaterialSymbolsHomeOutline.src"
      />
    </BaseTopMenuButton>
    <ToggleColorModeButton />
    <SelectLanguageButton v-bind="selectLanguageButtonProps" />
  </BaseSideMenu>
</template>
