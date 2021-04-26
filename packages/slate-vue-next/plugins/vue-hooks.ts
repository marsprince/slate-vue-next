import { watch, WatchOptions, reactive, ObjectDirective, onMounted, onUnmounted, onUpdated } from 'vue'
import { isFunction, isArray } from '@vue/shared'

export const useEffect = (effectHandler: any, dependencies?: any) => {
  if(dependencies === undefined) {
    onMounted(effectHandler)
    onUpdated(effectHandler)
  } else if(isArray(dependencies) && dependencies.length === 0) {
    onMounted(effectHandler)
    onUnmounted(effectHandler)
  } else {
    return watch(dependencies, (changedDependencies, prevDependencies, onCleanUp) => {
      const effectCleaner = effectHandler(changedDependencies, prevDependencies);
      if (isFunction(effectCleaner)) {
        onCleanUp(effectCleaner);
      }
    }, { immediate: true, deep: true } as WatchOptions);
  }
}

const handleRef = (el: HTMLElement | null, ref: any) => {
  if(typeof ref === 'function') {
    ref(el)
  } else {
    ref.current = el
  }
}

/**
 * v-ref directive same as ref in react
 */
export const vRef: ObjectDirective<HTMLElement> = {
  mounted(el, binding) {
    handleRef(el, binding.value)
  },
  updated(el, binding) {
    handleRef(el, binding.value)
  },
  unmounted(el, binding) {
    handleRef(null, binding.value)
  }
}

export const useRef = (val: any) => {
  return reactive(
    {
      current: val
    }
  )
}