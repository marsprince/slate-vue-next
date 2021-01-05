<template>
  <Slate :value="value">
    <button @click="clear">clear</button>
    <Editable placeholder="Enter some plain text..." spellcheck="true" autoCorrect="on" :autoFocus="false"></Editable>
  </Slate>
</template>

<script>
import { Slate, Editable } from 'slate-vue-next'

// this value is for editor
const initialValue = [
  {
    children: [
      { text: 'This is editable plain text, just like a <textarea>!' },
    ],
  },
]
export default {
  name: 'index',
  components: {
    Slate,
    Editable
  },
  setup() {
    return {
      value: JSON.stringify(initialValue)
    }
  },
  methods: {
    clear() {
      // this.$editor.clear()
    }
  }
};
</script>
