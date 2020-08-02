"use strict";

import timeInputFallback from "./modules/timeInputFallback";

( d => {
	d.addEventListener( "focusin", event => {
		const tgt = event.target.closest( "input[type=time][min][max][step]" );

		if ( tgt !== null ) {
			timeInputFallback( tgt );
		}
	} );

	d.addEventListener( "mouseover", event => {
		const tgt = event.target.closest( "label" );

		if ( tgt !== null ) {
			const control = tgt.control;

			control.classList.add( "labeled" );
		}
	} );

	d.addEventListener( "mouseout", event => {
		const tgt = event.target.closest( "label" );

		if ( tgt !== null ) {
			const control = tgt.control;

			control.classList.remove( "labeled" );
		}
	} );
} )( document );
