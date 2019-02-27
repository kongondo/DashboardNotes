/**
 *
 * Javascript file for PW Module ProcessDashboardNotes
 *
 * @author Francis Otieno (Kongondo) <kongondo@gmail.com>
 *
 * https://github.com/kongondo/ProcessDashboardNotes
 * Created March 2015, major update December 2017
 *
 */

function ProcessDashboardNotes($) {

	/*************************************************************/
	// SCRIPT GLOBAL VARIABLES

	/*	@note:
		- global variables NOT prefixed with '$'.
		- function parameters and variables PREFIXED with '$'
	*/

	var jsDashboardNotesConfigs, colourPickerDefaultColour, colourPickerSave, colourPickerClear;

	// grab values for some variables
	jsDashboardNotesConfigs = ProcessDashboardNotesConfigs();

    /*************************************************************/
	// FUNCTIONS

	/**
	 * Get the configs sent by the module ProcessDashboardNotes.
	 *
	 * We use these mainly for our custom notices function.
	 *
	 * @return Object|false jsDashboardNotesConfigs Return configurations if found, else false.
	 *
	*/
	function ProcessDashboardNotesConfigs(){
		// ProcessDashboardNotes configs
		var jsDashboardNotesConfigs = config.ProcessDashboardNotes;
		if (!jQuery.isEmptyObject(jsDashboardNotesConfigs)) return jsDashboardNotesConfigs;
		else return false;
	}

	/**
	 * Initialise Pickr.
	 *
	 */
	function initColourPicker() {

		if (jsDashboardNotesConfigs) {
			colourPickerDefaultColour = jsDashboardNotesConfigs.config.colourPickerDefaultColour;
			colourPickerSave = jsDashboardNotesConfigs.config.colourPickerSave;
			colourPickerClear = jsDashboardNotesConfigs.config.colourPickerClear;
		}


		// @see optional options for more configuration.
		const pickr = Pickr.create({
			el: '#dn_colour_picker',

			// default color
			default: (0 == colourPickerDefaultColour ? null : colourPickerDefaultColour),
			defaultRepresentation: 'RGBA',

			components: {

				// Main components
				preview: true,
				opacity: true,
				hue: true,

				// Input / output Options
				interaction: {
					hex: false,
					rgba: false,
					hsla: false,
					hsva: false,
					cmyk: false,
					input: false,
					clear: true,
					save: true
				},
			},

			swatches: [
				'#F44336',
				'#E91E63',
				'#9C27B0',
				'#673AB7',
				'#3F51B5',
				'#2196F3',
				'#03A9F4',
				'#00BCD4',
				'#009688',
				'#4CAF50',
				'#8BC34A',
				'#CDDC39',
				'#FFEB3B',
				'#FFC107'
			],

			// Translated Button strings // @todo; get from module config!
			strings: {
				save: colourPickerSave,  // save button
				clear: colourPickerClear // clear button
			}
		});

		// stop swatches buttons from firing
		pickr.on('init', (p) => {
			$("div.swatches button").click(function (e) {
				e.preventDefault();
				//e.stopPropagation();
			});
		}).on('save', (hsva) => {
			// converts the object to an rgba array.
			//var rgba = hsva.toRGBA()
			if (hsva) {
				var rgbaString = hsva.toRGBA().toString(); // returns rgba(r, g, b, a)
				// save the selected color to the hidden input for note background colour
				$('input#dn_note_colour').val(rgbaString);
			}

			else $('input#dn_note_colour').val(0);
		});

	}

	/**
	 * Initialise this script.
	 *
	 */
	function init() {

		// initialise colour picker
		if (typeof Pickr !== 'undefined') {
			initColourPicker()
		}
	}

	// initialise script
	init();

}// END ProcessDashboardNotes()


/*************************************************************/
// READY

jQuery(document).ready(function($) {
	ProcessDashboardNotes($);
});