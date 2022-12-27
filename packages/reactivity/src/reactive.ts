import { isObject } from '@mini-vue/shared'
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw'
}

export const reactiveMap = new WeakMap()
export const readonlyMap = new WeakMap()
export const shallowReadonlyMap = new WeakMap()

export function reactive(target) {
  if (target && isReadonly(target)) return target
  return createReactiveObject(target, false, reactiveMap, mutableHandlers)
}

export function readonly(target) {
  return createReactiveObject(target, true, readonlyMap, readonlyHandlers)
}
export function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyMap, shallowReadonlyHandlers)
}

function createReactiveObject(target, isReadonly, proxyMap, baseHandlers) {
  // target 必须对象或数组类型
  if (!isObject(target)) return target

  // target 已是 Proxy 对象，直接返回
  // 例外：如果 readonly 作为响应式对象时，则继续。
  if (target[ReactiveFlags.RAW] && !(isReadonly && target[ReactiveFlags.IS_REACTIVE])) return target

  const exisitingProxy = proxyMap.get(target)
  if (exisitingProxy) {
    return exisitingProxy
  }
  const proxy = new Proxy(target, baseHandlers)

  proxyMap.set(target, proxy)

  return proxy
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value)
}

export function isReactive(value): boolean {
  if (isReadonly(value)) {
    return isReactive((value as any)[ReactiveFlags.RAW])
  }
  return !!(value as any)[ReactiveFlags.IS_REACTIVE]
}
export function isReadonly(value): boolean {
  return !!(value as any)[ReactiveFlags.IS_READONLY]
}
export function isShallow(value): boolean {
  return !!(value as any)[ReactiveFlags.IS_SHALLOW]
}
export function toRaw(value) {
  const raw = value && (value as any)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : value
}