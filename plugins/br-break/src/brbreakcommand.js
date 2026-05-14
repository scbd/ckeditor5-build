/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module br-break/brbreakcommand
 */

import { Command, findOptimalInsertionRange } from 'ckeditor5';

/**
 * The br break command.
 *
 * The command is registered by {@link module:br-break/brbreakediting~BrBreakEditing} as `'brBreak'`.
 *
 * To insert a br break at the current selection, execute the command:
 *
 *		editor.execute( 'brBreak' );
 *
 * @extends module:core/command~Command
 */
export default class BrBreakCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const model = this.editor.model;
		const schema = model.schema;
		const selection = model.document.selection;

		this.isEnabled = isBrBreakAllowedInParent( selection, schema, model );
	}

	/**
	 * Executes the command.
	 *
	 * @fires execute
	 */
	execute() {
		const model = this.editor.model;

		model.change( writer => {
			const brBreakElement = writer.createElement( 'brBreak' );

			model.insertObject( brBreakElement, null, null, {
				setSelection: 'after'
			} );
		} );
	}
}

// Checks if a br break is allowed by the schema in the optimal insertion parent.
//
// @param {module:engine/model/selection~Selection|module:engine/model/documentselection~DocumentSelection} selection
// @param {module:engine/model/schema~Schema} schema
// @param {module:engine/model/model~Model} model Model instance.
// @returns {Boolean}
function isBrBreakAllowedInParent( selection, schema, model ) {
	const parent = getInsertBrBreakParent( selection, model );

	return schema.checkChild( parent, 'brBreak' );
}

// Returns a node that will be used to insert a br break with `model.insertContent` to check if the br break can be placed there.
//
// @param {module:engine/model/selection~Selection|module:engine/model/documentselection~DocumentSelection} selection
// @param {module:engine/model/model~Model} model Model instance.
// @returns {module:engine/model/element~Element}
function getInsertBrBreakParent( selection, model ) {
	const insertionRange = findOptimalInsertionRange( selection, model );
	const parent = insertionRange.start.parent;

	if ( parent.isEmpty && !parent.is( 'element', '$root' ) ) {
		return parent.parent;
	}

	return parent;
}
