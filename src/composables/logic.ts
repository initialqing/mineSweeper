import { Ref } from "vue";
import { BlockState } from "~/types";
const directions = [
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
]
interface GameState{
    board:BlockState[][],
    mineGenerated:boolean,
    gameState:'play' | 'won' | 'lost'
}
export class GamePlay {
    state = ref() as Ref<GameState>
    constructor(public width: number, public height: number) {
        this.reset()
    }
    
    public get board() {
       return this.state.value.board
    }  
    
    reset() {
        this.state.value = {
            mineGenerated:false,
            gameState:'play',
            board:Array.from(
                {
                    length: this.height
                },
                (_, y) => Array.from(
                    {
                        length: this.width
                    },
                    (_, x): BlockState => ({ x, y, adjacentMines: 0, revealed: false })
                )
            )
        }
    }

    onRightClick(block: BlockState) {
        if (this.state.value.gameState !== 'play') {
            return
        }
        if (block.revealed) {
            return
        }
        block.flagged = !block.flagged
    }

    onClick(block: BlockState) {
        if (this.state.value.gameState !== 'play') {
            return
        }
        if (!this.state.value.mineGenerated) {
            this.generateMines(this.state.value.board, block)
            this.state.value.mineGenerated = true
        }
        block.revealed = true
        if (block.mine) {
            this.state.value.gameState = 'lost'
            this.showAllMines()
            return
        }
        this.expendZero(block)
    }
    showAllMines(){
        this.state.value.board.flat().forEach((item) =>{
            if(item.mine){
                item.revealed = true
            }
        })
    }
    updateNumbers() {
        this.board.forEach((row) => {
            row.forEach((block) => {
                if (block.mine) return
                this.getSilblings(block).forEach(b => {
                    if (b.mine) {
                        block.adjacentMines++
                    }
                });
            })
        })
    }
    expendZero(block: BlockState) {
        if (block.adjacentMines) {
            return
        }
        this.getSilblings(block).forEach(s => {
            if (!s.revealed) {
                // return
                s.revealed = true
                this.expendZero(s)
            }
        })

    }

    getSilblings(block: BlockState) {
        return directions.map(([dx, dy]) => {
            const x2 = block.x + dx;
            const y2 = block.y + dy;
            if (x2 >= this.width || x2 < 0 || y2 < 0 || y2 >= this.height) {
                return undefined
            }
            return this.board[y2][x2]
        })
            .filter(Boolean) as BlockState[]
    }

    generateMines(state: BlockState[][], initial: BlockState) {
        for (const row of state) {
            for (const block of row) {
                if (Math.abs(initial.x - block.x) < 1) {
                    continue
                }
                if (Math.abs(initial.y - block.y) < 1) {
                    continue
                }
                block.mine = Math.random() < 0.1
            }
        }
        this.updateNumbers()
    }


    checkState() {
        if (!this.state.value.mineGenerated) {
            return
        }
        const blocks = this.board.flat()
        if (blocks.every(block => block.revealed || block.flagged)) {
            if (blocks.some(block => block.flagged && !block.mine)) {
                this.state.value.gameState = 'lost'
                this.showAllMines()
                alert('lost')
            } else {
                this.state.value.gameState = 'won'
                alert('win')
            }
        }
    }

}