/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module br-break/brbreak
 */

import { Plugin, Widget } from 'ckeditor5';
import BrBreakEditing from './brbreakediting';
import BrBreakUI from './brbreakui';

/**
 * The br break feature.
 *
 * It provides the possibility to insert a br break into the rich-text editor.
 *
 * For a detailed overview, check the {@glink features/br-break Br Break feature} documentation.
 *
 * @extends module:core/plugin~Plugin
 */
export default class BrBreak extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ BrBreakEditing, BrBreakUI, Widget ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'BrBreak';
	}
}
