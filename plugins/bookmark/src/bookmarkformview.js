import {
	View,
	ViewCollection,
	LabeledFieldView,
	createLabeledInputText,
	ButtonView,
	FocusCycler,
	FocusTracker,
	KeystrokeHandler,
	submitHandler
} from 'ckeditor5';

export default class BookmarkFormView extends View {
	constructor( locale ) {
		super( locale );

		this.focusTracker = new FocusTracker();
		this.keystrokes = new KeystrokeHandler();

		this.idInputView = this._createIdInput();
		this.saveButtonView = this._createButton( 'Save', 'scbd-button-save', 'submit' );
		this.cancelButtonView = this._createButton( 'Cancel', 'scbd-button-cancel' );
		this.removeButtonView = this._createButton( 'Remove', 'scbd-button-remove' );

		this.cancelButtonView.on( 'execute', () => this.fire( 'cancel' ) );
		this.removeButtonView.on( 'execute', () => this.fire( 'remove' ) );

		this._focusables = new ViewCollection( [
			this.idInputView,
			this.saveButtonView,
			this.removeButtonView,
			this.cancelButtonView
		] );

		this._focusCycler = new FocusCycler( {
			focusables: this._focusables,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				focusPrevious: 'shift + tab',
				focusNext: 'tab'
			}
		} );

		this.setTemplate( {
			tag: 'form',
			attributes: {
				class: [ 'ck', 'scbd-bookmark-form' ],
				tabindex: '-1'
			},
			children: [
				this.idInputView,
				{
					tag: 'div',
					attributes: {
						class: [ 'ck', 'scbd-bookmark-form__actions' ]
					},
					children: [
						this.removeButtonView,
						this.saveButtonView,
						this.cancelButtonView
					]
				}
			]
		} );
	}

	render() {
		super.render();

		submitHandler( { view: this } );

		for ( const view of this._focusables ) {
			this.focusTracker.add( view.element );
		}

		this.keystrokes.listenTo( this.element );
		this.keystrokes.set( 'Esc', ( data, cancel ) => {
			this.fire( 'cancel' );
			cancel();
		} );
	}

	focus() {
		this._focusCycler.focusFirst();
	}

	_createIdInput() {
		const labeledInput = new LabeledFieldView( this.locale, createLabeledInputText );

		labeledInput.label = 'Bookmark name';
		labeledInput.fieldView.placeholder = 'e.g. section-2';

		return labeledInput;
	}

	_createButton( label, className, type = 'button' ) {
		const button = new ButtonView( this.locale );

		button.set( { label, withText: true, type, class: className } );

		return button;
	}
}
