import { createApp } from 'vue'
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "./assets/style.css"

import router from "./router";

createApp(App).use(router).mount('#app');
