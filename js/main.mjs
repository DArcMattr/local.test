"use strict";

import timeInputFallback from "./modules/timeInputFallback.mjs";
import "./modules/detailsAnimation.mjs";

( d => {
	const threshold = 5;
	const selects = d.querySelectorAll( "select" );
	const optionClones = [];

	for ( let select of selects ) {
		if ( select.options.length > threshold ) {
			let newList = d.createElement( "datalist" ),
				newOpt;
			select.dataset.idProxy = select.hasAttribute( "id" ) ?
				select.getAttribute( "id" ) :
				`select-${( [ ...selects ].indexOf( select ) )}`;

			newList.id = select.dataset.idProxy;
			for ( let opt of select.options ) {
				newOpt = d.createElement( "option" );
				newOpt.value = opt.value;
				newList.appendChild( newOpt );
			}

			optionClones.push( newList );

			console.log( select.options );
		}
	}

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
