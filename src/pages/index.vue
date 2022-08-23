<script setup lang="ts">


import { isDev, toggleDev } from "~/composables";
import { GamePlay } from "~/composables/logic";
const mineConnt = computed(() => {
  return play.blocks.reduce((a, b) => a + (b.mine ? 1 : 0), 0)
})
const play = new GamePlay(10, 10, 10)
const state = computed(() => play.board)
useStorage('vueSweeper', play.state)

watchEffect(() => {
  play.checkState()
})
</script>

<template>
  <div>
    MineSweeper
    <div p6 w-auto scroll-auto overflow-auto>
      <div v-for="row, y in state" :key="y" flex="~ gap-1" items-center justify-center w-max ma>
        <MineBlock v-for="block, x in row" :key="x" :block="block" @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)" />
      </div>

      <div> Count: {{ mineConnt }} </div>

      <div flex="~ gap-5" justify-center m-7>
        <button @click="toggleDev()" btn>
          {{ isDev ? 'Dev' : 'NORMAL' }}
        </button>
        <button @click="play.reset()" btn>
          RESET
        </button>
      </div>
    </div>
  </div>
</template>
