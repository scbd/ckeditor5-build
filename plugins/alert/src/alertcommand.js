/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { Command } from 'ckeditor5';
import { ALERT_TYPES } from './alertediting';

export default class AlertCommand extends Command {
	execute( options = {} ) {
		const editor = this.editor;
		const alertType = options.alertType || 'note';
		const defaultLabel = ( ALERT_TYPES[ alertType ] || ALERT_TYPES.note ).label;

		editor.model.change( writer => {
			const alertElement = writer.createElement( 'alert', { alertType } );
			const alertTitle = writer.createElement( 'alertTitle' );
			const alertContent = writer.createElement( 'alertContent' );
			const paragraph = writer.createElement( 'paragraph' );

			writer.insertText( defaultLabel, alertTitle );
			writer.append( alertTitle, alertElement );
			writer.append( paragraph, alertContent );
			writer.append( alertContent, alertElement );

			editor.model.insertContent( alertElement );
			writer.setSelection( alertContent.getChild( 0 ), 'in' );
		} );
	}

	refresh() {
		const model = this.editor.model;
		const schema = model.schema;
		const selection = model.document.selection;
		const parent = selection.focus.parent;
		const insertParent = parent.is( 'element', '$root' ) ? parent : parent.parent;

		this.isEnabled = schema.checkChild( insertParent, 'alert' );
	}
}
