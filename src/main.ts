// Importing the main stylesheet for the application
import './assets/main.css'

// Importing necessary functions from Vue and Pinia libraries
import { createApp } from 'vue'     // Vue 3 function to create a new application instance
import { createPinia } from 'pinia' // Pinia function to create a new store instance
import App from './App.vue'         // Importing the root Vue component of the application

// Creating a new Vue application instance with the root component
const app = createApp(App)

// Integrating Pinia with the Vue application
app.use(createPinia())

// Mounting the Vue application to the DOM
app.mount('#app')
