<template>
  <div class="vue-touch-keyboard">
    <div class="keyboard">
      <div class="line" v-for="(line, index) in keySet" :key="index">
        <span v-for="(key, index) in line" :key="index" 
        :class="getClassesOfKey(key)" v-html="getCaptionOfKey(key)" @click="e =&gt; clickKey(e, key)"
        @mousedown="mousedown" :style="getKeyStyle(key)">
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// import Layouts from './layouts'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'

export default {
  props: {
    input: HTMLInputElement,
    layout: [String, Object],
    accept: Function,
    cancel: Function,
    change: Function,
    next: Function,
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      currentKeySet: 'default',
      inputScrollLeft: 0,
      Layouts: {
        'normal': {
          _meta: {
            'tab': {key: '\t', text: 'Tab', width: 60, classes: 'control'},
            'shiftl': {keySet: 'shifted', text: '123#%', width: 100, classes: 'control'},
            'shiftr': {keySet: 'default', text: 'abc', width: 100, classes: 'control'},
            'caps': {keySet: 'capsed', text: 'ABC', width: 100, classes: 'control'},
            'space': {key: ' ', text: 'Space', width: 100},
            'enter': {key: '\r\n', text: 'Enter', width: 80, classes: 'control enter'},
            'backspace': {func: 'backspace', text: '&#8592;  Xóa', classes: 'control backspace', width: 65},
            'accept': {func: 'accept', text: 'Close', classes: 'control featured', width: 30},
            'next': {func: 'next', text: 'Next', classes: 'control featured'},
            'emty': {key: '', text: '', width: 60, classes: 'control emty'}
          },

          default: [
            // '1 2 3 4 5 6 7 8 9 0 - [ ]',
            'q w e r t y u i o p _ {backspace}',
            'a s d f g h j k l : ; {enter}',
            'z x c v b n m , . {caps} {shiftl}',
            '{next} {space} {accept}'
          ],
          shifted: [
            '1 2 3 4 5 6 7 8 9 0 {backspace}',
            '! @ # $ % & * ( ) ? {enter}',
            '- / : ; _ < > | + = {shiftr}',
            '{next} {space} {accept}'
          ],
          capsed: [
            'Q W E R T Y U I O P _ {backspace}',
            'A S D F G H J K L : ; {enter}',
            'Z X C V B N M , . {shiftr} {shiftl}',
            '{next} {space} {accept}'
          ]
        },
        'compact': {
          _meta: {
            'default': {keySet: 'default', text: 'abc', classes: 'control'},
            'alpha': {keySet: 'default', text: 'Abc', classes: 'control'},
            'shift': {keySet: 'shifted', text: 'ABC', classes: 'control'},
            'numbers': {keySet: 'numbers', text: '123', classes: 'control'},
            'space': {key: ' ', text: 'Space', width: 200},
            'backspace': {func: 'backspace', classes: 'control'},
            'accept': {func: 'accept', text: 'Close', classes: 'control featured'},
            'next': {func: 'next', text: 'Next', classes: 'featured'},
            'zero': {key: '0', width: 130}
          },

          default: [
            'q w e r t y u i o p',
            ' a s d f g h j k l ',
            '{shift} z x c v b n m {backspace}',
            '{numbers} , {space} . {next} {accept}'
          ],

          shifted: [
            'Q W E R T Y U I O P',
            ' A S D F G H J K L ',
            '{default} Z X C V B N M ',
            '{numbers} _ {space} {backspace} {next} {accept}'
          ],

          numbers: [
            '1 2 3',
            '4 5 6',
            '7 8 9',
            '  {alpha} . {zero} {backspace} {next} {accept}'
          ]
        },
        'numeric': {

          _meta: {
            'backspace': {func: 'backspace', classes: 'control'},
            'accept': {func: 'accept', text: 'Close', classes: 'control featured'},
            'next': {func: 'next', text: 'Next', classes: 'control featured'},
            'zero': {key: '0', width: 130}
          },

          default: [
            '1 2 3',
            '4 5 6',
            '7 8 9',
            '_ - . {zero} {backspace} {next} {accept}'
          ]
        }
      }
    }
  },
  computed: {
    keySet () {
      let layout = this.getLayout()
      if (!layout) return
      let keySet = layout[this.currentKeySet]
      if (!keySet) return
      let res = []
      let meta = layout['_meta'] || {}
      keySet.forEach(line => {
        let row = []
        line.split(' ').forEach(item => {
          if (isObject(item)) {
            row.push(item)
          } else if (isString(item)) {
            if (
              item.length > 2 &&
              item[0] === '{' &&
              item[item.length - 1] === '}'
            ) {
              let name = item.substring(1, item.length - 1)
              if (meta[name]) row.push(meta[name])
              else console.warn('Missing named key from meta: ' + name)
            } else {
              if (item === '') {
                // Placeholder
                row.push({
                  placeholder: true
                })
              } else {
                // Normal key
                row.push({
                  key: item,
                  text: item
                })
              }
            }
          }
        })
        res.push(row)
      })
      return res
    }
  },
  watch: {
    layout () {
      console.log('Layout changed')
      this.currentKeySet = 'default'
    }
  },
  methods: {
    getLayout () {
      if (isString(this.layout)) {
        return this.Layouts[this.layout]
      }
      return this.layout
    },
    changeKeySet (name) {
      let layout = this.getLayout()
      if (layout[name] != null) {
        this.currentKeySet = name
      }
    },
    toggleKeySet (name) {
      this.currentKeySet = this.currentKeySet === name ? 'default' : name
    },
    getCaptionOfKey (key) {
      return key.text || key.key || ''
    },
    getClassesOfKey (key) {
      if (key.placeholder) {
        return 'placeholder'
      } else {
        let classes = 'key ' + (key.func || '') + ' ' + (key.classes || '')
        if (key.keySet && this.currentKeySet === key.keySet) {
          classes += ' activated'
        }
        return classes
      }
    },
    getKeyStyle (key) {
      if (key.width) {
        return {
          flex: key.width
        }
      }
    },
    supportsSelection () {
      return /text|password|search|tel|url/.test(this.input.type)
    },
    getCaret () {
      if (this.supportsSelection()) {
        let pos = {
          start: this.input.selectionStart || 0,
          end: this.input.selectionEnd || 0
        }
        if (pos.end < pos.start) pos.end = pos.start
        return pos
      } else {
        let val = this.input.value
        return {
          start: val.length,
          end: val.length
        }
      }
    },
    backspace (caret, text) {
      text = text.substring(0, caret.start - 1) + text.substring(caret.start)
      caret.start -= 1
      caret.end = caret.start
      return text
    },
    insertChar (caret, text, ch) {
      text = text.substr(0, caret.start) + ch.toString() + text.substr(caret.start)
      caret.start += ch.length
      caret.end = caret.start
      return text
    },
    mousedown (e) {
      if (!this.input) return
      if (this.options.preventClickEvent) e.preventDefault()
      this.inputScrollLeft = this.input.scrollLeft
    },

    clickKey (e, key) {
      if (!this.input) return
      if (this.options.preventClickEvent) e.preventDefault()
      let caret = this.getCaret()
      let text = this.input.value
      let addChar = null
      if (typeof key === 'object') {
        if (key.keySet) {
          this.toggleKeySet(key.keySet)
        } else if (key.func) {
          switch (key.func) {
            case 'backspace': {
              text = this.backspace(caret, text)
              break
            }
            case 'accept': {
              if (this.accept) this.cancel()
              return
            }
            case 'cancel': {
              if (this.cancel) this.cancel()
              return
            }
            case 'next': {
              if (this.next) this.next()
              return
            }
          }
        } else {
          addChar = key.key
        }
      } else {
        addChar = key
      }
      if (addChar) {
        if (this.input.maxLength <= 0 || text.length < this.input.maxLength) {
          if (this.options.useKbEvents) {
            let e = document.createEvent('Event')
            e.initEvent('keydown', true, true)
            e.which = e.keyCode = addChar.charCodeAt()
            if (this.input.dispatchEvent(e)) {
              text = this.insertChar(caret, text, addChar)
            }
          } else {
            text = this.insertChar(caret, text, addChar)
          }
        }
        // if (this.currentKeySet === 'shifted') this.changeKeySet('default')
      }
      this.input.value = text
      this.setFocusToInput(caret)
      if (this.change) {
        this.change(text, addChar)
      }
      if (this.input.maxLength > 0 && text.length >= this.input.maxLength) {
        // The value reached the maxLength
        if (this.next) this.next()
      }
    },
    setFocusToInput (caret) {
      this.input.focus()
      if (caret && this.supportsSelection()) {
        this.input.selectionStart = caret.start
        this.input.selectionEnd = caret.end
      }
    },
    closeKeyboard () {
      this.cancel()
    }
  },
  mounted () {
    if (this.input) {
      this.setFocusToInput()
    }
  }
}
</script>
