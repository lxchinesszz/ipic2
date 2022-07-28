<template>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.zep-enter-from,
.zep-leave-to{
  opacity: 0;
}
.zep-enter-to,
.zep-leave-from{
  opacity: 1;
}
.zep-enter-active,
.zep-leave-active{
  transition: opacity 1s ease;
}
</style>
