<script setup lang="ts">


import { isDev, toggleDev } from "~/composables";
import { GamePlay } from "~/composables/logic";

// 对炸弹进行计数
const mineRest = $computed(() => {
  if (!play.state.value.mineGenerated) {
    return play.mines
  }
  const lastMine = play.blocks.reduce((a, b) => a + (b.mine ? 1 : 0) - (b.flagged ? 1 : 0), 0)
  return lastMine <= 0 ? 0 : lastMine
})

function newGame(difficult: 'easy' | 'medium' | 'hard') {
  switch (difficult) {
    case 'easy':
      play.reset(9, 9, 10)
      break;
    case 'medium':
      play.reset(16, 16, 40)
      break;
    case 'hard':
      play.reset(16, 20, 99)
      break;
    default:
      break;
  }
}
const play = new GamePlay(9, 9, 10)
const state = computed(() => play.board)
useStorage('vueSweeper', play.state)

// 设计计时器
const now = $(useNow())
const timerMs = $computed(() => Math.round((+(play.state.value.endMs || now) - play.state.value.startMs) / 1000))


// 更新状态
watchEffect(() => {
  play.checkState()
})
</script>

<template>
  <div>
    MineSweeper

    <div fles="~ gap1" justify-center p4>
      <button @click="play.reset()" btn>
        New Game
      </button>
      <button @click="newGame('easy')" btn ml2 mr2>
        Easy
      </button>
      <button @click="newGame('medium')" btn>
        Medium
      </button>
      <button @click="newGame('hard')" btn ml-2>
        Hard
      </button>
    </div>

    <div flex justify-center gap10>
      <div font-mono flex="~ gap-1" items-center text-2xl>
        <div i-carbon-timer></div>
        {{ timerMs }}
      </div>
      <div font-mono flex="~ gap-1" items-center text-2xl>
        <div i-mdi-mine></div>
        {{ mineRest }}
      </div>
    </div>


    <div p6 w-auto scroll-auto overflow-auto>
      <div v-for="row, y in state" :key="y" flex="~ gap-1" items-center justify-center w-max ma>
        <MineBlock v-for="block, x in row" :key="x" :block="block" @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)" @dblclick="play.autoExpand(block)" />
      </div>

      <div flex="~ gap-5" justify-center m-7>
        <button @click="toggleDev()" btn>
          {{ isDev ? 'Dev' : 'NORMAL' }}
        </button>
      </div>
    </div>

    <Confetti :passed="play.state.value.status === 'won'" />
  </div>
</template>
