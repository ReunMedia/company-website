<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watchEffect } from "vue";
import { useBrowserLocation, useWindowScroll } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import ContentSection from "./ContentSection.vue";
import ExpandingCard from "./ExpandingCard.vue";
import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import ButtonPrimary from "./ButtonPrimary.vue";

interface WorkShowcaseItem {
  title: string;
  coverImage: {
    url: string;
  };
  slug: string;
  htmlContent: string;
}

export interface Props {
  showcaseItems?: WorkShowcaseItem[];
  /**
   * Current locale. Used to translate section heading.
   */
  currentLocale: string;
}

const { showcaseItems = [], currentLocale } = defineProps<Props>();

/**
 * Toggles dialog visibility
 */
const showDialog = ref(false);

/**
 * Last selected item is used to make sure dialog content doesn't disappear on
 * fade out
 */
const lastSelectedItem = ref<WorkShowcaseItem | undefined>();

/**
 * Target element to scroll page to when opening the dialog after navigating
 * from another page
 */
const workShowcaseEl = useTemplateRef("workShowcaseEl");

/**
 * Showcase item and dialog visibility is controlled by URL hash.
 */
const browserLocation = useBrowserLocation();

/**
 * Translated section heading.
 */
const { tm, rt } = useI18n({
  useScope: "local",
  // Use locale passed from Astro instead of global locale
  locale: currentLocale,
  inheritLocale: false,
  messages: {
    "en-US": {
      sectionHeading: "Our Work",
      closeButton: "Close",
    },
    "fi-FI": {
      sectionHeading: "Töitämme",
      closeButton: "Sulje",
    },
  },
});

/**
 * Change showcase item and dialog visibility by URL hash
 */
watchEffect(() => {
  const newSelectedItem = findItemByHash(browserLocation.value.hash ?? "");

  if (newSelectedItem) {
    lastSelectedItem.value = newSelectedItem;
  }

  showDialog.value = !!newSelectedItem;
});

/**
 * Scroll page to `TheWorkShowcase` component if an initial dialog is opened
 * based on URL hash from navigation.
 */
onMounted(() => {
  if (
    findItemByHash(browserLocation.value.hash ?? "") &&
    workShowcaseEl.value
  ) {
    const { y: scrollY } = useWindowScroll({ behavior: "smooth" });
    // `useTemplateRef()` on component returns ref to the Vue component. We use
    // `$el` to get the underlying HTML element.
    scrollY.value = workShowcaseEl.value?.$el.offsetTop ?? scrollY.value;
  }
});

/**
 * Reused generic transition props across all `TranistionChild`s.
 */
const transitionProps = {
  enter: "motion-reduce:transition-none duration-200 ease-out",
  leave: "motion-reduce:transition-none duration-200 ease-in",
};

const sectionHeading = rt(tm("sectionHeading"));
const closeButtonText = rt(tm("closeButton"));

const onDialogClose = () => {
  if (browserLocation.value.trigger !== "load") {
    // Exiting opened dialog acts as browser backwards navigation
    history.back();
    return;
  }

  // If the dialog was opened by manually navigating to page instead of clickng
  // a card, we remove the hash instaed of navigating back to previous page.

  // Set reactive `browserLocation.hash` to trigger watcher.
  browserLocation.value.hash = "";
  // Setting `browserLocation.hash` still leaves `#` in the URL, so we use
  // `replaceState` to get rid of it.
  history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search,
  );
};

/**
 * Find showcase item by URL hash
 */
function findItemByHash(hash: string) {
  const item = showcaseItems.find(
    // Use `decodeURIComponent` to support special characters (such as umlauts)
    // in slug
    (item) => "#" + item.slug === decodeURIComponent(hash),
  );
  return item;
}
</script>

<template>
  <ContentSection ref="workShowcaseEl" :heading="sectionHeading">
    <div class="grid grid-cols-1 gap-20 sm:grid-cols-3 sm:max-lg:gap-10">
      <ExpandingCard
        v-for="item in showcaseItems"
        :key="item.slug"
        :cover-image-url="item.coverImage.url"
        :title="item.title"
        :slug="item.slug"
      />
    </div>
    <TransitionRoot :show="showDialog" as="template">
      <Dialog class="relative z-50" @close="onDialogClose">
        <TransitionChild
          as="template"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave-from="opacity-100"
          leave-to="opacity-0"
          v-bind="transitionProps"
        >
          <div
            class="fixed inset-0 bg-black/30 backdrop-blur-xs"
            aria-hidden="true"
          />
        </TransitionChild>
        <div
          class="fixed inset-0 flex w-screen items-center justify-center overflow-y-auto px-4 py-16 sm:px-8"
          style="scrollbar-gutter: stable"
        >
          <TransitionChild
            as="template"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
            v-bind="transitionProps"
          >
            <DialogPanel
              class="border-theme-borders bg-theme-background h-full w-full max-w-5xl overflow-hidden rounded-2xl border-2"
            >
              <div
                class="scrollbar-thin flex h-full w-full flex-col overflow-y-auto"
              >
                <!--
                  Empty alt attribute is used, because the image is decorative.
                  See: https://www.w3.org/WAI/tutorials/images/decorative/
                  See: https://www.nngroup.com/articles/write-alt-text/#toc-decorative-images-dont-need-alt-text-4
                -->
                <img
                  class="aspect-3/1 w-full object-cover"
                  alt=""
                  :src="lastSelectedItem?.coverImage.url ?? ''"
                />
                <DialogTitle
                  class="text-theme-primary px-4 pt-6 pb-4 text-5xl md:px-12 md:pt-12 md:pb-8"
                >
                  {{ lastSelectedItem?.title }}
                </DialogTitle>
                <DialogDescription as="div">
                  <!-- eslint-disable vue/no-v-html -- because it's rendered from markdown and sanitized -->
                  <div
                    class="prose prose-content prose-min-heading-level-2 px-4 md:px-12"
                    v-html="lastSelectedItem?.htmlContent"
                  />
                </DialogDescription>
                <div class="flex grow items-end justify-center">
                  <ButtonPrimary
                    aria-label="Close dialog"
                    class="my-6"
                    color-variant="transparent"
                    @click="onDialogClose"
                  >
                    {{ closeButtonText }}
                  </ButtonPrimary>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </ContentSection>
</template>
