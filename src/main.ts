import { createApp } from 'vue'
import { createPinia } from "pinia"

import Aura from '@primevue/themes/aura';

import PrimeVue from 'primevue/config'

import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';

import '@/style.css'

import App from '@/App.vue'
import routerPlugin from '@/plugins/router.plugin'
import { definePreset } from '@primevue/themes';

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{slate.50}',
            100: '{slate.100}',
            200: '{slate.200}',
            300: '{slate.300}',
            400: '{slate.400}',
            500: '{slate.500}',
            600: '{slate.600}',
            700: '{slate.700}',
            800: '{slate.800}',
            900: '{slate.900}',
            950: '{slate.950}'
        }
    }
});

createApp(App)
    .use(PrimeVue, {
        theme: {
            preset: MyPreset,
            options: {
                cssLayer: {
                    name: 'primevue',
                    order: 'tailwind-base, primevue, tailwind-utilities',
                    darkModeSelector: 'dark',
                }
            },
        },
    })
    .use(ToastService)
    .use(ConfirmationService)
    .use(DialogService)
    .use(createPinia())
    .use(routerPlugin)
    .mount('#app')
