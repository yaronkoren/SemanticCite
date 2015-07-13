/**
 * Scite storage layer without any external dependencies
 *
 * Based on an example found at http://jsfiddle.net/Rn4NC/3/
 */

/*global jQuery, mediaWiki */
/*global confirm */

( function ( $, mw ) {

	'use strict';

	$( function ( $ ) {

		/**
		 * @since 1.0
		 *
		 * @class
		 * @abstract
		 */
		mw.libs.scite = mw.libs.scite || {};
		mw.libs.scite.cache = {};

		var cache = {
			canUse: true,
			cachePrefix: '',
			hasLocalStorage: typeof( localStorage ) !== "undefined",
			get  : function( key ) {

				if( !this.hasLocalStorage || !this.canUse ) {
					return null;
				}

				key = this.cachePrefix + ':' + key;

				var items = JSON.parse( localStorage.getItem( 'scite.cache' ) || "0" ),
					now = new Date;

				if ( !items || !items.hasOwnProperty( key ) ) {
					return null;
				}

				if ( items[key].ttl && items[key].ttl + items[key].time < now.getTime() ) {
					delete items[key];
					localStorage.setItem( 'scite.cache', JSON.stringify( items ) );
					return null;
				}

				return items[key].value;
			},

			set : function( key, value, ttl ) {

				if( !this.hasLocalStorage || !this.canUse ) {
					return false;
				}

				key = this.cachePrefix + ':' + key;

				var items = JSON.parse( localStorage.getItem( 'scite.cache' ) || "0" ),
					now = new Date;

				if ( !items ) {
					items = {};
				}

				items[key] = {
					ttl   : ( ttl * 1000 ) || 0, // in seconds
					time  : now.getTime(),
					value : value
				};

				localStorage.setItem( 'scite.cache', JSON.stringify( items ) );
			}
		};

		mw.libs.scite.cache = cache;

	} );
}( jQuery, mediaWiki ) );
