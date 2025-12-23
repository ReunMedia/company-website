<script setup lang="ts">
import BaseCard from "./BaseCard.vue";

interface Props {
  coverImageUrl: string;
  title: string;
  slug: string;
}

const { coverImageUrl, title, slug } = defineProps<Props>();
</script>

<template>
  <BaseCard
    class="transform overflow-hidden transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
  >
    <a :href="`#${slug}`">
      <!--
        Empty alt attribute is used, because the image is decorative.
        See: https://www.w3.org/WAI/tutorials/images/decorative/
        See: https://www.nngroup.com/articles/write-alt-text/#toc-decorative-images-dont-need-alt-text-4
      -->
      <img
        class="aspect-video w-full object-cover"
        :src="coverImageUrl"
        alt=""
      />
      <p
        class="font-display text-theme-primary flex h-16 items-center p-4 text-xl"
      >
        {{ title }}
      </p>
    </a>
  </BaseCard>
</template>
