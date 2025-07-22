const { CompositeDisposable } = require('atom')

module.exports = {

  activate() {
    this.global = false
    this.switch = null
    this.disposables = new CompositeDisposable()
    this.disposables.add(
      atom.config.onDidChange('overtype-mode.statusBar', (e) => {
        e.newValue ? this.activateStatusBar() : this.deactivateStatusBar()
      }),
      atom.textEditors.observe((editor) => {
        this.update(editor) ; this.toggle(editor, this.global)
      }),
      atom.commands.add('atom-text-editor', {
        'overtype-mode:toggle-global': () => { this.toggleGlobal() },
        'overtype-mode:toggle-editor': (e) => { this.toggleViaEvent(e) },
      }),
    )
  },

  deactivate() {
    this.disposables.dispose()
  },

  update(editor) {
    if (typeof editor.overtypeMode==="boolean") {
      return
    }
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

  toggle(editor, mode) {
    this.update(editor)
    if (typeof mode==='boolean') {
      editor.overtypeMode = mode
    } else {
      editor.overtypeMode = !editor.overtypeMode
    }
    if (editor.overtypeMode) {
      editor.element.classList.add('overtype-cursor')
    } else {
      editor.element.classList.remove('overtype-cursor')
    }
  },

  toggleViaEvent(e) {
    const element = e.target.closest('atom-text-editor')
    const editor = element.getModel()
    this.toggle(editor)
  },

  toggleGlobal() {
    this.global = !this.global
    for (const element of document.getElementsByTagName('atom-text-editor')) {
      const editor = element.getModel()
      this.toggle(editor, this.global)
    }
    if (this.switch) { this.switch.update() }
  },

  consumeStatusBar(statusBar) {
    this.statusBar = statusBar
    if (!atom.config.get('overtype-mode.statusBar')) { return }
    this.activateStatusBar()
  },

  activateStatusBar() {
    if (!this.statusBar) { return }
    this.switch = this.createSwitch()
    this.switch.update()
    this.statusBar.addRightTile({ item:this.switch, priority:-80 })
  },

  deactivateStatusBar() {
    if (!this.switch) { return }
    this.switch.remove() ; this.switch = null
  },

  createSwitch () {
    const element = document.createElement('div')
    element.classList.add('overtype-mode-icon', 'inline-block')
    let iconSpan = document.createElement('span')
    iconSpan.classList.add('icon', 'is-icon-only', 'icon-ruby')
    element.appendChild(iconSpan)
    element.onmouseup = (e) => {
      if (e.which===1) { this.toggleGlobal() }
    }
    element.update = () => {
      if (this.global) {
        iconSpan.classList.add('active')
      } else {
        iconSpan.classList.remove('active')
      }
    }
    return element
  },
}
