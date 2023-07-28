<script setup lang="ts">
import HeroIconsMoon from "../icons/HeroiconsMoon.svg";
import HeroIconsSunSolid from "../icons/HeroiconsSunSolid.svg";
import SvgIcon from "./SvgIcon.vue";
import TablerSunMoon from "../icons/TablerSunMoon.svg";
import { objectKeys } from "ts-extras";
import { useColorMode, useCycleList } from "@vueuse/core";
import { h, onMounted, ref, type VNode } from "vue";
import BaseTopMenuButton from "./BaseTopMenuButton.vue";

const modes = {
  light: "theme-sky-light",
  dark: "theme-sky-dark",
};

const colorMode = useColorMode({
  modes,
});

const colorModeWithAuto = colorMode.store;

const { state, next } = useCycleList<"auto" | keyof typeof modes>(
  ["auto", ...objectKeys(modes)],
  {
    initialValue: colorModeWithAuto.value,
  },
);

const iconComponents: Record<"auto" | keyof typeof modes, () => VNode> = {
  auto: () => h(SvgIcon, { src: TablerSunMoon.src }),
  light: () => h(SvgIcon, { src: HeroIconsSunSolid.src }),
  dark: () => h(SvgIcon, { src: HeroIconsMoon.src }),
};

// Force icon component refresh on client-side. SSR always renders `light` icon
// regardless of user's theme preference.
const refreshIcon = ref(false);
onMounted(() => {
  refreshIcon.value = !refreshIcon.value;
});
</script>

<template>
  <BaseTopMenuButton
    aria-label="Change color theme"
    @click="
      next();
      colorMode = state;
    "
  >
    <div
      class="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full"
    >
      <!-- Rotating "globe" style transition -->
      <Transition
        mode="out-in"
        enter-from-class="rotate-90"
        enter-to-class="rotate-0 ease-in-out duration-200"
        leave-to-class="-rotate-90 ease-in-out duration-200"
      >
        <div
          :key="colorModeWithAuto"
          class="absolute top-0 mt-3 flex h-24 w-24 justify-center transition"
        >
          <component
            :is="iconComponents[colorModeWithAuto]"
            class="bg-theme-text-base absolute h-6 w-6"
          />
        </div>
      </Transition>
    </div>
  </BaseTopMenuButton>
</template>
