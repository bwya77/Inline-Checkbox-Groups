import { Plugin, MarkdownView, Editor, App, PluginSettingTab, Setting } from 'obsidian';
import { EditorView, ViewUpdate } from '@codemirror/view';
import './styles.css';

interface InlineCheckboxGroupSettings {
    separator: string;
    crossOutWhenAllChecked: boolean;
}

const DEFAULT_SETTINGS: InlineCheckboxGroupSettings = {
    separator: '|',
    crossOutWhenAllChecked: true
};

export default class InlineCheckboxGroupPlugin extends Plugin {
    settings: InlineCheckboxGroupSettings;
    private observer: MutationObserver;

    async onload() {
        await this.loadSettings();

        this.registerMarkdownPostProcessor((element, context) => {
            const paragraphs = element.querySelectorAll('p');
            paragraphs.forEach(para => {
                const text = para.textContent;
                if (text?.match(/\[ ?\]|\[x\]/i)) {
                    this.renderCheckboxGroup(para, context);
                }
            });
        });

        this.registerEditorExtension([
            EditorView.updateListener.of((update: ViewUpdate) => {
                if (update.docChanged) {
                    this.handleEditorUpdate(update);
                }
            })
        ]);

        this.addSettingTab(new InlineCheckboxGroupSettingTab(this.app, this));
    }

    onunload() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    private updateStrikethrough(paragraph: HTMLElement) {
        if (!this.settings.crossOutWhenAllChecked) return;

        const containers = paragraph.querySelectorAll('.checkbox-group-container');
        const checkboxes = paragraph.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);

        // Apply strikethrough to the entire paragraph if all checkboxes are checked
        if (allChecked) {
            paragraph.classList.add('checkbox-crossed-out');
        } else {
            paragraph.classList.remove('checkbox-crossed-out');
        }

        // Also update individual containers
        containers.forEach(container => {
            if (allChecked) {
                container.classList.add('checkbox-crossed-out');
            } else {
                container.classList.remove('checkbox-crossed-out');
            }
        });
    }

    private async handleCheckboxChange(checkbox: HTMLInputElement) {
        const container = checkbox.closest('.checkbox-group-container');
        if (!container) return;

        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) return;

        const paragraph = container.closest('p');
        if (!paragraph) return;

        const lineNumber = parseInt(paragraph.getAttribute('data-line-number') || '-1');
        const checkboxIndex = parseInt(container.getAttribute('data-checkbox-index') || '-1');

        if (lineNumber >= 0 && checkboxIndex >= 0) {
            const editor = view.editor;
            const line = editor.getLine(lineNumber);
            const items = line.split(this.settings.separator).map(item => item.trim());

            if (checkboxIndex < items.length) {
                const currentItem = items[checkboxIndex];
                if (currentItem.match(/^(?:-\s*)?\[[\sx]?\]/i)) {
                    const prefix = currentItem.match(/^[\s-]*/)?.[0] || '';
                    const content = currentItem.replace(/^(?:-\s*)?\[[\sx]?\]/, '').trim();
                    
                    const newCheckboxState = checkbox.checked ? '[x]' : '[ ]';
                    items[checkboxIndex] = `${prefix}${newCheckboxState} ${content}`;
                    
                    const newLine = items.join(`${this.settings.separator}`);
                    
                    editor.setLine(lineNumber, newLine);
                    const file = view.file;
                    if (file) {
                        await this.app.vault.modify(file, editor.getValue());
                        view.previewMode?.rerender(true);
                    }

                    this.updateStrikethrough(paragraph);
                }
            }
        }
    }

    private handleEditorUpdate(update: ViewUpdate) {
        const doc = update.state.doc;
        for (let i = 1; i <= doc.lines; i++) {
            const line = doc.line(i);
            const text = line.text;
            
            if (text.match(/(?:-\s*)?\[\s*[x ]?\s*\]/i)) {
                const items = text.includes(this.settings.separator)
                    ? text.split(this.settings.separator)
                    : [text];
                
                items.forEach((item, index) => {
                    const trimmedItem = item.trim();
                    if (trimmedItem.match(/^(?:-\s*)?\[\s*[x ]?\s*\]/i)) {
                        return;
                    }
                });
            }
        }
    }

    private renderCheckboxGroup(element: HTMLElement, context: any) {
        const text = element.textContent || '';
        const items = text.includes(this.settings.separator) 
            ? text.split(this.settings.separator).map(item => item.trim())
            : [text.trim()];
        
        element.empty();
        element.setAttribute('data-original-text', text.trim());
        
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
            const editor = view.editor;
            const lines = editor.getValue().split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim() === text.trim()) {
                    const existingElements = document.querySelectorAll(`p[data-line-number="${i}"]`);
                    if (existingElements.length === 0 || Array.from(existingElements).some(el => el === element)) {
                        element.setAttribute('data-line-number', i.toString());
                        break;
                    }
                }
            }
        }

        const allChecked = items.every(item => item.match(/\[x\]/i));
        if (allChecked && this.settings.crossOutWhenAllChecked) {
            element.classList.add('checkbox-crossed-out');
        }
        
        items.forEach((item, index) => {
            if (item.match(/\[ ?\]|\[x\]/i)) {
                const container = element.createDiv({
                    cls: 'checkbox-group-container'
                });
                
                container.setAttribute('data-checkbox-index', index.toString());

                const checkbox = container.createEl('input', {
                    type: 'checkbox',
                    cls: 'task-list-item-checkbox'
                });
                
                checkbox.checked = item.includes('[x]');
                
                this.registerDomEvent(checkbox, 'change', () => this.handleCheckboxChange(checkbox));

                const span = container.createSpan({
                    text: item.replace(/\[ ?\]|\[x\]/, '').trim()
                });

                if (items.length > 1 && index < items.length - 1) {
                    container.createSpan({
                        text: `${this.settings.separator}`,
                        cls: 'checkbox-group-separator'
                    });
                }

                if (allChecked && this.settings.crossOutWhenAllChecked) {
                    container.classList.add('checkbox-crossed-out');
                }
            }
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class InlineCheckboxGroupSettingTab extends PluginSettingTab {
    plugin: InlineCheckboxGroupPlugin;

    constructor(app: App, plugin: InlineCheckboxGroupPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName('Separator')
            .setDesc('Character used to separate checkboxes in a group')
            .addText(text => text
                .setPlaceholder('|')
                .setValue(this.plugin.settings.separator)
                .onChange(async (value) => {
                    this.plugin.settings.separator = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Cross out completed items')
            .setDesc('Cross out text when all checkboxes in a group are checked')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.crossOutWhenAllChecked)
                .onChange(async (value) => {
                    this.plugin.settings.crossOutWhenAllChecked = value;
                    await this.plugin.saveSettings();
                    this.app.workspace.getActiveViewOfType(MarkdownView)?.previewMode?.rerender(true);
                }));
    }
}