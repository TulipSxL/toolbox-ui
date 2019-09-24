import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Vue from 'vue';
import Vuelidate from 'vuelidate';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';
import App from './App';
import router from './router';

Vue.use(BootstrapVue);
Vue.use(Vuelidate);
Vue.use(VueI18n);

App.i18n = new VueI18n({
	locale: 'zh_CN',
	messages: {
		'zh_CN': require('./langs/zh_CN'),
		'en_US': require('./langs/en_US')
	}
});

App.router = router;

const obConsoleApp = new Vue(App);
const appElement = document.createElement('div');

appElement.id = 'app';
document.body.appendChild(appElement);
obConsoleApp.$mount(appElement);