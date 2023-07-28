<script setup lang="ts">
import type { InputTypeHTMLAttribute } from "vue";
import BaseFormInputText from "./BaseFormInputText.vue";
import type { Props as BaseFormInputTextProps } from "./BaseFormInputText.vue";

interface Props extends BaseFormInputTextProps {
  type?: InputTypeHTMLAttribute;
}

const { type = "text", ...props } = defineProps<Props>();
</script>

<template>
  <BaseFormInputText
    v-slot="{ value, validationListeners, styleClass }"
    v-bind="props"
  >
    <input
      :name="name"
      :value="value"
      :type="type"
      :class="styleClass"
      size="1"
      v-on="validationListeners"
    />
  </BaseFormInputText>
</template>
