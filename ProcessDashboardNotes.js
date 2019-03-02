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

	var jsDashboardNotesConfigs, colourPickerDefaultBackgroundColour, colourPickerSave, colourPickerClear, parent;

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
	 * Show or Hide bulk actions button depending on whether notes selected.
	 *
	 */
	function showHideActionsPanel() {

		var $actionButton;
		var $items;

		// modal thumbs view: check if any notes checkboxes are cheched
		$items = parent.find('input.dn_note_check:checked').first();
		//$actionButton = $('button#dn_actions_btn_copy, button#dn_actions_btn');
		$actionButton = $('button#dn_actions_btn_copy');

		// if current selections, show actions button
		if ($items.length) $actionButton.removeClass('dn_hide').fadeIn('slow');
		// else hide actions burron
		else $actionButton.fadeOut('slow').addClass('dn_hide');

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
	 * Set checked states for selected notes.
	 *
	 * Listens to clicks, double clicks and shift clicks in notes selection.
	 * Double click will select all notes.
	 * Shift click selects notes within a range (start - end).
	 *
	 * @param Object $selected The selected element.
	 * @param Event e A Javascript click event.
	 *
	 */
	function notesSelection($selected, e) {

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
		var $mediaThumbChkboxes = $parent.find("input[type='checkbox'].dn_note_check");
		var $start = $mediaThumbChkboxes.index($currentChkbox);
		var $previousChkbox = $parent.find('input#' + $previousChkboxID);
		var $end = $mediaThumbChkboxes.index($previousChkbox);
		var $shiftChecked = $mediaThumbChkboxes.slice(Math.min($start, $end), Math.max($start, $end) + 1);

		console.log($shiftChecked,'shift checked');
		

		$shiftChecked.each(function () {
			 // skip start and end (already checked)
			if ($(this).is(":checked")) return;
			$(this).parent('label').find("span.dn_select").click();
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
	 * @param string $el String to select the element which will be replaced with the actual color-picker.
	 * @param string $i String to select the hidden element where we will save the selected colour.
	 *
	 */
	//function initColourPicker($targetElement, $colourValueElement) {// @todo; delete when done
	function initColourPicker($targetElement) {

		if (jsDashboardNotesConfigs) {
			colourPickerDefaultTextColour = jsDashboardNotesConfigs.config.colourPickerDefaultTextColour;
			colourPickerDefaultBackgroundColour = jsDashboardNotesConfigs.config.colourPickerDefaultBackgroundColour;
			colourPickerSave = jsDashboardNotesConfigs.config.colourPickerSave;
			colourPickerClear = jsDashboardNotesConfigs.config.colourPickerClear;
		}

		var $el, $defaultColour, $colourType, $colourValueElement;

		$el = "#" + $targetElement.attr('id');
		$colourType = $targetElement.attr('data-colour-type');
		$colourValueElement = "#" + $targetElement.attr('data-colour');
		$defaultColour = $colourType == "text" ? colourPickerDefaultTextColour : colourPickerDefaultBackgroundColour;


		// @see optional options for more configuration.
		const pickr = Pickr.create({
			el: $el,
			// default color
			default: (0 == $defaultColour ? null : $defaultColour),
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
			// @todo: future update; make configurable?
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
			var $updateElement = $('input' + $colourValueElement);
			if (hsva) {
				var rgbaString = hsva.toRGBA().toString(); // returns rgba(r, g, b, a)
				// save the selected color to the hidden input for note background colour
				$updateElement.val(rgbaString);
			}
			// no background colour, so set to 0
			else $updateElement.val(0);
		});

	}

	/**
	 * Initialise this script.
	 *
	 */
	function init() {


		// initialise colour pickers (for background and text colours)
		if (typeof Pickr !== 'undefined') {
			$('div.dn_colour_picker').each(function(){
				/*var $elementID = "#" + $(this).attr('id');
				var $colourValueElementID = "#" + $(this).attr('data-colour');
				initColourPicker($elementID, $colourValueElementID)*/
				//var $elementID = "#" + $(this).attr('id');
				var $targetElement = $(this);
				initColourPicker($targetElement)
			});
		}

		// @todo: refresh parent page on modal (add/edit note) close

		// change of "delete/selected" status for an item event
		$(document).on("change", ".gridImage__selectbox", function () {
			console.log('checkbox changed');
			updateSelectClass($(this));
			// @todo: needed? if not delete. if yes, add parent above!
			parent = $(this).parents('div#dn_notes_container');
			showHideActionsPanel();
		});

		// click or double click select/trash event
		// @note: was 'gridImage__trash' in original
		//$(document).on('click dblclick', '.gridImage__icon', function (e) {
		$(document).on('click dblclick', '.dn_select', function (e) {
			e.preventDefault();
			e.stopPropagation();
			notesSelection($(this),e);
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