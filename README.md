# overtype-mode

Replace existing text as you type instead of inserting. Enables overtype/overwrite mode with visual block cursor and status bar indicator.

## Features

- **Toggle mode**: Switch globally or per editor.
- **Block cursor**: Visual feedback in overtype mode.
- **Status indicator**: Shows current mode in status bar.
- **Line-aware**: Respects line endings when overwriting.

## Installation

To install `overtype-mode` search for [overtype-mode](https://web.pulsar-edit.dev/packages/overtype-mode) in the Install pane of the Pulsar settings or run `ppm install overtype-mode`. Alternatively, you can run `ppm install asiloisad/pulsar-overtype-mode` to install a package directly from the GitHub repository.

## Commands

Commands available in `atom-workspace`:

- `overtype-mode:toggle-global`: (`Insert`) toggle overtype mode for all editors.

Commands available in `atom-text-editor`:

- `overtype-mode:toggle-editor`: (`Alt+Insert`) toggle overtype mode for current editor only.

## Customization

The style can be adjusted according to user preferences in the `styles.less` file:

- e.g. change block cursor style:

```less
atom-text-editor.overtype-cursor .cursors .cursor {
  border-color: @syntax-cursor-color;
  background-color: fade(@syntax-cursor-color, 30%);
}
```

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub — any feedback's welcome!
