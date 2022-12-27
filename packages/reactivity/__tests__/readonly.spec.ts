import { isProxy, isReactive, isReadonly, readonly, shallowReadonly } from "../src/reactive"

describe('readonly', () => {
  it('should make nested values readonly', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)

    expect(wrapped).not.toBe(original)
    expect(isProxy(wrapped)).toBe(true)
    expect(isReactive(wrapped)).toBe(false)
    expect(isReadonly(wrapped)).toBe(true)
    expect(isReactive(original)).toBe(false)
    expect(isReadonly(original)).toBe(false)
    expect(isReactive(wrapped.bar)).toBe(false)
    expect(isReadonly(wrapped.bar)).toBe(true)
    // get
    expect(wrapped.foo).toBe(1)
  })
})

describe('shallowReadonly', () => {
  it('should not make non-reactive properties reactive', () => {
    const props = shallowReadonly({ n: { foo: 1 } })
    expect(isReadonly(props)).toBe(true)
    expect(isReactive(props.n)).toBe(false)
  })
  it('should diff form normal ', () => {
    const original = { foo: {} }
    const shallowProxy = shallowReadonly(original)
    const reactiveProxy = readonly(original)

    expect(shallowProxy).not.toBe(reactiveProxy)
    expect(isReadonly(shallowProxy.foo)).toBe(false)
    expect(isReadonly(reactiveProxy.foo)).toBe(true)
  })
})