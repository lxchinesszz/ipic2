<template>
  <div id="ballWrapper" v-mouse-drag="ballMove" v-on:dblclick="showMainWindow">
    <div id="clock" class="progress-clock">
      <button class="progress-clock__time-date" data-group="d" type="button">
        <small data-unit="w">Sunday</small><br>
        <span data-unit="mo">January</span>
        <span data-unit="d">1</span>
      </button>
      <button class="progress-clock__time-digit" data-unit="h" data-group="h" type="button">12</button>
      <span class="progress-clock__time-colon">:</span>
      <button class="progress-clock__time-digit" data-unit="m" data-group="m" type="button">00</button>
      <span class="progress-clock__time-colon">:</span>
      <button class="progress-clock__time-digit" data-unit="s" data-group="s" type="button">00</button>
      <span class="progress-clock__time-ampm" data-unit="ap">AM</span>
    </div>
  </div>
</template>

<script>
import ProgressClock from '@/utils/ProgressClock.js'

const {
  ipcRenderer
} =
  window.require('electron')
export default {
  name: 'ballTimePage',
  data () {
    return {
      name: 'liuxin'
    }
  },
  mounted () {
    // eslint-disable-next-line no-new
    new ProgressClock('#clock')

    window.addEventListener('contextmenu', function (e) {
      console.log('窗口菜单时间')
      ipcRenderer.invoke('setRightClickMenu')
      e.preventDefault()
      //
      // e.preventDefault();
      //
      // m.popup({window:remote.getCurrentWindow()});
    })
  },
  methods: {
    ballMove: function (pos) {
      ipcRenderer.send('ballMove', pos)
    },
    showMainWindow: function () {
      ipcRenderer.invoke('showMainWindow')
    }
  }
}
</script>

<style scoped>
body {
  background: none;
}

#ballWrapper {
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

* {
  border: 0;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

button {
  color: var(--fg);
  font: 1em/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

#clock {
  border-radius: 50%;
}

.progress-clock {
  display: grid;
  justify-content: center;
  align-content: center;
  position: relative;
  text-align: center;
  width: 100vw;
  height: 100vh;
  background-color: white;
  /*opacity: 0.9;*/
}

.progress-clock__time-date,
.progress-clock__time-digit,
.progress-clock__time-colon,
.progress-clock__time-ampm {
  transition: color 0.2s linear;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

.progress-clock__time-date,
.progress-clock__time-digit {
  background: transparent;
}

.progress-clock__time-date,
.progress-clock__time-ampm {
  grid-column: 1 / 6;
}

.progress-clock__time-date {
  font-size: 0.75em;
  line-height: 1.33;
}

.progress-clock__time-digit,
.progress-clock__time-colon {
  font-size: 1.5em;
  font-weight: 400;
  grid-row: 2;
}

.progress-clock__time-colon {
  line-height: 1.275;
}

.progress-clock__time-ampm {
  cursor: default;
  grid-row: 3;
}

.progress-clock__rings {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.progress-clock__ring {
  opacity: 0.1;
}

.progress-clock__ring-fill {
  transition: opacity 0s 0.3s linear,
  stroke-dashoffset 0.3s ease-in-out;
}

.progress-clock__ring-fill--360 {
  opacity: 0;
  stroke-dashoffset: 0;
  transition-duration: 0.3s;
}

[data-group]:focus {
  outline: transparent;
}

[data-units] {
  transition: opacity 0.2s linear;
}

[data-group="d"]:focus,
[data-group="d"]:hover {
  color: hsl(333, 90%, 55%);
}

[data-group="h"]:focus,
[data-group="h"]:hover {
  color: hsl(33, 90%, 55%);
}

[data-group="m"]:focus,
[data-group="m"]:hover {
  color: hsl(213, 90%, 55%);
}

[data-group="s"]:focus,
[data-group="s"]:hover {
  color: hsl(273, 90%, 55%);
}

[data-group]:focus ~ .progress-clock__rings [data-units],
[data-group]:hover ~ .progress-clock__rings [data-units] {
  opacity: 0.2;
}

[data-group="d"]:focus ~ .progress-clock__rings [data-units="d"],
[data-group="d"]:hover ~ .progress-clock__rings [data-units="d"],
[data-group="h"]:focus ~ .progress-clock__rings [data-units="h"],
[data-group="h"]:hover ~ .progress-clock__rings [data-units="h"],
[data-group="m"]:focus ~ .progress-clock__rings [data-units="m"],
[data-group="m"]:hover ~ .progress-clock__rings [data-units="m"],
[data-group="s"]:focus ~ .progress-clock__rings [data-units="s"],
[data-group="s"]:hover ~ .progress-clock__rings [data-units="s"] {
  opacity: 1;
}

@media (prefers-color-scheme: dark) {
  .progress-clock {
    background-color: #333;
  }

  [data-group="h"], [data-group="d"], [data-group="m"], [data-group="s"], .progress-clock__time-ampm {
    color: white;
  }

  .progress-clock__ring {
    opacity: 0.2;
  }
}

@media (prefers-color-scheme: light) {
  .progress-clock {
    /*background-color: red;*/
  }

  .progress-clock__ring {
    opacity: 0.2;
  }
}
</style>
