import { P } from '@lemons_dev/parsinom/lib/ParsiNOM';
import { type Parser } from '@lemons_dev/parsinom/lib/Parser';
import { type UnvalidatedBindTargetDeclaration, type UnvalidatedFieldArgument } from '../inputFieldParser/InputFieldDeclaration';
import { P_UTILS } from '@lemons_dev/parsinom/lib/ParserUtils';
import { BIND_TARGET } from './BindTargetParsers';
import { createResultNode, fieldArguments, ident } from './GeneralParsers';
import {
	type PartialUnvalidatedViewFieldDeclaration,
	type UnvalidatedJsViewFieldBindTargetMapping,
	type UnvalidatedJsViewFieldDeclaration,
} from '../viewFieldParser/ViewFieldDeclaration';

export const viewFieldContentEscapeCharacter = P.string('\\')
	.then(P_UTILS.any())
	.map(escaped => {
		if (escaped === '[') {
			return '[';
		} else if (escaped === ']') {
			return ']';
		} else if (escaped === '{') {
			return '{';
		} else if (escaped === '}') {
			return '}';
		} else if (escaped === '\\') {
			return '\\';
		} else {
			return '\\' + escaped;
		}
	});

const viewFieldContent: Parser<string> = P.sequenceMap(
	(first, other) => {
		return first + other.flat().join('');
	},
	P.manyNotOf('{}[]\\'),
	P.sequence(viewFieldContentEscapeCharacter, P.manyNotOf('{}[]\\')).many(),
).box('View Field Content');

export const VIEW_FIELD_DECLARATION: Parser<(string | UnvalidatedBindTargetDeclaration)[]> = P.sequenceMap(
	(first, other) => {
		return [first, ...other.flat()];
	},
	viewFieldContent,
	P.sequence(BIND_TARGET.wrap(P.string('{'), P.string('}')), viewFieldContent).many(),
);

const viewFieldExtraDeclaration: Parser<PartialUnvalidatedViewFieldDeclaration> = P.sequenceMap(
	(type, args, b) => {
		const bindTarget = b === undefined ? undefined : b[1];
		return {
			viewFieldType: type,
			writeToBindTarget: bindTarget,
			arguments: args,
			templateDeclaration: undefined,
		} satisfies PartialUnvalidatedViewFieldDeclaration;
	},
	ident.node(createResultNode).optional().describe('input field type'),
	fieldArguments
		.trim(P_UTILS.optionalWhitespace())
		.wrap(P.string('('), P.string(')'))
		.optional([] as UnvalidatedFieldArgument[]),
	P.sequence(P.string(':'), BIND_TARGET).optional(),
);

export const VIEW_FIELD_FULL_DECLARATION: Parser<PartialUnvalidatedViewFieldDeclaration> = P.sequenceMap(
	(_1, declaration, extraDeclaration) => {
		if (extraDeclaration === undefined) {
			return {
				viewFieldType: undefined,
				writeToBindTarget: undefined,
				arguments: [],
				templateDeclaration: declaration,
			} satisfies PartialUnvalidatedViewFieldDeclaration;
		} else {
			extraDeclaration.templateDeclaration = declaration;
			return extraDeclaration;
		}
	},
	P.string('VIEW'),
	VIEW_FIELD_DECLARATION.wrap(P.string('['), P.string(']')),
	viewFieldExtraDeclaration.wrap(P.string('['), P.string(']')).optional(),
	P_UTILS.eof(),
);

const jsViewFieldBindTargetMapping: Parser<UnvalidatedJsViewFieldBindTargetMapping> = P.sequenceMap(
	(bindTarget, children, _1, name) => {
		if (children !== undefined) {
			bindTarget.listenToChildren = true;
		}

		return {
			bindTarget: bindTarget,
			name: name,
		} satisfies UnvalidatedJsViewFieldBindTargetMapping;
	},
	BIND_TARGET.wrap(P.string('{'), P.string('}')),
	P.string(' and children').optional(),
	P.string(' as '),
	ident,
);

export const JS_VIEW_FIELD_DECLARATION: Parser<UnvalidatedJsViewFieldDeclaration> = P.sequenceMap(
	(bindTargetMappings, _1, _2, code) => {
		return {
			bindTargetMappings: bindTargetMappings,
			code: code,
		} satisfies UnvalidatedJsViewFieldDeclaration;
	},
	jsViewFieldBindTargetMapping.separateBy(P_UTILS.whitespace()),
	P_UTILS.whitespace(),
	P.string('---'),
	P_UTILS.remaining(),
);
