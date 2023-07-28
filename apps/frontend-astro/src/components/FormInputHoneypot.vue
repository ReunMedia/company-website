<script setup lang="ts">
import { useField } from "vee-validate";
import { useI18n } from "vue-i18n";

interface Props {
  name: string;
  currentLocale: string;
}

const { name, currentLocale } = defineProps<Props>();

const { value } = useField(() => name);

const { t } = useI18n({
  useScope: "local",
  // Use locale passed from Astro instead of global locale
  locale: currentLocale,
  inheritLocale: false,
  messages: {
    en: { placeholder: "Leave this field empty." },
    fi: { placeholder: "Jätä tämä kenttä tyhjäksi." },
  },
});
</script>

<template>
  <input
    aria-hidden="true"
    autocomplete="off"
    tabindex="-1"
    class="absolute top-0 left-0 -z-1 h-0 w-0 opacity-0"
    :name="name"
    :value="value"
    :placeholder="t('placeholder')"
    type="text"
  />
</template>
