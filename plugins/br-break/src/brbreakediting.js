/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module br-break/brbreakediting
 */

import { Plugin, toWidget } from 'ckeditor5';

import BrBreakCommand from './brbreakcommand';

import '../theme/brbreak.css';

/**
 * The br break editing feature.
 *
 * @extends module:core/plugin~Plugin
 */
export default class BrBreakEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'BrBreakEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const t = editor.t;
		const conversion = editor.conversion;

		schema.register( 'brBreak', {
			inheritAllFrom: '$blockObject'
		} );

		conversion.for( 'dataDowncast' ).elementToStructure( {
			model: 'brBreak',
			view: ( modelElement, { writer } ) => {
				const divElement = writer.createContainerElement( 'div',
					{
						class: 'br-break',
						// If user has no `.ck-content` styles, it should always break a page during print.
						style: 'br-break-after: always'
					},
					// For a rationale of using span inside a div see:
					// https://github.com/ckeditor/ckeditor5-br-break/pull/1#discussion_r328934062.
					writer.createContainerElement( 'span', {
						style: 'display: none'
					} )
				);

				return divElement;
			}
		} );

		conversion.for( 'editingDowncast' ).elementToStructure( {
			model: 'brBreak',
			view: ( modelElement, { writer } ) => {
				const label = t( 'BR Break' );
				const viewWrapper = writer.createContainerElement( 'div' );
				const viewLabelElement = writer.createRawElement(
					'span',
					{ class: 'br-break__label' },
					function( domElement ) {
						domElement.innerText = t( 'BR Break, useful with an image positioning floating left or right.' );
					}
				);

				writer.addClass( 'br-break', viewWrapper );
				writer.insert( writer.createPositionAt( viewWrapper, 0 ), viewLabelElement );

				return toBrBreakWidget( viewWrapper, writer, label );
			}
		} );

		conversion.for( 'upcast' )
			.elementToElement( {
				view: element => {
					// For upcast conversion it's enough if we check for element style and verify if it's empty
					// or contains only hidden span element.

					const hasBrBreakBefore = element.getStyle( 'br-break-before' ) == 'always';
					const hasBrBreakAfter = element.getStyle( 'br-break-after' ) == 'always';

					if ( !hasBrBreakBefore && !hasBrBreakAfter ) {
						return;
					}

					// The "br break" div accepts only single child or no child at all.
					if ( element.childCount == 1 ) {
						const viewSpan = element.getChild( 0 );

						// The child must be the "span" element that is not displayed.
						if ( !viewSpan.is( 'element', 'span' ) || viewSpan.getStyle( 'display' ) != 'none' ) {
							return;
						}
					} else if ( element.childCount > 1 ) {
						return;
					}

					return { name: true };
				},
				model: 'brBreak',

				// This conversion must be checked before <br> conversion because some editors use
				// <br style="br-break-before:always"> as a br break marker.
				converterPriority: 'high'
			} );

		editor.commands.add( 'brBreak', new BrBreakCommand( editor ) );
	}
}

// Converts a given {@link module:engine/view/element~Element} to a br break widget:
// * Adds a {@link module:engine/view/element~Element#_setCustomProperty custom property} allowing to
//   recognize the br break widget element.
// * Calls the {@link module:widget/utils~toWidget} function with the proper element's label creator.
//
//  @param {module:engine/view/element~Element} viewElement
//  @param {module:engine/view/downcastwriter~DowncastWriter} writer An instance of the view writer.
//  @param {String} label The element's label.
//  @returns {module:engine/view/element~Element}
function toBrBreakWidget( viewElement, writer, label ) {
	writer.setCustomProperty( 'brBreak', true, viewElement );

	return toWidget( viewElement, writer, { label } );
}
