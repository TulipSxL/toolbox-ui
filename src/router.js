import Vue from 'vue';
import Router from 'vue-router';
import Hosts from './components/Hosts.vue';
import Program from './components/Program.vue'

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			redirect: '/hosts'
		},
		{
			path: '/hosts',
			name: 'hosts',
			component: Hosts
		},
		{
			path: '/program',
			name: 'program',
			component: Program
		},
	]
});