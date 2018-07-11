
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

import Toaster from 'v-toaster'
 import 'v-toaster/dist/v-toaster.css'

Vue.use(Toaster, {timeout: 5000})



/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
 
Vue.component('message', require('./components/message.vue'));

const app = new Vue({
    el: '#app',
    data:{
    	message:'',
    	chat:{
    		message:[],
    		user:[],
    		color:[]
    	},
    	typing:'',
    	numberOfUser:0
    },


    watch:{
    	message(){
    		Echo.private('chat')
    .whisper('typing', {
        name: this.message
    });
    	}
    },

    methods:{

    	send(){
    		if (this.message.length != 0) {
    		this.chat.message.push(this.message);
    		this.chat.color.push('success');
    		this.chat.user.push('you');
    		

    		axios.post('/send', {
            message: this.message
  })
     .then(response=> {
    console.log(response);
    this.message = ''
  })
  .catch(error=> {
    console.log(error);
  });
    	}}
    },
    mounted(){
       Echo.private('chat')
    .listen('ChatEvent', (e) => {
    	this.chat.message.push(e.message);
    	this.chat.user.push(e.user);
    	this.chat.color.push("warning");
        // console.log(e);
    })

    .listenForWhisper('typing', (e) => {
    	if (e.name != '') {
        this.typing = 'typing...'
    }
        else{
        	this.typing = ''
        }
    });
    Echo.join(`chat`)
    .here((users) => {
    	this.numberOfUser=users.length;
        
    })
    .joining((user) => {
    	this.numberOfUser+=1;
    	this.$toaster.success(user+'is joined the Chat Room');
       
    })
    .leaving((user) => {
    	this.numberOfUser-=1;
    	this.$toaster.warning(user+'is leaved the Chat Room');
        
    });
    }
});
