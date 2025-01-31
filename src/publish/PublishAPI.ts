import { ViewFieldDeclarationParser } from '../parsers/viewFieldParser/ViewFieldDeclarationParser';
import { BindTargetParser } from '../parsers/BindTargetParser';
import { type IPlugin } from '../IPlugin';
import { PublishInputFieldMDRC } from './PublishInputFieldMDRC';
import { PublishViewFieldMDRC } from './PublishViewFieldMDRC';
import { InputFieldDeclarationParser } from '../parsers/inputFieldParser/InputFieldParser';
import { type MarkdownPostProcessorContext } from 'obsidian/publish';
import { type IAPI } from '../api/IAPI';
import { InputFieldAPI } from '../api/InputFieldAPI';
import { type InputFieldDeclaration } from '../parsers/inputFieldParser/InputFieldDeclaration';
import { type ViewFieldDeclaration } from '../parsers/viewFieldParser/ViewFieldDeclaration';
import { getUUID } from '../utils/Utils';

export class PublishAPI implements IAPI {
	public readonly plugin: IPlugin;
	public readonly inputFieldParser: InputFieldDeclarationParser;
	public readonly viewFieldParser: ViewFieldDeclarationParser;
	public readonly bindTargetParser: BindTargetParser;
	public readonly inputField: InputFieldAPI;

	constructor(plugin: IPlugin) {
		this.plugin = plugin;

		this.inputFieldParser = new InputFieldDeclarationParser(this.plugin);
		this.viewFieldParser = new ViewFieldDeclarationParser(this.plugin);
		this.bindTargetParser = new BindTargetParser(this.plugin);

		this.inputField = new InputFieldAPI(this);
	}

	public createInputFieldFromString(
		fullDeclaration: string,
		filePath: string,
		metadata: Record<string, unknown> | undefined,
		container: HTMLElement,
		component: MarkdownPostProcessorContext,
	): PublishInputFieldMDRC {
		const declaration: InputFieldDeclaration = this.inputFieldParser.parseString(fullDeclaration, undefined);

		const inputField = new PublishInputFieldMDRC(container, this, declaration, filePath, metadata, getUUID());
		component.addChild(inputField);

		return inputField;
	}

	public createViewFieldFromString(
		fullDeclaration: string,
		filePath: string,
		metadata: Record<string, unknown> | undefined,
		container: HTMLElement,
		component: MarkdownPostProcessorContext,
	): PublishViewFieldMDRC {
		const declaration: ViewFieldDeclaration = this.viewFieldParser.parseString(fullDeclaration);

		const viewField = new PublishViewFieldMDRC(container, this, declaration, filePath, metadata, getUUID());
		component.addChild(viewField);

		return viewField;
	}
}
