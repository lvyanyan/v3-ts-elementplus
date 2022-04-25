import { createApp } from 'vue'
import App from './App.vue'
import element3 from "./plugins/element3";
import router from "./router";
import store from './store'
import 'amfe-flexible'
import './index.css'

createApp(App).use(element3).use(router).use(store).mount('#app')
