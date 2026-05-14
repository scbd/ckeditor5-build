/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { Plugin, createDropdown, addListToDropdown, Collection, ViewModel } from 'ckeditor5';
import { ALERT_TYPES } from './alertediting';

const alertIcon = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2L2 18h16L10 2zM11 16H9v-2h2v2zm0-4H9V8h2v4z"/></svg>';

export default class AlertUI extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'alert', locale => {
			const dropdownView = createDropdown( locale );

			dropdownView.buttonView.set( {
				label: 'Alert',
				icon: alertIcon,
				tooltip: true
			} );

			const items = new Collection();
			const labelToType = new Map();

			for ( const [ alertType, { label, icon } ] of Object.entries( ALERT_TYPES ) ) {
				const itemLabel = `${ icon }  ${ label }`;
				labelToType.set( itemLabel, alertType );
				items.add( {
					type: 'button',
					model: new ViewModel( { label: itemLabel, withText: true } )
				} );
			}

			addListToDropdown( dropdownView, items, locale );

			dropdownView.on( 'execute', evt => {
				const alertType = labelToType.get( evt.source.label ) || 'note';
				editor.execute( 'insertAlert', { alertType } );
				editor.editing.view.focus();
			} );

			return dropdownView;
		} );
	}
}
