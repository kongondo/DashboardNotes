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

	var jsDashboardNotesConfigs, colourPickerDefaultColour, colourPickerSave, colourPickerClear, parent;

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
	 * Updates outer class of item to match that of its "delete" checkbox
	 *
	 * @note: originally from InputfieldImage.js updateDeleteClass().
	 *
	 * @param $checkbox
	 *
	 */
	function updateSelectClass($checkbox) {
		if($checkbox.is(":checked")) {
			$checkbox.parents('.dn_note').addClass("gridImage--select");
		} else {
			$checkbox.parents('.dn_note').removeClass("gridImage--select");
		}
	}

	/**
	 * Set checked states for selected media.
	 *
	 * Listens to clicks, double clicks and shift clicks in media selection.
	 * Double click will select all media.
	 * Shift click selects media within a range (start - end).
	 *
	 * @param Object $selected The selected element.
	 * @param Event e A Javascript click event.
	 *
	 */
	function mediaSelection($selected, e) {

		// @todo: change name!

		parent = $selected.parents('div#dn_notes_container');
		var $label = $selected.parent('label');
		var $input = $label.find("input");
		$input.prop("checked", inverseState).change();

		if (e.type == "dblclick") {
			setSelectedStateOnAllItems($input);
			e.preventDefault();
			e.stopPropagation();
		}

		// @todo: need this input#mm_previous_selected_media !
		if ($input.is(":checked")) {
			var $prevChecked = $('input#mm_previous_selected_media');
			var $prevCheckedID = $prevChecked.val();
			// shift select @todo: do we really need these?
			if (e.shiftKey) {
				//e.preventDefault();
				preventNormalShiftSelection();
				// @note: prevent shift select of other text; works but there's quick flash of other selection first
				initShiftSelectCheckboxes($prevCheckedID, $input);
			}
			// change value of previous select to current selected
			$prevChecked.val($input.attr('id'));
		}

	}

	/**
	 * Prevent selection of other text when using shift-select media range.
	 */
	function preventNormalShiftSelection() {
		document.getSelection().removeAllRanges();
		/*
		window.onload = function() {
			document.onselectstart = function() {
				return false;
			}
		}
		*/
	}

	/**
	 * Implement shift+click to select range of checkboxes
	 *
	 * @param string $previousChkboxID The ID of the previously selected checkbox.
	 * @param object $currentChkbox The currently selected checkbox.
	 *
	 */
	function initShiftSelectCheckboxes($previousChkboxID, $currentChkbox) {

		//@todo: delete when done!
		//var $parent = $("div.mm_thumbs:not(.mm_hide)");
		var $parent = $("div#dn_notes_container");
		var $mediaThumbChkboxes = $parent.find("input[type='checkbox'].mm_thumb");
		var $start = $mediaThumbChkboxes.index($currentChkbox);
		var $previousChkbox = $parent.find('input#' + $previousChkboxID);
		var $end = $mediaThumbChkboxes.index($previousChkbox);
		var $shiftChecked = $mediaThumbChkboxes.slice(Math.min($start, $end), Math.max($start, $end) + 1);

		$shiftChecked.each(function () {
			 // skip start and end (already checked)
			if ($(this).is(":checked")) return;
			$(this).parent('label').find("span.mm_select").click();
		});

	}

	/**
	 * Helper function for inversing state of checkboxes
	 *
	 * @note: originally from InputfieldImage.js.
	 *
	 * @param index
	 * @param old
	 * @returns {boolean}
	 *
	 */
	function inverseState($index, $old) {
		return !$old;
	}

	/**
	 * Sets the checkbox delete state of all items to have the same as that of $input
	 *
	 * @note: originally from InputfieldImage.js.
	 *
	 * @param $input
	 *
	 */
	function setSelectedStateOnAllItems($input) {
		// @note: original function name setDeleteStateOnAllItems
		var $checked = $input.is(":checked");
		var $items = parent.find('.gridImages').find('.gridImage__selectbox');
		if ($checked) $items.prop("checked", "checked").change();
		else $items.removeAttr("checked").change();
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

		// @todo: refresh parent page on modal (add/edit note) close

		
		// change of "delete/selected" status for an item event
		$(document).on("change", ".gridImage__selectbox", function () {
			console.log('checkbox changed');
			updateSelectClass($(this));
			// @todo: needed? if not delete. if yes, add parent above!
			parent = $(this).parents('div#dn_notes_container');
		});

		// click or double click select/trash event
		// @note: was 'gridImage__trash' in original
		//$(document).on('click dblclick', '.gridImage__icon', function (e) {
		$(document).on('click dblclick', '.mm_select', function (e) {
			e.preventDefault();
			e.stopPropagation();
			mediaSelection($(this),e);
		});


	}

	// initialise script
	init();

}// END ProcessDashboardNotes()


/*************************************************************/
// READY

jQuery(document).ready(function($) {
	ProcessDashboardNotes($);
});