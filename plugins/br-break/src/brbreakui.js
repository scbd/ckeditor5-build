/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module br-break/brbreakui
 */

import { Plugin, ButtonView } from 'ckeditor5';

import brBreakIcon from '../theme/icons/brbreak.svg';

/**
 * The br break UI plugin.
 *
 * @extends module:core/plugin~Plugin
 */
export default class BrBreakUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'BrBreakUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		// Add brBreak button to feature components.
		editor.ui.componentFactory.add( 'brBreak', locale => {
			const command = editor.commands.get( 'brBreak' );
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Br Break' ),
				icon: brBreakIcon,
				tooltip: true
			} );

			view.bind( 'isEnabled' ).to( command, 'isEnabled' );

			// Execute command.
			this.listenTo( view, 'execute', () => {
				editor.execute( 'brBreak' );
				editor.editing.view.focus();
			} );

			return view;
		} );
	}
}
