<template>
<v-app id="app">
  <login/>
</v-app>
</template>

<script>
import Login from './components/Login.vue'

export default {
  name: 'app',
  components: {
    Login
  }
}
</script>
