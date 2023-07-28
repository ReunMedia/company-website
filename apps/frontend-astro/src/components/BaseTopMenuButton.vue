<script setup lang="ts">
import { ref, type Component } from "vue";

interface Props {
  active?: boolean | null;
  /**
   * Which component to render the button as. (default `button`)
   *
   * Use `as="a"` to render links as buttons instead of wrapping the button
   * inside `<a>`.
   */
  as?: string | Component;
}

const { active = null, as = "button" } = defineProps<Props>();

//#region Mobile touch transition
const transitionClass = ref<"transitionIn" | "transitionOut">("transitionOut");
function onClickButton(e: MouseEvent) {
  const el = e.currentTarget;
  if (el instanceof HTMLElement) {
    // Trigger DOM reflow to reset animation before finished.
    el.style.animation = "none";
    el.style.animation = "";
    transitionClass.value = "transitionIn";
  }
}
//#endregion
</script>

<template>
  <component
    :is="as"
    type="button"
    class="buttonClass before:bg-theme-background-highlight relative flex h-12 w-12 cursor-pointer items-center justify-center before:absolute before:inset-0 before:-z-10 before:scale-0 before:rounded-full before:opacity-0 before:transition-all before:ease-in"
    :class="{
      activeClass: active,
      // Mobile touch transition class is only applied for buttons that are not
      // toggled via `active`
      [transitionClass]: active === null,
    }"
    @click="onClickButton"
    @transitionend="transitionClass = 'transitionOut'"
  >
    <slot></slot>
  </component>
</template>

<style scoped>
@reference "../styles/global.css";

/** Applied when button is active */
.activeClass {
  @apply before:scale-100 before:opacity-100 before:ease-out;
}

/** Use normal :hover behaviour on desktop */
@media (hover: hover) and (pointer: fine) {
  .buttonClass:hover {
    @apply before:scale-100 before:opacity-100 before:ease-out;
  }
}

/** Target devices that don't support hover */
@media not (hover: hover) {
  .buttonClass.transitionIn {
    @apply before:scale-100 before:opacity-100 before:ease-in;
  }

  .buttonClass.transitionOut {
    /** Add delay before transitioning out */
    @apply before:scale-0 before:opacity-0 before:delay-75 before:ease-out;
  }
}
</style>
