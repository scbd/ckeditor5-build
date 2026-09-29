import { Plugin, Widget, toWidget } from 'ckeditor5';
import BookmarkCommand from './bookmarkcommand.js';
import bookmarkIcon from '../theme/icons/bookmark.svg';

import '../theme/bookmark.css';

export default class BookmarkEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	static get pluginName() {
		return 'BookmarkEditing';
	}

	init() {
		this._defineSchema();
		this._defineConverters();

		this.editor.commands.add( 'bookmark', new BookmarkCommand( this.editor ) );
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'bookmark', {
			isObject: true,
			isInline: true,
			allowWhere: '$text',
			allowAttributes: [ 'bookmarkId' ]
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		// An empty <a id="..."> with no href and no content is treated as a bookmark anchor.
		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: 'a',
				attributes: [ 'id' ]
			},
			model: ( viewElement, { writer } ) => {
				if ( viewElement.childCount > 0 || viewElement.hasAttribute( 'href' ) ) {
					return null;
				}

				return writer.createElement( 'bookmark', { bookmarkId: viewElement.getAttribute( 'id' ) } );
			}
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'bookmark',
			view: ( modelElement, { writer } ) => {
				return writer.createEmptyElement( 'a', { id: modelElement.getAttribute( 'bookmarkId' ) } );
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'bookmark',
			view: ( modelElement, { writer } ) => {
				const bookmarkId = modelElement.getAttribute( 'bookmarkId' );

				const bookmarkView = writer.createContainerElement( 'span', {
					class: 'scbd-bookmark'
				}, {
					isAllowedInsideAttributeElement: true
				} );

				const icon = writer.createRawElement( 'span', { class: 'scbd-bookmark__icon' }, domElement => {
					domElement.innerHTML = bookmarkIcon;
				} );

				writer.insert( writer.createPositionAt( bookmarkView, 0 ), icon );

				return toWidget( bookmarkView, writer, { label: `bookmark: ${ bookmarkId }` } );
			}
		} );
	}
}
