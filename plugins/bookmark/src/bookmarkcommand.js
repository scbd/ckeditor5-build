import { Command } from 'ckeditor5';

export default class BookmarkCommand extends Command {
	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const selectedElement = selection.getSelectedElement();

		this.value = ( selectedElement && selectedElement.is( 'element', 'bookmark' ) )
			? selectedElement.getAttribute( 'bookmarkId' )
			: null;

		this.isEnabled = model.schema.checkChild( selection.focus, 'bookmark' ) || !!this.value;
	}

	execute( bookmarkId ) {
		const model = this.editor.model;
		const selection = model.document.selection;
		const selectedElement = selection.getSelectedElement();

		model.change( writer => {
			if ( selectedElement && selectedElement.is( 'element', 'bookmark' ) ) {
				writer.setAttribute( 'bookmarkId', bookmarkId, selectedElement );
			} else {
				// Insert at the start of the selection instead of using model.insertContent(),
				// which would delete any currently selected text before inserting.
				const bookmarkElement = writer.createElement( 'bookmark', { bookmarkId } );
				const insertPosition = selection.getFirstPosition();

				writer.insert( bookmarkElement, insertPosition );
				writer.setSelection( bookmarkElement, 'after' );
			}
		} );
	}

	removeBookmark() {
		const model = this.editor.model;
		const selectedElement = model.document.selection.getSelectedElement();

		if ( selectedElement && selectedElement.is( 'element', 'bookmark' ) ) {
			model.change( writer => writer.remove( selectedElement ) );
		}
	}
}
