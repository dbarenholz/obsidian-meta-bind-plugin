import { AbstractInputField } from '../../AbstractInputField';
import { type OptionInputFieldArgument } from '../../../fieldArguments/inputFieldArguments/arguments/OptionInputFieldArgument';
import { type InputFieldMDRC } from '../../../renderChildren/InputFieldMDRC';
import { type SvelteComponent } from 'svelte';
import MultiSelectComponent from './MultiSelectComponent.svelte';
import { InputFieldArgumentType } from '../../../parsers/GeneralConfigs';
import { type MBLiteral, parseUnknownToLiteralArray } from '../../../utils/Literal';

export class MultiSelectIPF extends AbstractInputField<MBLiteral[], MBLiteral[]> {
	options: OptionInputFieldArgument[];

	constructor(renderChild: InputFieldMDRC) {
		super(renderChild);

		this.options = this.renderChild.getArguments(InputFieldArgumentType.OPTION);
	}

	protected filterValue(value: unknown): MBLiteral[] | undefined {
		return parseUnknownToLiteralArray(value);
	}

	protected getFallbackDefaultValue(): MBLiteral[] {
		return [];
	}

	protected getSvelteComponent(): typeof SvelteComponent {
		return MultiSelectComponent;
	}

	protected rawMapValue(value: MBLiteral[]): MBLiteral[] {
		return value;
	}

	protected rawReverseMapValue(value: MBLiteral[]): MBLiteral[] | undefined {
		return value;
	}

	protected getMountArgs(): Record<string, unknown> {
		return {
			options: this.options,
		};
	}
}
