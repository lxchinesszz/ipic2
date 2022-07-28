<template>
  <div id="ballWrapper"  v-mouse-drag="ballMove">
    <div class="ball">
      12321321
    </div>
  </div>
</template>

<script>
export default {
  name: 'ballPage',
  data () {
    return {
      name: 'liuxin'
    }
  },
  methods: {
    ballMove: function (pos) {
    }
  }
}
</script>

<style scoped>
#ballWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.ball {
  width: 100vw;
  height: 100vh;
  border-radius: 50%;
  background: radial-gradient(circle at 60% 40%, white, #2380be);
  background: -ms-radial-gradient(circle at 60% 40%, white, #2380be);
  background: -webkit-radial-gradient(circle at 60% 40%, white, #2380be);
  background: -moz-radial-gradient(circle at 60% 40%, white, #2380be);
}
</style>
