<script setup lang="ts">


import { isDev, toggleDev } from "~/composables";
import { GamePlay } from "~/composables/logic";

const mineConnt = computed(() => {
  return play.blocks.reduce((a, b) => a + (b.mine ? 1 : 0), 0)
})

function newGame(difficult: 'easy' | 'medium' | 'hard') {
  switch (difficult) {
    case 'easy':
      play.reset(6, 6, 3)
      break;
    case 'medium':
      play.reset(12, 12, 10)
      break;
    case 'hard':
      play.reset(24, 24, 100)
      break;
    default:
      break;
  }
}
const play = new GamePlay(10, 10, 3)
const state = computed(() => play.board)
useStorage('vueSweeper', play.state)

watchEffect(() => {
  play.checkState()
})
</script>

<template>
  <div>
    MineSweeper
    <div fles="~ gap2" justify-center p4>
      <button @click="play.reset()" btn>
        New Game
      </button>
      <button @click="newGame('easy')" btn>
        easy
      </button>
      <button @click="newGame('medium')" btn>
        medium
      </button>
      <button @click="newGame('hard')" btn>
        hard
      </button>
    </div>


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
      </div>
    </div>

    <Confetti :passed="play.state.value.gameState === 'won'" />
  </div>
</template>
