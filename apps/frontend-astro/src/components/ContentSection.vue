<script setup lang="ts">
interface Props {
  heading?: string;
}

const { heading } = defineProps<Props>();
</script>

<template>
  <div class="mt-24">
    <slot name="heading">
      <h2 class="text-theme-primary px-12 pb-8 text-center text-5xl">
        {{ heading }}
      </h2>
    </slot>
    <slot />
  </div>
</template>
