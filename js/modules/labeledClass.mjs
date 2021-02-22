( d => {
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
