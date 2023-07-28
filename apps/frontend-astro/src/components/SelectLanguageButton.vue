<script setup lang="ts">
import IonCheckmarkRound from "../icons/IonCheckmarkRound.svg";
import IonLanguage from "../icons/IonLanguage.svg";
import SvgIcon from "./SvgIcon.vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import BaseTopMenuButton from "./BaseTopMenuButton.vue";
import BaseSideMenu from "./BaseSideMenu.vue";
import type { LocalizedPath } from "../types/localizedPath";
import { normalizeTrailingSlash } from "../utils/normalizeTrailingSlash.ts";

interface Locale {
  /**
   * Path to locale without slashes (e.g. `en`)
   */
  path: string;
  /**
   * Name of the locale used as link text (e.g. `English`)
   */
  name: string;
}

export interface Props {
  /**
   * Current URL path including the locale (e.g. `/en/news`)
   */
  currentPath: string;
  /**
   * List of all available locales. Used to construct locale selector list.
   */
  locales: Locale[];
  /**
   * Current page paths in alternative locales.
   */
  localizedPaths?: LocalizedPath[] | undefined;
}

const { currentPath, locales, localizedPaths = [] } = defineProps<Props>();

const currentLocalePath = currentPath.split("/")[1];

const getLocalizedPath = (localePath: string) => {
  if (localePath == currentLocalePath) {
    return currentPath;
  }
  const slug =
    localizedPaths.find(({ path }) => path == localePath)?.slug ?? "";
  return normalizeTrailingSlash(`/${localePath}/${slug}`);
};
</script>

<template>
  <div class="relative">
    <Menu>
      <MenuButton v-slot="{ open }: { open: boolean }" as="template">
        <BaseTopMenuButton
          class="h-12 w-12"
          :active="open"
          aria-label="Change language"
        >
          <SvgIcon class="bg-theme-text-base h-6 w-6" :src="IonLanguage.src" />
        </BaseTopMenuButton>
      </MenuButton>
      <Transition
        enter-from-class="translate-x-full"
        enter-to-class="duration-200"
        leave-to-class="translate-x-full ease-in-out duration-200"
      >
        <MenuItems as="template">
          <BaseSideMenu
            class="absolute right-0 mt-2 flex flex-col overflow-hidden transition"
          >
            <MenuItem
              v-for="locale in locales"
              v-slot="{ active }"
              :key="locale.path"
              ><a
                class="flex items-center p-3 pr-7 transition-colors duration-300"
                :class="active ? 'bg-theme-background-highlight' : ''"
                :href="getLocalizedPath(locale.path)"
              >
                <!-- Show checkmark icon for current locale. Use empty icon for
                others to align properly. -->
                <SvgIcon
                  class="bg-theme-text-base h-4 w-4"
                  :src="
                    locale.path == currentPath.split('/')[1]
                      ? IonCheckmarkRound.src
                      : ''
                  "
                />
                <p class="px-3">{{ locale.name }}</p>
              </a>
            </MenuItem>
          </BaseSideMenu>
        </MenuItems>
      </Transition>
    </Menu>
  </div>
</template>
