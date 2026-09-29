import { Plugin, ButtonView, ContextualBalloon, clickOutsideHandler } from 'ckeditor5';
import BookmarkFormView from './bookmarkformview.js';
import bookmarkIcon from '../theme/icons/bookmark.svg';

function getSelectedText( selection ) {
	const range = selection.getFirstRange();

	if ( !range ) {
		return '';
	}

	let text = '';

	for ( const item of range.getItems() ) {
		if ( item.is( '$textProxy' ) || item.is( '$text' ) ) {
			text += item.data;
		}
	}

	return text;
}

function slugify( text ) {
	return text
		.toLowerCase()
		.trim()
		.replace( /[^a-z0-9]+/g, '-' )
		.replace( /^-+|-+$/g, '' );
}

export default class BookmarkUI extends Plugin {
	static get requires() {
		return [ ContextualBalloon ];
	}

	static get pluginName() {
		return 'BookmarkUI';
	}

	init() {
		const editor = this.editor;

		this._balloon = editor.plugins.get( ContextualBalloon );
		this.formView = this._createFormView();

		editor.ui.componentFactory.add( 'bookmark', locale => {
			const buttonView = new ButtonView( locale );
			const command = editor.commands.get( 'bookmark' );

			buttonView.set( { label: 'Bookmark', icon: bookmarkIcon, tooltip: true } );
			buttonView.bind( 'isEnabled' ).to( command );

			this.listenTo( buttonView, 'execute', () => this._showUI() );

			return buttonView;
		} );
	}

	_createFormView() {
		const editor = this.editor;
		const formView = new BookmarkFormView( editor.locale );

		this.listenTo( formView, 'submit', () => {
			const bookmarkId = formView.idInputView.fieldView.element.value.trim();

			if ( bookmarkId ) {
				editor.execute( 'bookmark', bookmarkId );
			}

			this._hideUI();
		} );

		this.listenTo( formView, 'remove', () => {
			editor.commands.get( 'bookmark' ).removeBookmark();
			this._hideUI();
		} );

		this.listenTo( formView, 'cancel', () => this._hideUI() );

		clickOutsideHandler( {
			emitter: formView,
			activator: () => this._balloon.visibleView === formView,
			contextElements: () => [ this._balloon.view.element ],
			callback: () => this._hideUI()
		} );

		return formView;
	}

	_showUI() {
		const editor = this.editor;
		const command = editor.commands.get( 'bookmark' );

		if ( command.value ) {
			this.formView.idInputView.fieldView.value = command.value;
		} else {
			const selectedText = getSelectedText( editor.model.document.selection );

			this.formView.idInputView.fieldView.value = slugify( selectedText );
		}

		this.formView.removeButtonView.isVisible = !!command.value;

		this._balloon.add( {
			view: this.formView,
			position: this._getBalloonPositionData()
		} );

		this.formView.focus();
	}

	_hideUI() {
		if ( !this._balloon.hasView( this.formView ) ) {
			return;
		}

		this.formView.idInputView.fieldView.value = '';
		this.formView.element.reset();
		this._balloon.remove( this.formView );
		this.editor.editing.view.focus();
	}

	_getBalloonPositionData() {
		const view = this.editor.editing.view;
		const viewDocument = view.document;
		const selectedElement = viewDocument.selection.getSelectedElement();

		const target = selectedElement
			? view.domConverter.mapViewToDom( selectedElement )
			: view.domConverter.viewRangeToDom( viewDocument.selection.getFirstRange() );

		return { target };
	}
}
