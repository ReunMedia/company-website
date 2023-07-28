<script setup lang="ts">
interface Props {
  /**
   * Size variant
   */
  variant?: "normal" | "large";
  colorVariant?: "primary" | "transparent";
}

const { variant = "normal", colorVariant = "primary" } = defineProps<Props>();
</script>

<template>
  <button
    type="button"
    class="border-denim-500 font-display cursor-pointer rounded-2xl uppercase"
    :class="{
      'px-5 py-3': variant === 'normal',
      'px-8 py-4 text-xl': variant === 'large',
      'bg-theme-primary text-theme-text-on-primary border-2':
        colorVariant === 'primary',
      'text-theme-text-links bg-transparent': colorVariant === 'transparent',
    }"
  >
    <slot />
  </button>
</template>
