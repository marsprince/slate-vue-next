import { watch, WatchOptions, reactive, ObjectDirective } from 'vue'
import { isFunction } from '@vue/shared'

export const useEffect = (effectHandler: any, dependencies: any = []) => {
  return watch(dependencies, (changedDependencies, prevDependencies, onCleanUp) => {
    const effectCleaner = effectHandler(changedDependencies, prevDependencies);
    if (isFunction(effectCleaner)) {
      onCleanUp(effectCleaner);
    }
  }, { immediate: true, deep: true } as WatchOptions);
}

const handleRef = (el: HTMLElement, ref: any) => {
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
    handleRef(el, binding.value)
  }
}

export const useRef = (val: any) => {
  return reactive(
    {
      current: val || {}
    }
  )
}