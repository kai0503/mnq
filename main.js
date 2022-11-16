import App from './App'
import Vue from 'vue'

//Vue.prototype.$url = 'http://82.157.29.129:8005/app/dpzs';
Vue.prototype.$url = 'http://manage.jmzhnm.cn:8015/app/dpzs';
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({ 
	...App  
})
app.$mount()
