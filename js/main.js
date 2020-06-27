"use strict";

( d => {
	const timeInputFallback = inp => {
		const inpMin = inp.getAttribute( "min" );
		const inpMax = inp.getAttribute( "max" );
		const baseDate = inpMin < inpMax ? "January 1, 1970" : "January 2, 1970";

		const timeMin = new Date( `${baseDate } ${( inp.getAttribute( "min" ) )}` );
		const timeMax = new Date( `${baseDate } ${( inp.getAttribute( "max" ) )}` );
		const inpStep = parseInt( inp.getAttribute( "step" ) );

		const timeList = document.createElement( "datalist" );
		const timeListId = `dl-${timeMin.getSeconds()}-${timeMax.getSeconds()}${inpStep}`;

		if ( document.querySelector( `#${timeListId}` ) !== null ) {
			return;
		}

		timeList.setAttribute( "id", timeListId );

		let listOptions = "",
			timeStep = timeMin;

		while ( timeStep.getTime() <= timeMax.getTime() ) {
			listOptions = `
${listOptions}
<option value="${( timeStep.toLocaleTimeString( "en-GB" ) )}">`;
			timeStep.setSeconds( timeStep.getSeconds() + inpStep );
		}

		inp.setAttribute( "list", timeListId );
		timeList.innerHTML = listOptions;
		document.querySelector( "body" ).appendChild( timeList );
	};

	d.addEventListener( "focusin", event => {
		const tgt = event.target;

		if ( tgt.matches( "input[type=time][min][max][step]" ) ) {
			timeInputFallback( tgt );
		}
	} );

	d.addEventListener( "mouseover", event => {
		const tgt = event.target;

		if ( tgt.matches( "label" ) ) {
			const control = tgt.control;

			control.classList.add( "labeled" );
		}
	} );

	d.addEventListener( "mouseout", event => {
		const tgt = event.target;

		if ( tgt.matches( "label" ) ) {
			const control = tgt.control;

			control.classList.remove( "labeled" );
		}
	} );
} )( document );
