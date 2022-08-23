import { describe, expect, it } from 'vitest'
function foo() {
  return Math.sqrt(4)
}
describe('should', () => {
  it('should works', () => {
    expect(foo()).toMatchInlineSnapshot('2')
  })
})
