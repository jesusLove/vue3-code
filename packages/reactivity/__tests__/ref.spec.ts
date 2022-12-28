import { effect } from "../src/effect"
import { reactive } from "../src/reactive"
import { isRef, proxyRefs, ref, unRef } from "../src/ref"

describe('ref', () => {
  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    let calls = 0

    effect(() => {
      calls++
      dummy = a.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
  })
  it('should make nested properties reactive', () => {
    const a = ref({ count: 1 })
    let dummy
    effect(() => {
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })

  it('isRef', () => {
    const a = ref(1)
    const user = reactive({ age: 1 })
    expect(isRef(a)).toBe(true)
    expect(isRef(1)).toBe(false)
    expect(isRef(user)).toBe(false)
  })
  it('unRef', () => {
    const a = ref(1)

    expect(unRef(a)).toBe(1)
    expect(unRef(1)).toBe(1)
  })
  it('proxyRefs', () => {
    const a = {
      age: ref(10)
    }
    const proyxRefA = proxyRefs(a)
    expect(a.age.value).toBe(10)
    expect(proyxRefA.age).toBe(10)
    // 修改 age 值
    proyxRefA.age = 20
    expect(proyxRefA.age).toBe(20)
    expect(a.age.value).toBe(20)
  })
})