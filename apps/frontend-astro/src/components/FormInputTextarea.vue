<script setup lang="ts">
import type { Props as BaseFormInputTextProps } from "./BaseFormInputText.vue";
import BaseFormInputText from "./BaseFormInputText.vue";

interface Props extends BaseFormInputTextProps {
  type?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <BaseFormInputText
    v-slot="{ value, validationListeners, styleClass }"
    v-bind="props"
  >
    <textarea
      :class="styleClass"
      rows="6"
      :name="name"
      :value="<string>value"
      cols="1"
      v-on="validationListeners"
    />
  </BaseFormInputText>
</template>
