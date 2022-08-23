<template>
     <button  
          w-8 h-8 m="0.5" border="2 gray-400/50 " hover="" 
          items-center justify-center  
          :class="getBlockClass(block)" 
          flex="~" >
          <template v-if="block.flagged">
            <div i-mdi-flag text-red/>
          </template>
          <template v-else-if="block.revealed || isDev">
            <div v-if="block.mine" i-mdi-mine/>
            <div v-else>{{  block.adjacentMines }}</div>
          </template>
        </button>
</template>

<script setup lang="ts">
import type { BlockState } from '~/types';
import { isDev } from '~/composables'
defineProps<{ block:BlockState }>()

const numberColors = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-pink-500',
  'text-purple-500',
  'text-teal-500',
  'text-red-500',
]

function getBlockClass(block: BlockState) {
  if (block.flagged) {
    return 'bg-gray-500/10'
  }
  if(!block.revealed) {
    return 'bg-gray-500/10 hover:bg-orange-9/50'
  }
  return block.mine ? 'bg-red-500/50' : numberColors[block.adjacentMines]
}
</script>

<style scoped>

</style>