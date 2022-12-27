import { reactive, readonly, ReactiveFlags, reactiveMap, readonlyMap, shallowReadonlyMap } from './reactive'
import { track, trigger } from './effect'
import { isObject } from '@mini-vue/shared'

const get = createGetter()
const set = createSetter()

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.IS_SHALLOW) {
      return shallow
    } else if (key === ReactiveFlags.RAW && receiver === (
      isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReadonlyMap : reactiveMap
    ).get(target)) {
      return target
    }
    const res = Reflect.get(target, key, receiver)
    // 问题： 为什么 readonly 不进行依赖收集？
    // readonly 无法 set，即使收集依赖也不会 trigger.
    if (!isReadonly) {
      track(target, 'get', key)
    }
    if (shallow) {
      return res
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    return res
  }
}
function createSetter() {
  return function set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver)

    // 在 set 时，触发依赖
    trigger(target, 'set', key)

    return res
  }
}
export const mutableHandlers = {
  get,
  set
}

const readonlyGet = createGetter(true)
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    console.warn(`Set operation on key ${String(key)} failed: target is readonly`, target)
    return true
  }
}

const shallowReadonlyGet = createGetter(true, true)
export const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set(target, key) {
    console.warn(`Set operation on key ${String(key)} failed: target is readonly`, target)
    return true
  }
}