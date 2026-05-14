/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { Plugin, Widget, toWidget, toWidgetEditable } from 'ckeditor5';
import AlertCommand from './alertcommand';

export const ALERT_TYPES = {
	note:      { label: 'Note',      icon: 'ℹ️' },
	tip:       { label: 'Tip',       icon: '💡' },
	important: { label: 'Important', icon: '🔔' },
	warning:   { label: 'Warning',   icon: '⚠️' },
	caution:   { label: 'Caution',   icon: '🛑' }
};

export default class AlertEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		this._defineSchema();
		this._defineConverters();
		this.editor.commands.add( 'insertAlert', new AlertCommand( this.editor ) );
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'alert', {
			isObject: true,
			allowWhere: '$block',
			allowAttributes: [ 'alertType' ]
		} );

		schema.register( 'alertTitle', {
			allowIn: 'alert',
			allowContentOf: '$block',
			isLimit: true
		} );

		schema.register( 'alertContent', {
			allowIn: 'alert',
			allowContentOf: '$root',
			isLimit: true
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		// ── Upcast ───────────────────────────────────────────────────────────

		conversion.for( 'upcast' ).elementToElement( {
			view: { name: 'div', classes: [ 'ck-alert' ] },
			model: ( viewElement, { writer } ) => {
				const cls = viewElement.getAttribute( 'class' ) || '';
				const alertType = Object.keys( ALERT_TYPES ).find( t => cls.includes( `ck-alert-${ t }` ) ) || 'note';
				return writer.createElement( 'alert', { alertType } );
			}
		} );

		conversion.for( 'upcast' ).elementToElement( {
			view: { name: 'strong', classes: [ 'ck-alert-title' ] },
			model: 'alertTitle'
		} );

		conversion.for( 'upcast' ).elementToElement( {
			view: { name: 'div', classes: [ 'ck-alert-content' ] },
			model: 'alertContent'
		} );

		// ── Data downcast ─────────────────────────────────────────────────────

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'alert',
			view: ( modelElement, { writer } ) => {
				const alertType = modelElement.getAttribute( 'alertType' ) || 'note';
				return writer.createContainerElement( 'div', { class: `ck-alert ck-alert-${ alertType }` } );
			}
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'alertTitle',
			view: ( _, { writer } ) => writer.createContainerElement( 'strong', { class: 'ck-alert-title' } )
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'alertContent',
			view: ( _, { writer } ) => writer.createContainerElement( 'div', { class: 'ck-alert-content' } )
		} );

		// ── Editing downcast ──────────────────────────────────────────────────

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: { name: 'alert', attributes: [ 'alertType' ] },
			view: ( modelElement, { writer } ) => {
				const alertType = modelElement.getAttribute( 'alertType' ) || 'note';
				const div = writer.createContainerElement( 'div', { class: `ck-alert ck-alert-${ alertType }` } );
				return toWidget( div, writer, { label: 'alert widget' } );
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'alertTitle',
			view: ( _, { writer } ) => {
				const el = writer.createEditableElement( 'strong', { class: 'ck-alert-title' } );
				return toWidgetEditable( el, writer );
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'alertContent',
			view: ( _, { writer } ) => {
				const el = writer.createEditableElement( 'div', { class: 'ck-alert-content' } );
				return toWidgetEditable( el, writer );
			}
		} );
	}
}
