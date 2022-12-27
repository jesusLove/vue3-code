import { createDep } from './dep'
import { isArray, extend } from '@mini-vue/shared'
// 当前激活的 effect
let activeEffect = void 0
// 是否收集依赖
let shouldTrack = false
const targetMap = new WeakMap()

export class ReactiveEffect {
  active = true
  deps = []
  public onStop?: () => void
  constructor(public fn, public scheduler?) {
    console.log('创建 ReactiveEffect 对象')
  }
  run() {
    console.log('run')

    // 执行 fn 但不收集依赖
    if (!this.active) {
      return this.fn()
    }

    // 执行 fn 收集依赖
    shouldTrack = true
    activeEffect = this as any;

    console.log('执行用户传入的 fn')
    const result = this.fn()
    // 重置
    shouldTrack = false
    activeEffect = undefined
    return result
  }
  stop() {
    if (this.active) {
      // 为了防止重复调用
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}
function cleanupEffect(effect) {
  effect.deps.forEach(dep => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

export function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn)

  extend(_effect, options)
  _effect.run()

  // 把 _effect.run 返回，让用户决定调用时机（调用 fn)
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function stop(runner) {
  runner.effect.stop()
}

// 依赖收集
export function track(target, type, key) {
  if (!isTracking()) { return }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = createDep()

    depsMap.set(key, dep)
  }
  trackEffects(dep)
}
export function trackEffects(dep) {
  if (!dep.has(activeEffect)) {
    // 收集当前激活的 effect 作为依赖
    dep.add(activeEffect);
    // 当前激活的 effect 收集 dep 集合作为依赖
    (activeEffect as any).deps.push(dep)
  }
}

// 触发依赖
export function trigger(target, type, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  // 1. 存放收集到 dep, 统一处理
  let deps: Array<any> = []

  const dep = depsMap.get(key)

  deps.push(dep)

  const effects: Array<any> = []
  deps.forEach(dep => {
    effects.push(...dep)
  })

  triggerEffects(createDep(effects))
}

export function triggerEffects(dep) {
  const effects = isArray(dep) ? dep : [...dep]
  for (const effect of effects) {
    if (effect.scheduler) {
      // scheduler 用户可以选择调用时机
      effect.scheduler()
    } else {
      // 执行收集到的所有的 effect 的 run 方法
      effect.run()
    }
  }
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}