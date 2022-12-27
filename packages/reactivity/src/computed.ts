import { createDep } from "./dep";
import { ReactiveEffect } from "./effect"
import { trackRefValue, triggerRefValue } from "./ref";

export class ComputedRefImpl {
  public dep: any
  public effect: ReactiveEffect

  private _dirty: boolean
  private _value;

  constructor(getter) {
    this._dirty = true
    this.dep = createDep()
    this.effect = new ReactiveEffect(getter, () => {
      // scheduler
      // 只要触发这个函数，说明值发生改变。
      // 解锁，后续再的 get 中重新计算新值
      if (this._dirty) return
      this._dirty = true
      triggerRefValue(this)
    })
  }
  get value() {
    trackRefValue(this)
    // 锁上，只调用一次，当数据改变时才解锁。
    // 解锁是在 scheduler 中操作的。
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter)
}