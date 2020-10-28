import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import ApiService from './services/api.service';

Vue.config.productionTip = false

ApiService.init();

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
