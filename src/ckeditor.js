
/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import 'ckeditor5/ckeditor5.css';
import {
	InlineEditor,
	ClassicEditor,
	Alignment,
	AutoImage,
	Autoformat,
	AutoLink,
	BlockQuote,
	Bold,
	DataFilter,
	DataSchema,
	Essentials,
	FindAndReplace,
	FontColor,
	FontSize,
	GeneralHtmlSupport,
	Heading,
	Highlight,
	HorizontalLine,
	HtmlComment,
	HtmlEmbed,
	Image,
	ImageCaption,
	ImageInsert,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	IndentBlock,
	Italic,
	Link,
	LinkImage,
	List,
	ListProperties,
	MediaEmbed,
	MediaEmbedToolbar,
	PageBreak,
	Paragraph,
	PasteFromOffice,
	RemoveFormat,
	SelectAll,
	SimpleUploadAdapter,
	SourceEditing,
	StandardEditingMode,
	Strikethrough,
	Style,
	Subscript,
	Superscript,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TextTransformation,
	Underline,
	WordCount,
} from 'ckeditor5';

//custom plugins
import BrBreak from '../plugins/br-break/src/brbreak.js';
import Alert from '../plugins/alert/src/alert.js';

// Import custom CSS
import '../plugins/alert/theme/alert.css';

class Editor extends InlineEditor {}

// Plugins to include in the build.
const builtinPlugins = [
	Alignment,
	AutoImage,
	Autoformat,
	AutoLink,
	BlockQuote,
	Bold,
	DataFilter,
	DataSchema,
	Essentials,
	FindAndReplace,
	FontColor,
	FontSize,
	GeneralHtmlSupport,
	Heading,
	Highlight,
	HorizontalLine,
	HtmlComment,
	HtmlEmbed,
	Image,
	ImageCaption,
	ImageInsert,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	IndentBlock,
	Italic,
	Link,
	LinkImage,
	List,
	ListProperties,
	MediaEmbed,
	MediaEmbedToolbar,
	PageBreak,
	Paragraph,
	PasteFromOffice,
	RemoveFormat,
	SelectAll,
	SimpleUploadAdapter,
	SourceEditing,
	StandardEditingMode,
	Strikethrough,
	Style,
	Subscript,
	Superscript,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TextTransformation,
	Underline,
	WordCount,


	BrBreak,
	Alert
];

// Editor configuration.
const defaultConfig = {
	toolbar: {
		items: [
			'heading', 'fontSize', 'fontColor', '|',
			'bold', 'italic', 'link', '|',
			'indent', 'outdent', 'alignment', '|',
			'bulletedList', 'numberedList', 'blockQuote', '|',
			'highlight', 'insertTable', '|',
			'imageInsert', 'mediaEmbed', '|',
			'horizontalLine', '|',
			'removeFormat', 'undo', 'redo', '|',
			'pageBreak', 'brBreak', 'alert'
		]
	},
	language: 'en',
	image: {
		toolbar: [
			'imageTextAlternative',
			'toggleImageCaption',
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:side',
			'linkImage'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells',
			'tableCellProperties',
			'tableProperties'
		]
	}
};

Editor.builtinPlugins = builtinPlugins;
Editor.defaultConfig  = defaultConfig;
export default Editor;

ClassicEditor.builtinPlugins = builtinPlugins;
ClassicEditor.defaultConfig  = defaultConfig;
export { Editor as InlineEditor, ClassicEditor } ;
