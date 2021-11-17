( ( d: Document ): void => {
	d.addEventListener( "mouseover", (event: Event): void => {
		const tgt: HTMLLabelElement = (event.target as HTMLElement).closest( "label" );

		if ( tgt !== null ) {
			const control = tgt.control;

			if ( control.matches( ":not([hidden]), [type='hidden']" ) ) {
				control.classList.add( "labeled" );
			}
		}
	} );

	d.addEventListener( "mouseout", (event: Event): void => {
		const tgt: HTMLLabelElement = (event.target as HTMLElement).closest( "label" );

		if ( tgt !== null ) {
			const control = tgt.control;

			control.classList.remove( "labeled" );
		}
	} );
} )( document );
