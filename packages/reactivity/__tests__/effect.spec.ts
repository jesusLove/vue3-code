import { effect } from "../src/effect"
import { reactive } from "../src/reactive"

describe('effect', () => {
  it('', () => {
    const fnSpy = vi.fn(() => { })
    effect(fnSpy)
    expect(fnSpy).toHaveBeenCalledTimes(1)
  })

  it('should observe basic properties', () => {
    let dummy;
    const counter = reactive({ num: 0 })
    effect(() => (dummy = counter.num))
    expect(dummy).toBe(0)
    counter.num = 7
    expect(dummy).toBe(7)
  })
  it('should observe multiple properties', () => {
    let dummy;
    const counter = reactive({ num1: 0, num2: 0 })
    effect(() => (dummy = counter.num1 + counter.num2))

    expect(dummy).toBe(0)
    counter.num1 = counter.num2 = 7
    expect(dummy).toBe(14)
  })
  it('should observe  multiple effect', () => {
    let dummy1, dummy2
    const counter = reactive({ num: 0 })

    effect(() => (dummy1 = counter.num))
    effect(() => (dummy2 = counter.num))

    expect(dummy1).toBe(0)
    expect(dummy2).toBe(0)
    counter.num++
    expect(dummy1).toBe(1)
    expect(dummy2).toBe(1)
  })
  it('should observe nested properties', () => {
    let dummy
    const counter = reactive({ nested: { num: 0 } })
    effect(() => (dummy = counter.nested.num))

    expect(dummy).toBe(0)
    counter.nested.num = 8
    expect(dummy).toBe(8)
  })
})