"use strict";

import timeInputFallback from "./modules/timeInputFallback.mjs";
import "./modules/detailsAnimation.mjs";
import "./modules/labeledClass.mjs";

// A substitute for ':user-invalid', which is only supported in Firefox ATM as
// ::-moz-ui-invalid
( d => {
	d.addEventListener( "focusout", event => {
		const sels = [
			"input:not([type=checkbox]):not([type=radio])",
			"select",
			"textarea"
		];
		const inputEl = event.target.closest( sels.join( "," ) );
		const theClass = "was-focused";

		if (
			inputEl !== null &&
			!inputEl.classList.contains( theClass )
		) {
			inputEl.classList.add( theClass );
		}
	} );

	d.addEventListener( "focusin", event => {
		const tgt = event.target.closest( "input[type=time][min][max][step]" );

		if ( tgt !== null ) {
			timeInputFallback( tgt );
		}
	} );
} )( document );
