<template>
  <div>
    <h1>Agora Login</h1>
    <router-link to="/agora" class="login-btn">Loginするぞい</router-link>
  </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>

<style scoped>
.login-btn {
  padding: 10px;
  border-radius: 5px;
  background-color: #1e90ff;
  color: #fff;
  font-weight: bold;
  font-size: 20px;
  text-decoration: none;
}
</style>
