import Children from './children';
import { useEditor, useEffect, useRef } from '../plugins';
import {
  EDITOR_TO_ELEMENT, NODE_TO_ELEMENT, ELEMENT_TO_NODE, IS_READ_ONLY,
  IS_FIREFOX, IS_SAFARI, IS_EDGE_LEGACY,
  DOMStaticRange,
  addOnBeforeInput,
  EditableComponent,
  VueEditor
} from 'slate-vue-shared';
import { Range } from 'slate';
import { PropType, defineComponent, ref } from 'vue';

interface IEvent extends Event {
  data: string | null
  dataTransfer: DataTransfer | null
  getTargetRanges(): DOMStaticRange[]
  inputType: string
  isComposing: boolean
}

// COMPAT: Firefox/Edge Legacy don't support the `beforeinput` event
const HAS_BEFORE_INPUT_SUPPORT = !(IS_FIREFOX || IS_EDGE_LEGACY)

/**
 * A default memoized decorate function.
 */
const defaultDecorate = () => []

type PropsEventListener = PropType<(event: any) => void>

// the contentEditable div
export const Editable = defineComponent({
  // some global props will provide for child component
  props: {
    autoFocus: Boolean,
    renderLeaf: Function,
    renderElement: Function,
    readOnly: {
      type: Boolean as PropType<boolean>,
      default: () => false
    },
    decorate: {
      type: Function,
      default: defaultDecorate
    },
    placeholder: String,
    spellCheck: Boolean,
    autoCorrect: String,
    autoCapitalize: String,

    // user event
    onBeforeInput: {
      type: Function as PropsEventListener
    },
    onKeyDown: {
      type: Function as PropsEventListener
    },
    onClick: {
      type: Function as PropsEventListener
    },
    onCompositionEnd: {
      type: Function as PropsEventListener
    },
    onCompositionStart: {
      type: Function as PropsEventListener
    },
    onCut: {
      type: Function as PropsEventListener
    },
    onCopy: {
      type: Function as PropsEventListener
    },
    onDragOver: {
      type: Function as PropsEventListener
    },
    onDragStart: {
      type: Function as PropsEventListener
    },
    onDragStop: {
      type: Function as PropsEventListener
    },
    onPaste: {
      type: Function as PropsEventListener
    },
    onFocus: {
      type: Function as PropsEventListener
    },
    onBlur: {
      type: Function as PropsEventListener
    },
    onDrop: {
      type: Function as PropsEventListener
    },
  },
  components: {
    Children
  },
  provide(): object {
    return {
      'renderLeaf': this.renderLeaf,
      'renderElement': this.renderElement,
      'decorate': this.decorate,
      'readOnly': this.readOnly,
      'placeholder': this.placeholder
    }
  },
  setup(props) {
    const $ref = useRef(null);
    const isComposing = ref(false)
    const isUpdatingSelection = ref(false)
    const latestElement = ref(null)

    const editor = useEditor()

    const eventMethods = {
        _onClick(event: IEvent) {
          EditableComponent.onClick(event, editor, this)
        },
        onSelectionchange() {
          EditableComponent.onSelectionchange(useEditor(), this)
        },
        _onBeforeInput(event: IEvent) {
          EditableComponent.onBeforeInput(event, useEditor(), this)
        },
        _onCompositionEnd(event: any) {
          EditableComponent.onCompositionEnd(event, useEditor(), this)
        },
        _onCompositionStart(event: IEvent) {
          EditableComponent.onCompositionStart(event, useEditor(), this)
        },
        _onKeyDown(event: any) {
          EditableComponent.onKeyDown(event, useEditor(), this)
        },
        _onFocus(event: any) {
          EditableComponent.onFocus(event, useEditor(), this)
        },
        _onBlur(event: any) {
          EditableComponent.onBlur(event, useEditor(), this)
        },
        _onCopy(event: any) {
          EditableComponent.onCopy(event, useEditor(), this)
        },
        _onPaste(event: any) {
          EditableComponent.onPaste(event, useEditor(), this)
        },
        _onCut(event: any) {
          EditableComponent.onCut(event, useEditor(), this)
        },
        _onDragOver(event: any) {
          EditableComponent.onDragOver(event, useEditor(), this)
        },
        _onDragStart(event: any) {
          EditableComponent.onDragStart(event, useEditor(), this)
        },
        _onDrop(event: any) {
          EditableComponent.onDrop(event, useEditor(), this)
        }
      };

    const dataAndMethods = {
      $ref,
      isComposing,
      isUpdatingSelection,
      latestElement,
      ...eventMethods
    }

    IS_READ_ONLY.set(editor, props.readOnly)

    const initListener = ()=>{
      // Attach a native DOM event handler for `selectionchange`
      useEffect(()=>{
        document.addEventListener('selectionchange', dataAndMethods.onSelectionchange)
        return () => {
          document.removeEventListener('selectionchange', dataAndMethods.onSelectionchange)
        }
      });
    };
    const updateAutoFocus = () => {
      useEffect(() => {
        if ($ref.current && props.autoFocus) {
          // can't focus in current event loop?
          setTimeout(()=>{
            $ref.current.focus()
          }, 0)
        }
      }, [props.autoFocus])
    }
    const updateRef = () => {
      // Update element-related weak maps with the DOM element ref.
      useEffect(() => {
        if ($ref.current) {
          EDITOR_TO_ELEMENT.set(editor, $ref.current)
          NODE_TO_ELEMENT.set(editor, $ref.current)
          ELEMENT_TO_NODE.set($ref.current, editor)
        } else {
          NODE_TO_ELEMENT.delete(editor)
        }
      })
    };
    const updateSelection = () => {
      useEffect(() => {
        const { selection } = editor
        const domSelection = window.getSelection()

        if (isComposing.value || !domSelection || !VueEditor.isFocused(editor)) {
          return
        }

        const hasDomSelection = domSelection.type !== 'None'

        // If the DOM selection is properly unset, we're done.
        if (!selection && !hasDomSelection) {
          return
        }

        // verify that the dom selection is in the editor
        const editorElement = EDITOR_TO_ELEMENT.get(editor)!
        let hasDomSelectionInEditor = false
        if (
          editorElement.contains(domSelection.anchorNode) &&
          editorElement.contains(domSelection.focusNode)
        ) {
          hasDomSelectionInEditor = true
        }

        // If the DOM selection is in the editor and the editor selection is already correct, we're done.
        if (
          hasDomSelection &&
          hasDomSelectionInEditor &&
          selection &&
          Range.equals(VueEditor.toSlateRange(editor, domSelection), selection)
        ) {
          return
        }

        // Otherwise the DOM selection is out of sync, so update it.
        const el = VueEditor.toDOMNode(editor, editor)
        isUpdatingSelection.value = true

        const newDomRange = selection && VueEditor.toDOMRange(editor, selection)

        if (newDomRange) {
          if (Range.isBackward(selection as Range)) {
            domSelection.setBaseAndExtent(
              newDomRange.endContainer,
              newDomRange.endOffset,
              newDomRange.startContainer,
              newDomRange.startOffset
            )
          } else {
            domSelection.setBaseAndExtent(
              newDomRange.startContainer,
              newDomRange.startOffset,
              newDomRange.endContainer,
              newDomRange.endOffset
            )
          }
          const leafEl = newDomRange.startContainer.parentElement!
          // scrollIntoView(leafEl, {
          //   scrollMode: 'if-needed',
          //   boundary: el,
          // })
        } else {
          domSelection.removeAllRanges()
        }

        setTimeout(() => {
          // COMPAT: In Firefox, it's not enough to create a range, you also need
          // to focus the contenteditable element too. (2016/11/16)
          if (newDomRange && IS_FIREFOX) {
            el.focus()
          }

          isUpdatingSelection.value = false
        })
      })
    }

    // init selectionchange
    initListener();
    // Update element-related weak maps with the DOM element ref.
    updateRef();
    // Whenever the editor updates, make sure the DOM selection state is in sync.
    updateSelection();
    // The autoFocus TextareaHTMLAttribute doesn't do anything on a div, so it
    // needs to be manually focused.
    updateAutoFocus();
    // patch beforeinput in FireFox
    if(IS_FIREFOX) {
      useEffect(() => {
        addOnBeforeInput($ref.current, true)
      }, [])
    }

    return dataAndMethods
  },
  render() {
    const editor = useEditor();
    const {$ref} = this;
    // name must be corresponded with standard
    const on: any  = {
      click: this._onClick,
      keydown: this._onKeyDown,
      focus: this._onFocus,
      blur: this._onBlur,
      beforeinput: this._onBeforeInput,
      copy: this._onCopy,
      cut: this._onCut,
      compositionend: this._onCompositionEnd,
      compositionstart: this._onCompositionStart,
      dragover: this._onDragOver,
      dragstart: this._onDragStart,
      drop: this._onDrop,
      paste: this._onPaste
    };
    const attrs = {
      spellcheck: !HAS_BEFORE_INPUT_SUPPORT ? undefined : this.spellCheck,
      autocorrect: !HAS_BEFORE_INPUT_SUPPORT ? undefined : this.autoCorrect,
      autocapitalize: !HAS_BEFORE_INPUT_SUPPORT ? undefined : this.autoCapitalize,
    }
    return (
      <div
        // COMPAT: The Grammarly Chrome extension works by changing the DOM
        // out from under `contenteditable` elements, which leads to weird
        // behaviors so we have to disable it like editor. (2017/04/24)
        data-gramm={false}
        role={this.readOnly ? undefined : 'textbox'}
        v-ref = {$ref}
        contenteditable={this.readOnly ? false : true}
        data-slate-editor
        data-slate-node="value"
        style={{
         // Prevent the default outline styles.
         outline: 'none',
         // Preserve adjacent whitespace and new lines.
         whiteSpace: 'pre-wrap',
         // Allow words to break if they are too long.
         wordWrap: 'break-word',
         // Allow for passed-in styles to override anything.
         // ...style,
        }}
        {...{on}}
        {...{attrs}}
        >
        <Children
          node={editor}
        />
      </div>
    )
  }
})
