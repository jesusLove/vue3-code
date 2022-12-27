import { computed } from "../src/computed"
import { reactive } from "../src/reactive"

describe('computed', () => {
  it('happy path', () => {
    const value = reactive({ foo: 1 })
    const getter = computed(() => value.foo)
    value.foo = 2
    expect(getter.value).toBe(2)
  })
  it('should compute lazily', () => {
    const value = reactive({ foo: 1 })
    const getter = vi.fn(() => value.foo)
    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1);

    // 没有重新计算
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // 未重新计算
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1);

    // 重新计算值
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2);

    // 未重新计算
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);

  })
})