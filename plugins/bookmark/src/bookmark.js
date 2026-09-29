import { Plugin } from 'ckeditor5';
import BookmarkEditing from './bookmarkediting.js';
import BookmarkUI from './bookmarkui.js';

export default class Bookmark extends Plugin {
	static get requires() {
		return [ BookmarkEditing, BookmarkUI ];
	}

	static get pluginName() {
		return 'Bookmark';
	}
}
