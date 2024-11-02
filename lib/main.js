'use babel'

const { CompositeDisposable } = require('atom')

export default {

  activate() {
    // initialize
    this.target = null
    this.editor = null

    // commands
    this.disposables = new CompositeDisposable()
    this.disposables.add(atom.commands.add('atom-text-editor', {
      'overtype-mode:toggle':  (e) => { this.event(e) ; this.toggle() },
    }))
  },

  deactivate() {
    this.disposables.dispose()
  },

  event(e) {
    // target change if needed
    if (e.target==this.target) {
      return
    }
    this.target = e.target

    // get new editor
    const element = this.target.closest('atom-text-editor')
    if (!element) { return }
    const editor = element.getModel()
    if (!editor) { return }

    // update editor
    this.update(editor)
  },

  update(editor) {
    this.editor = editor

    // check if patch is needed
    if (typeof editor.overtypeMode == "boolean") {
      return
    }

    // patch editor
    editor.overtypeMode = false
    let sub = editor.onWillInsertText(() => {
      if (!editor.overtypeMode) {
        return
      }
      if (!(window.event instanceof TextEvent)) {
        return
      }
      for (const selection of editor.getSelections()) {
        if (selection.isEmpty() && selection.cursor.isAtEndOfLine()) {
          continue
        }
        if (selection.isEmpty()) { selection.selectRight() }
      }
    })
    editor.disposables.add(sub)
  },

  toggle() {
    if (!this.editor.overtypeMode) {
      this.editor.overtypeMode = true
      this.editor.element.classList.add('overtype-cursor')
    } else {
      this.editor.overtypeMode = false
      this.editor.element.classList.remove('overtype-cursor')
    }
  },
}
