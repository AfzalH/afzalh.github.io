/*!
 * jQuery Equal Height Children
 *
 * Copyright (c) 2014 Md. Afzal Hossain
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://docs.jquery.com/License
 *
 * @version 1.0.0
 */
(function ($) {

    $.fn.equalHeightChildren = function () {
        // find first child and start recursive call
        $(this).children(":first").equalSibling();
    };

    $.fn.equalSibling = function () {
        // if it has a next sibling then recursive call to equalSibling for that element. before that change height if the next sibling has lower height and belong on the same row (by checking top value)
        if ($(this).next().position()) {
            if ($(this).next().innerHeight() < $(this).innerHeight() && ($(this).next().position().top == $(this).position().top)) {
                $(this).next().innerHeight($(this).innerHeight());
            }
            $(this).next().equalSibling();
        }
        // if it has a previous sibling change height if the previous sibling has lower height and belong on the same row (by checking top value) and then recursive call to previous sibling
        if ($(this).prev().position()) {
            if ($(this).prev().innerHeight() < $(this).innerHeight() && ($(this).prev().position().top == $(this).position().top)) {
                $(this).prev().innerHeight($(this).innerHeight());
                $(this).prev().equalSibling();
            }
        }
    };

    // auto-initialize plugin


})(jQuery);

jQuery(document).ready(function () {
    // find all element with data-equal-children-height attribute make their children equal height (max height of each row)
    jQuery('[data-equal-height-children]').each(function () {
        $(this).equalHeightChildren();
    });

    // if window is re-sized then call again
    $(window).resize(function(){
        jQuery('[data-equal-height-children]').each(function () {
            $(this).equalHeightChildren();
        });
    });
});