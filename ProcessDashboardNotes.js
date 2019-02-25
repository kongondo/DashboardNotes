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

    //var someVar, anotherVar;

    /*************************************************************/
    // FUNCTIONS

    /**
     * Asm Select: Hide children level inputs if selected page is 'Home'.
     *
     * @param object $sel The Asm Select.
     *
     */
	function hideAsmHomeChildrenLevelInputs($sel) {
		var $opt = $sel.children('option[value="1"]');
		var $rel = null;
		if ($opt.length) {
			$rel = $opt.attr("rel");
			$("ol.asmList")
				.children('li[rel="' + $rel + '"]')
				.find("select.asm_include_children, input.asm_mb_max_level")
				.addClass("hide");
		}
	}

	/**
     * Toggle show/hide panels in Build Tab.
     *
     */
	function togglePanels() {

        /** toggle view/hide each menu's settings editor **/
        $("div.settings").hide();
        $(".item_expand_settings, .item_title_main").click(function() {
            var $id = $(this).attr("data-id");
            //$('#menu_edit'+id).toggle();
            $("#menu_edit" + $id).slideToggle(500);
            $("a")
                .find('[data-id="' + $id + '"]')
                .toggleClass("fa-caret-down")
                .toggleClass("fa-caret-up");
        });

        /** Toggle view/hide add page menu items panel **/
        $("#wrap_item_addpages").hide(); //hide li wrapper for add page menus items on load
        $("#add_page_menu_items").click(function(e) {
            // show/hide the asmSelect for adding page menu items
            $("#wrap_item_addpages").toggle(250);
			e.preventDefault(); //prevent default click <a> action from happening!
			e.stopPropagation();
        });

        /** Toggle view/hide add custom menu items panel **/
        $("#item_addcustom").hide(); //hide li wrapper for add custom menu items settings on load
        $("#add_custom_menu_items").click(function(e) {
            $("#item_addcustom").toggle(250);
			e.preventDefault();
			e.stopPropagation();
        });

        /** Toggle view/hide add pages selector menu items panel **/
        $("#wrap_item_addselector").hide(); //hide div for add custom menu items settings on load
        $("#add_selector_menu_items").click(function(e) {
            $("#wrap_item_addselector").toggle(250);
			e.preventDefault();
			e.stopPropagation();
        });

    }

    /**
     * Clone a row in the custom menu items inputs' table.
	 *
	 * Used to add new custom menu items.
     *
     */
	function clonePageRow() {
		var $tr = $("table.menu_add_custom_items_table tr:last");
        var $clone = $tr.clone(true);
        $clone.find("input[type=text]").attr("value", "");

        $("table.menu_add_custom_items_table").append($clone);
        $clone.find("input:first").focus();
        return false;
    }
    /**
     * Initiate Sortable on menu items.
     *
     * Used in the menu sortable list drag and drop.
	 * This is used to create relationships between menu items (parent, child, etc).
     *
     */
	function initMenuSortable() {

		$("div#menu_sortable_wrapper .sortable").sortable({
            // FUNCTION TO CAPTURE PARENT IDs OF MENU ITEMS ON DRAG & DROP EVENT AND SAVE THESE FOR EACH MENU ITEM [in their individual hidden fields]
            update: function(event, ui) {
                // create an array of menu item_id's and their parent_id's. Update parent ids at the finish of the drag/drop event [function - toArray]
                var $order = $(".sortable").sortable("toArray");

                // loop through the values [this is a 2 dimensional object ]
                for (var $key in $order) {
					// the item id; retrieved via the key 'item_id' which is the name given by toArray
					var $id = $order[$key].item_id;
					var $parent = $order[$key].parent_id; // the parent id
					// update each menu item's hidden parent field value to store the new parent
					$("#item_parent" + $id).val($parent);
					/*
					*	note:
					*	Here we look for the id that matches the item_id, e.g. #item_parent5.
					*	This matching ensures correct assignment of parentage.
					*	Note, item_parent id is not the ID of the PW page parent!
					*	The ID of the parent is the value of this input field, item_parent[]. Need the item_parent{$id} here for convenience.
					*
					*/
                }
            }
        });

	}

	/**
	 * Initialise this script.
	 *
	 */
	function init() {



		/** Toggle all checkboxes in the list of menus table **/
		$(document).on("change", "input.toggle_all", function () {
			toggleAllCheckboxes($(this));
		});

		/* 03. #### BUILD MENU TAB #### */
		/** MB CUSTOM AsmSelect OUTPUT **/
		$(".InputfieldAsmSelect select[multiple=multipleMB]").each(function() {
			var $t = $(this);
			var $options;
			if (typeof config === "undefined") $options = { sortable: true };
			else $options = config[$t.attr("id")];
			$t.asmSelectMB($options); // asmSelectMB() is our modified AsmSelect's function (see jquery.asmselect-mb.js)
		});

		/** Toggle view/hide panels **/
		//togglePanels();




	}

	// initialise script
	init();

}// END ProcessDashboardNotes()


/*************************************************************/
// READY

jQuery(document).ready(function($) {
	ProcessDashboardNotes($);
});