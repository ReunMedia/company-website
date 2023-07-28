<script lang="ts">
/**
 * Use `bg-` classes or `background-color` property to colorize icon. Uses a
 * masked `<span>` to render icon, so only monochrome colorization is supported.
 *
 * Icons have no width or height by default. Use `w-` and `h-` classes for icon
 * size.
 */
export default {};
</script>

<script setup lang="ts">
export interface Props {
  /**
   * Icon URL. Can be empty to render a blank space.
   */
  src?: string;
}

const { src } = defineProps<Props>();
</script>

<template>
  <span
    class="icon inline-block"
    :style="{
      maskImage: src ? `url(${src})` : undefined,
      backgroundColor: src ? undefined : 'transparent',
    }"
  ></span>
</template>

<style>
.icon {
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}
</style>
