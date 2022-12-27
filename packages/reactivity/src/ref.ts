import { hasChanged, isObject } from "@mini-vue/shared";
import { createDep } from "./dep";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";


export class RefImpl {
  private _rawValue: any
  private _value: any
  public dep;
  public __v_isRef = true

  constructor(value) {
    this._rawValue = value
    // 如果 value 为 对象需要用 reactive 包裹
    this._value = convert(value)
    this.dep = createDep()
  }
  get value() {
    // 依赖收集
    return this._value
  }
  set value(newValue) {
    // 值发生改变时，更新值同时触发依赖
    if (hasChanged(newValue, this._rawValue)) {
      this._value = convert(newValue)
      this._rawValue = newValue

      // 触发依赖
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

export function ref(value) {
  return createRef(value)
}

function createRef(value) {
  const refImpl = new RefImpl(value)
  return refImpl
}

export function triggerRefValue(ref) {
  triggerEffects(ref.dep)
}
export function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}


export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

export function isRef(value) {
  return !!value.__v_isRef
}