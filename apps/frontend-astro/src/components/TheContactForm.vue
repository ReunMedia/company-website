<script setup lang="ts">
import { graphql } from "../graphql/generated";
import { useMutation } from "@urql/vue";
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import ContentSection from "./ContentSection.vue";
import BaseCard from "./BaseCard.vue";
import FormInputCheckbox from "./FormInputCheckbox.vue";
import FormInputHoneypot from "./FormInputHoneypot.vue";
import { useForm } from "vee-validate";
import * as zod from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import FormInputText from "./FormInputText.vue";
import FormInputTextarea from "./FormInputTextarea.vue";
import ButtonPrimary from "./ButtonPrimary.vue";
import SvgIcon from "./SvgIcon.vue";
import MdiLoading from "../icons/MdiLoading.svg";
import { zodRequiredString } from "../utils/zodRequiredString";
import { normalizeTrailingSlash } from "../utils/normalizeTrailingSlash";

export interface Props {
  currentLocale: string;
}

const { currentLocale } = defineProps<Props>();

type FormInputs =
  | "name"
  | "email"
  | "message"
  | "acceptPrivacy"
  | "honey_message"
  | "submitButton";

const localizedMessages = {
  "en-US": {
    formErrors: {
      name: { required: "Please enter your name" },
      email: {
        required: "Please enter your email",
        invalid: "Please enter a valid email",
      },
      message: {
        required: "Please write a message",
      },
      acceptPrivacy: {
        required: "You must agree to the privacy policy",
      },
      submitButton: {
        serverError: "There was an error when sending your message",
      },
      honey_message: {},
    } satisfies Record<FormInputs, object>,
    sectionHeading: "What do you need?",
    submitText: "Send message",
    preferEmail: {
      text: "Prefer sending email instead?\nYou can also reach us at {emailLink}",
      emailLink: "company{'@'}reun.eu",
    },
    form: {
      name: {
        label: "Your name",
      },
      email: {
        label: "Your email address",
      },
      message: {
        label: "Message",
      },
      acceptPrivacy: {
        label: "I agree to the {link}",
        link: {
          text: "privacy policy",
          target: "/en/privacy",
        },
      },
    },
    thanksForSubmitting: "Thank you!\nWe'll be in touch.",
    submitAnotherMessage: "Send another message",
  },
  "fi-FI": {
    formErrors: {
      name: { required: "Anna nimesi" },
      email: {
        required: "Anna sähköpostiosoitteesi",
        invalid: "Virheellinen sähköpostiosoite",
      },
      message: {
        required: "Kirjoita viesti",
      },
      acceptPrivacy: {
        required: "Tietosuojakäytäntö pitää hyväksyä",
      },
      submitButton: {
        serverError: "Viestin lähettämisessä tapahtui virhe",
      },
      honey_message: {},
    } satisfies Record<FormInputs, object>,
    sectionHeading: "Mitä sinä tarvitset?",
    submitText: "Lähetä viesti",
    preferEmail: {
      text: "Lähettäisitkö mieluummin sähköpostia?\nVoit ottaa yhteyttä osoitteeseen {emailLink}",
      emailLink: "yritys{'@'}reun.eu",
    },
    form: {
      name: {
        label: "Nimi",
      },
      email: {
        label: "Sähköpostiosoite",
      },
      message: {
        label: "Viesti",
      },
      acceptPrivacy: {
        label: "Hyväksyn {link}",
        link: {
          text: "tietosuojakäytännön",
          target: "/fi/tietosuoja",
        },
      },
    },
    thanksForSubmitting: "Kiitos viestistä!\nOlemme teihin yhteydessä.",
    submitAnotherMessage: "Lähetä toinen viesti",
  },
};

const { t } = useI18n({
  useScope: "local",
  // Use locale passed from Astro instead of global locale
  locale: currentLocale,
  inheritLocale: false,
  messages: localizedMessages,
});

//#region Form handling
const { handleSubmit, errors, isSubmitting, isValidating } = useForm({
  validationSchema: toTypedSchema(
    zod.object({
      name: zodRequiredString(t("formErrors.name.required")),
      email: zodRequiredString(t("formErrors.email.required")).email(
        t("formErrors.email.invalid"),
      ),
      message: zodRequiredString(t("formErrors.message.required")),
      acceptPrivacy: zod.literal(true, {
        required_error: t("formErrors.acceptPrivacy.required"),
      }),
      submitButton: zod.any(),
      honey_message: zod.string().or(zod.undefined()),
    } satisfies Record<FormInputs, object>),
  ),
});

interface DynamicFormInput<T extends FormInputs> {
  name: T;
  is:
    | string
    | typeof FormInputText
    | typeof FormInputCheckbox
    | typeof FormInputTextarea;
  type?: string;
}
const dynamicFormInputs: DynamicFormInput<FormInputs>[] = [
  {
    name: "name",
    is: FormInputText,
    type: "text",
  },
  {
    name: "email",
    is: FormInputText,
    type: "email",
  },
  {
    name: "message",
    is: FormInputTextarea,
  },
];
//#endregion

//#region Form submission

const mutation = graphql(`
  mutation submitContactFormMutation(
    $input: create_contactFormResponses_input!
  ) {
    create_contactFormResponses_item(data: $input)
  }
`);

const submitContactFormMutation = useMutation(mutation);
const isFormSubmitted = ref(false);

const onSubmit = handleSubmit(async (values, { resetForm, setFieldError }) => {
  const { name, email, message, acceptPrivacy, honey_message } = values;
  const timeBeforeRequest = Date.now();
  const { error } = await submitContactFormMutation.executeMutation({
    input: {
      name,
      email,
      message,
      acceptPrivacy,
      /**
       * Server-side honeypot detection rejects the submission if
       * `additionalJsonData.honeypot` is set.
       */
      additionalJsonData: {
        honeypot: honey_message || null,
      },
    },
  });
  const requestDuration = Date.now() - timeBeforeRequest;

  // If there was an error with honeypot present, we can assume that was the
  // reason for error and silently display the success message.
  if (error && !honey_message) {
    setFieldError("submitButton", t("formErrors.submitButton.serverError"));
    return;
  }

  // Artificially delay submission for UX reasons if the request took less than
  // the specified minimum duration.
  const minimumSubmitDuration = 500;
  if (requestDuration < minimumSubmitDuration) {
    await new Promise((r) =>
      setTimeout(r, minimumSubmitDuration - requestDuration),
    );
  }

  isFormSubmitted.value = true;
  resetForm();
});

const isSubmittingToServer = computed(
  () => isSubmitting.value && !isValidating.value,
);
//#endregion
</script>

<template>
  <ContentSection :heading="t('sectionHeading')">
    <BaseCard class="mx-auto box-content max-w-md p-4 sm:p-10">
      <form novalidate class="space-y-6" @submit="onSubmit">
        <div class="relative">
          <!-- Wrap the entire form in `<fieldset>` to make it disabled during server request. -->
          <fieldset
            class="space-y-6"
            :disabled="isSubmittingToServer"
            :aria-hidden="isFormSubmitted"
            :class="{ 'opacity-0': isFormSubmitted }"
          >
            <!-- Dynamic inputs -->
            <div v-for="{ is, name } in dynamicFormInputs" :key="name">
              <component
                :is="is"
                :name="name"
                :label="t(`form.${name}.label`)"
              />
            </div>
            <!-- Accept privacy -->
            <div class="flex justify-center">
              <FormInputCheckbox name="acceptPrivacy" :checked-value="true">
                <i18n-t keypath="form.acceptPrivacy.label" tag="span">
                  <template #link>
                    <a
                      class="underline"
                      :href="
                        normalizeTrailingSlash(
                          t('form.acceptPrivacy.link.target'),
                        )
                      "
                      >{{ t("form.acceptPrivacy.link.text") }}</a
                    >
                  </template>
                </i18n-t>
              </FormInputCheckbox>
            </div>
            <!-- Honeypot -->
            <FormInputHoneypot
              name="honey_message"
              :current-locale="currentLocale"
            />
            <!-- Submit button -->
            <!-- Server-side submission error is tied to submit button -->
            <p
              v-if="errors.submitButton"
              class="text-theme-accent text-center text-sm"
            >
              {{ errors.submitButton }}
            </p>
            <div class="text-center">
              <ButtonPrimary class="relative py-2" type="submit">
                <span :class="{ 'opacity-0': isSubmittingToServer }">
                  {{ t("submitText") }}
                </span>
                <div class="absolute inset-0 flex items-center justify-center">
                  <SvgIcon
                    v-if="isSubmittingToServer"
                    class="bg-theme-text-base h-6 w-6 animate-spin"
                    :src="MdiLoading.src"
                  />
                </div>
              </ButtonPrimary>
            </div>
            <!-- Form submitted message -->
          </fieldset>
          <div
            v-if="isFormSubmitted"
            class="absolute inset-0 flex flex-col items-center justify-center"
          >
            <div class="flex-1 basis-0"></div>
            <p
              class="first-line:font-display first-line:text-theme-primary my-4 text-center leading-loose whitespace-pre-wrap first-line:text-2xl"
            >
              {{ t("thanksForSubmitting") }}
            </p>
            <div class="flex-1 basis-0">
              <a
                class="text-theme-text-muted cursor-pointer text-sm underline"
                @click="isFormSubmitted = false"
              >
                {{ t("submitAnotherMessage") }}
              </a>
            </div>
          </div>
        </div>
        <!-- Prefer email -->
        <div>
          <i18n-t
            keypath="preferEmail.text"
            tag="p"
            class="text-theme-text-muted text-center text-sm whitespace-pre-wrap"
          >
            <template #emailLink>
              <a
                class="underline"
                :href="`mailto:${t('preferEmail.emailLink')}`"
                >{{ t("preferEmail.emailLink") }}</a
              >
            </template>
          </i18n-t>
        </div>
      </form>
    </BaseCard>
  </ContentSection>
</template>
