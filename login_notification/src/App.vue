<template>
<v-app id="app_login">
  <login/>
</v-app>
</template>

<script>
import Login from './components/Login.vue'

export default {
  name: 'app_login',
  components: {
    Login
  }
}
</script>
