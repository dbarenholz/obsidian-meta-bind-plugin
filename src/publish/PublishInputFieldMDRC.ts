import { MarkdownRenderChild } from 'obsidian/publish';
import { ErrorCollection } from '../utils/errors/ErrorCollection';
import { type PublishAPI } from './PublishAPI';
import { traverseObjectByPath } from '@opd-libs/opd-utils-lib/lib/ObjectTraversalUtils';
import { ErrorLevel, MetaBindBindTargetError } from '../utils/errors/MetaBindErrors';
import PublishFieldComponent from './PublishFieldComponent.svelte';
import { type InputFieldDeclaration } from '../parsers/inputFieldParser/InputFieldDeclaration';
import { getPublishDefaultValue } from './PublishUtils';

export class PublishInputFieldMDRC extends MarkdownRenderChild {
	api: PublishAPI;

	declaration: InputFieldDeclaration;
	filePath: string;
	metadata: unknown;
	uuid: string;

	errorCollection: ErrorCollection;

	constructor(containerEl: HTMLElement, api: PublishAPI, declaration: InputFieldDeclaration, filePath: string, metadata: unknown, uuid: string) {
		super(containerEl);

		//console.log(this);

		this.api = api;
		this.declaration = declaration;
		this.filePath = filePath;
		this.uuid = uuid;
		this.metadata = metadata;

		this.errorCollection = new ErrorCollection(`input field ${uuid}`);
		this.errorCollection.merge(declaration.errorCollection);

		this.load();
	}

	getValue(): unknown {
		if (!this.declaration.bindTarget) {
			this.errorCollection.add(
				new MetaBindBindTargetError({ errorLevel: ErrorLevel.WARNING, effect: 'populated with default data', cause: 'input field not bound' }),
			);
			return getPublishDefaultValue(this.declaration);
		}

		if (this.declaration.bindTarget.filePath !== undefined && this.declaration.bindTarget.filePath !== this.filePath) {
			this.errorCollection.add(
				new MetaBindBindTargetError({
					errorLevel: ErrorLevel.WARNING,
					effect: 'populated with default data',
					cause: 'can not load metadata of another file in obsidian publish',
				}),
			);
			return getPublishDefaultValue(this.declaration);
		}

		const value: unknown = traverseObjectByPath(this.declaration.bindTarget.metadataPath, this.metadata);

		if (value === undefined) {
			this.errorCollection.add(
				new MetaBindBindTargetError({ errorLevel: ErrorLevel.WARNING, effect: 'populated with default data', cause: 'value in metadata is undefined' }),
			);
			return getPublishDefaultValue(this.declaration);
		}

		return value;
	}

	onload(): void {
		console.log('meta-bind | InputFieldMarkdownRenderChild >> load', this);

		this.containerEl.addClass('meta-bind-plugin-input');
		this.containerEl.empty();

		const value = this.getValue()?.toString() ?? 'unknown';

		new PublishFieldComponent({
			target: this.containerEl,
			props: {
				errorCollection: this.errorCollection,
				declaration: this.declaration.fullDeclaration,
				value: value,
				fieldType: 'INPUT',
			},
		});
	}
}
