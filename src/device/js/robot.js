// 'use strict';
var _ = require( 'lodash' );
var TASK = require( '../../shared/js/TASK/TASK' );
var Raspi = require( 'raspi-io' );
var five = require( 'johnny-five' );
var AnimationPlayer = require( 'art-kit/src/AnimationPlayer' );

class Robot extends TASK {
	constructor( GLOBALS ) {
		super();

		this.board = new five.Board( {
			io: new Raspi(),
			repl: false
		} );

		this.currentLEDIndex = 0;
		this.leds;
		this.interval = null;

		this.ticksPerSecond = 60;
		this.tickIntervalMillis = 1000 / this.ticksPerSecond;
		this.startTime = 0;
		this.patternFunction = this.sweep;
		this.runTime = 0;

		this.animationPlayer = new AnimationPlayer( this.update.bind( this ) );

		this.board.on( 'ready', this.setup.bind( this ) );
	}

	setup() {
		this.currentLEDIndex = 0;
		// leds = new five.Leds( [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ] );
		this.leds = new five.Leds( [ 2, 3, 4, 5 ] );
		this.play();
	}

	play() {
		if ( this.interval ) return;
		this.lastLoopTime = _.now();
		this.interval = setInterval( this.loop.bind( this ), this.tickIntervalMillis );
	}

	stop() {
		clearInterval( this.interval );
		this.interval = null;
	}

	loop() {
		var now = _.now();
		var loopTime = now - this.lastLoopTime;
		this.runTime += loopTime;
		var tick = _.floor( this.runTime / this.tickIntervalMillis );
		this.lastLoopTime = now;
		this.patternFunction( tick );
	}

	sweep( tick ) {
		this.leds.each( function( led ) {
			led.off();
		} );

		this.leds[ tick % this.leds.length ].on();
		this.currentLEDIndex = ( this.currentLEDIndex + 1 );
	}

	led( model ) {
		model.id = model.id || 0;
		model.state = model.state || 'off';
		// stop loop
		this.stop();
		// kill other leds
		this.leds.each( ( led ) => led.off() );
		// start the led at id
		this.currentLEDIndex = model.id;
		this.leds[ this.currentLEDIndex ][ model.state ]();
	}
}

module.exports = Robot;
