<script setup lang="ts">
import { useField } from "vee-validate";

interface Props {
  name: string;
  checkedValue: string | boolean;
}

const { name, checkedValue } = defineProps<Props>();

// See: https://vee-validate.logaretm.com/v4/guide/composition-api/custom-inputs#building-checkboxes
const { handleChange, checked, errorMessage } = useField(
  () => name,
  undefined,
  {
    type: "checkbox",
    checkedValue: checkedValue,
  },
);
</script>

<template>
  <div>
    <p
      v-if="errorMessage"
      class="text-theme-accent basis-full text-center text-sm"
    >
      {{ errorMessage }}
    </p>
    <label class="flex h-10 flex-wrap items-center rounded-lg">
      <!-- transition-[] is needed because Tailwind's `transition-color` doesn't transition outline and adding both `transition-color` and `transition-[outline-color]` makes the background color not transition. -->
      <input
        class="outline-theme-borders checked:!bg-theme-primary [.theme-sky-dark_&]:border-theme-background-highlight [.theme-sky-dark_&]:bg-theme-background-highlight focus-visible:outline-theme-primary mr-4 h-6 w-6 appearance-none rounded-md border-4 border-white bg-white outline transition-[outline-color,background-color] duration-300 hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-0"
        :value="checkedValue"
        :checked="checked ?? false"
        type="checkbox"
        @change="handleChange"
      />
      <slot />
    </label>
  </div>
</template>
