/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { Plugin } from 'ckeditor5';
import AlertEditing from './alertediting';
import AlertUI from './alertui';

export default class Alert extends Plugin {
	static get requires() {
		return [ AlertEditing, AlertUI ];
	}

	static get pluginName() {
		return 'Alert';
	}
}