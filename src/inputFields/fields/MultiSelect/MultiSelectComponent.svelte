<script lang="ts">
	import { OptionInputFieldArgument } from '../../../fieldArguments/inputFieldArguments/arguments/OptionInputFieldArgument';
	import { MBLiteral } from '../../../utils/Literal';

	export let value: MBLiteral[];
	export let options: OptionInputFieldArgument[];
	export let onValueChange: (value: MBLiteral[]) => void;

	export function setValue(v: MBLiteral[]): void {
		value = v;
	}

	function selectOption(option: MBLiteral) {
		if (value.includes(option)) {
			value = value.filter(x => x !== option);
		} else {
			value.push(option);
			value = value;
		}

		onValueChange(value);
	}

	function selectOptionOnKey(event: KeyboardEvent, option: MBLiteral) {
		if (event.key === ' ') {
			selectOption(option);
		}
	}
</script>

{#each options as option}
	<div
		class="mb-select-input-element"
		class:is-selected={value.includes(option.value)}
		role="button"
		tabindex="0"
		on:click={() => selectOption(option.value)}
		on:keypress={event => selectOptionOnKey(event, option.value)}
	>
		{option.name}
	</div>
{/each}
