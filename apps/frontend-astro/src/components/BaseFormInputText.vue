<script setup lang="ts">
import { useField } from "vee-validate";

export interface Props {
  name: string;
  label: string;
}

const props = defineProps<Props>();

// See: https://vee-validate.logaretm.com/v4/guide/composition-api/custom-inputs
const { value, errorMessage, handleChange, handleBlur } = useField(
  () => props.name,
);

const validationListeners = {
  blur: (e: Event) => handleBlur(e, true),
  change: handleChange,
  input: (e: Event) => handleChange(e, !!errorMessage.value),
};
</script>

<template>
  <label class="formInputBase flex flex-col">
    <!-- Label -->
    <span class="mb-2"
      >{{ label }}
      <!--
        Validation error, if present.

        It's ok to have the error inside the label.
        See: https://www.accede-web.com/en/guidelines/html-css/forms/add-error-messages-and-correction-suggestions-directly-into-the-label-tag/
      -->
      <span
        v-if="errorMessage"
        class="text-theme-accent float-right text-sm"
        as="span"
      >
        {{ errorMessage }}
      </span>
    </span>
    <!-- Input element -->
    <slot
      :value="value"
      :validation-listeners="validationListeners"
      style-class="formInputText"
      v-bind="$props"
    ></slot>
  </label>
</template>

<style scoped>
@reference "../styles/global.css";

/**
 * CSS variables
 */
.formInputBase {
  --autofill-bg-color: rgba(var(--colors-theme-primary), 0.2);
  --autofill-text-color: rgba(var(--colors-theme-text-base));
}

/**
 * Style child input element.
 */
/* prettier-ignore */
.formInputBase :deep(.formInputText) {
  @apply rounded-lg
  p-2
  px-4
  outline-1
  outline-theme-borders
  transition-[outline-color]
  duration-300
  focus-within:outline-2
  focus-within:outline-theme-primary
  [.theme-sky-dark_&]:bg-theme-background-highlight;
}

/**
 * Autofill / autocomplete styling.
 * See: https://stackoverflow.com/a/14205976/1865857
 */
/* Transition hack is used for older Chrome versions according to SO. How old?
No clue. However, we can't do it here because it breaks the existing outline
transition. Luckily we can use animation instead
(https://stackoverflow.com/a/37432260/1865857). All the desired style changes
are defined in this animation even though Firefox and newer versions of Chrome
don't really need it, since it works on them as well. */
@keyframes autofill {
  0%,
  100% {
    background-clip: text;
    -webkit-text-fill-color: var(--autofill-text-color);
    box-shadow: inset 0 0 20px 20px var(--autofill-bg-color);
    caret-color: var(--autofill-text-color);
    /* TODO - There may or may not be a way to set font-family as well, but
    apparently it caused a security issue and was disabled or something. I've
    already spent way too much time on this, so colors will have to do. */
    /* TODO - Changing a theme when a form field is autofilled causes the
    autofilled text to display in wrong color until the input is changed. This
    could probably be fixed by forcing the component to re-render after theme is
    changed, but it is such an extreme edge case that there's no reason to fix
    it right now. */
    /* TODO - This doesn't seem to be working on dark theme properly. At least
    in the current version of Chromium at the time of writing. */
  }
}

.formInputBase
  :deep(
    .formInputText:autofill,
    .formInputText:autofill:hover,
    .formInputText:autofill:focus
  ) {
  /* See: https://stackoverflow.com/a/37432260/1865857 */
  animation-delay: 1s;
  animation-name: autofill;
  animation-fill-mode: both;
}
</style>
