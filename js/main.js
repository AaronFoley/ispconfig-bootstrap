jQuery(document).ready(function() {
    loadInitContent();
    $('form').not('#dummy_login_form').attr('autocomplete', 'off');
    $("#pageForm").submit(function(e) {
        //Prevent form submit: e.preventDefault() in lists
        if ($(".panel #Filter").length > 0) {
            e.preventDefault();
        }
    });
    jQuery('.subsectiontoggle').live("click", function() {
        jQuery(this).children().toggleClass('showing').end().next().slideToggle();
    });
    jQuery('#globalsearch').ispconfigSearch({
        dataSrc: '/dashboard/ajax_get_json.php?type=globalsearch',
        resultsLimit: '$ <tmpl_var name="globalsearch_resultslimit_of_txt"> % <tmpl_var name="globalsearch_resultslimit_results_txt">',
        noResultsText: '<tmpl_var name="globalsearch_noresults_text_txt">',
        noResultsLimit: '<tmpl_var name="globalsearch_noresults_limit_txt">',
        searchFieldWatermark: '<tmpl_var name="globalsearch_searchfield_watermark_txt">'
    });
    tabChangeDiscard = '<tmpl_var name="tabchange_discard_enabled>';
    tabChangeWarning = '<tmpl_var name="tabchange_warning_enabled>';
    tabChangeWarningTxt = '<tmpl_var name="global_tabchange_warning_txt">';
    tabChangeDiscardTxt = '<tmpl_var name="global_tabchange_discard_txt">';
    // Store password in browser; works in Firefox, but not Chrome
    $('#username').live("blur", function() {
        if ($('#username').val() == '') {
            return true;
        }
        if ($('#dummy_username').val() == '' || $('#dummy_username').val() != $(this).val()) {
            $('#dummy_login').show();
            $('#dummy_username').attr('value', $(this).val()).trigger('focus').trigger('blur');
            $('#dummy_login').hide();
        }
        if ($('#dummy_username').val() == $(this).val() && $(this).val() != '') {
            $('#passwort').val($('#dummy_passwort').val());
        } else {
            $('#passwort').val('');
        }
        $('#passwort').focus();
    });
    $('#username').live("keyup", function() {
        $('#dummy_username').val('');
        $('#dummy_passwort').val('');
        $('#passwort').val('');
    });
});
jQuery(document).bind("change", function(event) {
    var elName = event.target.localName;
    if (jQuery(".panel #Filter").length > 0 && elName == 'select') {
        event.preventDefault();
        jQuery(".panel #Filter").trigger('click');
    }
    if (elName == 'select' || elName == 'input' || elName == 'textarea') {
        if (jQuery(event.target).hasClass('no-page-form-change') == false) {
            // set marker that something was changed
            pageFormChanged = true;
        }
    }
});
jQuery(document).bind("keypress", function(event) {
    //Use jQuery submit with keypress Enter in panel filterbar
    if (event.which == '13' && jQuery(".panel #Filter").length > 0 && jQuery(event.target).hasClass('ui-autocomplete-input') == false) {
        event.preventDefault();
        jQuery(".panel #Filter").trigger('click');
    }
    //Use jQuery submit with keypress Enter in forms
    if (event.which == '13' && jQuery(".pnl_formsarea button.positive").length > 0 && event.target.localName != 'textarea' && jQuery(event.target).is(':input')) {
        event.preventDefault();
        jQuery(".pnl_formsarea button.positive:first").not("[disabled='disabled']").trigger('click');
    }
});
jQuery(document).delegate('.pnl_listarea th', 'click', function(event) {
    if (jQuery(this).attr('class').length > 0 && jQuery(".panel #Filter").length > 0 && jQuery(this).hasClass('tbl_col_buttons') == false && jQuery(this).hasClass('tbl_col_limit') == false && jQuery(this).hasClass('tbl_col_nosort') == false) {
        event.preventDefault();
        var clickevent = jQuery('#Filter').attr('onclick');
        var element = jQuery(this).attr('class');
        if (typeof clickevent == 'string') {
            jQuery('#Filter').attr('onclick', clickevent.replace(".php')", ".php?orderby=" + element + "')"));
        }
        jQuery(".panel #Filter").trigger('click');
        jQuery("#pageForm").ajaxComplete(function() {
            if (jQuery("th." + element).css("background-position") == '0px -15px') {
                if (jQuery("th." + element).css("text-align") == "right") {
                    jQuery("th." + element).css("text-align", "left");
                } else {
                    jQuery("th." + element).css("text-align", "right");
                }
            } else {
                jQuery(".pnl_listarea th").css("text-align", "");
            }
            jQuery(".pnl_listarea th").css("background-position", "0 0");
            jQuery("th." + element).css("background-position", "0 -15px");
        });
    }
});