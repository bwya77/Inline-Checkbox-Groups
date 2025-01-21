# Inline Checkbox Groups for Obsidian

Create multiple checkboxes on a single line, separated by a customizable separator character, with automatic text strikethrough when all tasks are completed. Perfect for creating compact task groups, progress trackers, and status indicators.

## Demo
![Demo video](/images/demo1.gif) 

## Features

- **Inline Checkboxes**: Create multiple checkboxes on a single line
- **Custom Separators**: Choose your preferred separator character (default: '|')
- **Auto Strikethrough**: Optionally cross out text when all checkboxes in a group are checked
- **Live Preview**: Changes reflect immediately in both edit and preview modes
- **Clean Interface**: Maintains Obsidian's native checkbox styling
- **Resource Efficient**: Optimized for performance with minimal overhead

## Examples

Create grouped tasks with a separator:
```markdown
[x] Task 1 | [x] Task 2 | [ ] Task 3
```

Or write them more compactly:
```markdown
[x] Task 1|[x] Task 2|[x] Task 3
```

![example1](/images/example1.png) 

## Installation

1. Open Obsidian Settings
2. Navigate to Community Plugins and disable Safe Mode
3. Click Browse and search for "Inline Checkbox Groups"
4. Install the plugin
5. Enable the plugin in your Community Plugins list

### Manual Installation

1. Download the latest release from the releases page
2. Extract the files into your vault's `.obsidian/plugins/inline-checkbox-groups/` directory
3. Reload Obsidian
4. Enable the plugin in your Community Plugins list

## Usage

Once installed and enabled, you can create inline checkbox groups by:

1. Writing multiple checkbox tasks on a single line
2. Separating them with your configured separator character (default: '|')
3. The plugin will automatically format them as an inline group

Example:
```markdown
[ ] Morning Tasks | [ ] Afternoon Tasks | [ ] Evening Tasks
```

### Settings

You can customize the following settings in the plugin options:

![Plugin Settings](/images/settings1.png) 

- **Separator**: Choose the character used to separate checkboxes (default: '|')
- **Cross Out Completed**: Toggle whether to strike through text when all checkboxes in a group are checked

## Compatibility

- Requires Obsidian v0.15.0 or higher
- Desktop only (not available for mobile)
- Compatible with most themes and plugins

## Support

If you find this plugin helpful, you can:

- Star the repository on GitHub
- Report any issues on the GitHub issue tracker
- [Buy me a coffee](https://buymeacoffee.com/bwya77)
- [Become a GitHub Sponsor](https://github.com/sponsors/bwya77)

## Development

Want to contribute or modify the plugin? Here's how to get started with the source code:

1. Create a directory for your GitHub projects:
   ```bash
   cd path/to/somewhere
   mkdir Github
   cd Github
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/bwya77/Inline-Checkbox-Groups.git
   ```

3. Navigate to the plugin directory:
   ```bash
   cd inline-checkbox-groups
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start development build mode:
   ```bash
   npm run dev
   ```
   This command will keep running in the terminal and automatically rebuild the plugin whenever you make changes to the source code.

6. You'll see a `main.js` file appear in the plugin directory - this is the compiled version of your plugin.

### Testing Your Changes

To test your modifications:

1. Create a symbolic link or copy your plugin folder to your vault's `.obsidian/plugins/` directory
2. Enable the plugin in Obsidian's community plugins settings
3. Use the developer console (Ctrl+Shift+I) to check for errors and debug

### Making Contributions

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request with a clear description of your changes

## License

MIT License. See [LICENSE](https://github.com/bwya77/Inline-Checkbox-Groups/blob/main/LICENSE) for full text.