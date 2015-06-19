// you can enter your JS here!
// Added by Afzal : start
jQuery(document).ready(function ($) {

    // Variables for this scope (including functions inside)
    /*************************************************************/
    // Photo Carousel Related
    var $clicked_link;
    var sliderInterval;
    var slideShowDelay = 4000;

    // Review Related
    var default_reviews = $('.reviews_list').html(); // Keep backup of default order
    var per_page = 5; // review to show per page


    // Photo Carousel Initialization
    /***************************************/
    init_photo_carousel();
    register_photo_carousel_callbacks();

    // Review Block Initialization
    /***************************************/
    review_show_first_page();
    review_make_dot_nav();
    retister_review_navigation_callbacks();

    // Photo carousel functions
    /***************************************/
    function init_photo_carousel() {
        // load initial photo
        $('.large_photo img').attr('src', $('.photos li:first-child a').addClass('active').attr('href'));
        $('.large_photo p').html($('.photos li:first-child img').attr('alt'));
        //pre-load next one if exists
        if ($('.photos li:first-child').next().length) {
            $('<img/>')[0].src = $('.photos li:first-child').next().find('a').attr('href');
        }
    }

    function register_photo_carousel_callbacks() {
        // Change photo on thumbnail click
        $('.photos li a').each(function () {
            $(this).click(function (e) {
                $clicked_link = $(this);
                e.preventDefault();
                change_big_photo($clicked_link);
            });
        });

        // Load Next image on 'Next Button' click
        $('.carousel_nav.next').click(function () {
            // if the last child is active then load the first one
            if ($('.photos li:last-child a').hasClass('active')) {
                change_big_photo($('.photos li:first-child a'));
            }
            // find the active thumb and load the next one
            else {
                change_big_photo($('.photos').find('a.active').parent().next().children('a'));
            }
        });

        // Load Prev image on 'Prev Button' click
        $('.carousel_nav.prev').click(function () {
            // if the first child is active then load the last one
            if ($('.photos li:first-child a').hasClass('active')) {
                change_big_photo($('.photos li:last-child a'));
            }
            // find the active thumb and load the next one
            else {
                change_big_photo($('.photos').find('a.active').parent().prev().children('a'));
            }
        });

        // Auto SlideShow (trigger next button click in every 4 seconds)
        sliderInterval = setInterval(function () {
            // trigger next button click
            $('.carousel_nav.next').click();
        }, slideShowDelay);
    }

    /**
     * This function changes the big photo with fading effect. Also pre-loads the previous and next image
     * @param target - the 'a' tag having the big image's link as href attribute
     */
    function change_big_photo(target) {

        // Reset the SlideShow timer - need to reset it as user may change image by clicking during the SlideInterval
        //clearInterval(sliderInterval);
        //sliderInterval = setInterval(function () {
        //    // trigger next button click
        //    $('.carousel_nav.next').click();
        //}, slideShowDelay);

        // remove 'active' class from siblings and assign 'active' class to current thumbnail
        target.parent().siblings().each(function () {
            $(this).children('a').removeClass('active');
        });
        target.addClass('active');

        //start pre-loading before fading
        $('<img/>')[0].src = target.attr('href');

        // fade to opacity 0.5
        $('.large_photo img').fadeTo(300, .5, function () {
            // after reaching opacity 0.2 change the image src
            $(this).attr('src', target.attr('href'));
            $('.large_photo p').html(target.find('img').attr('alt'));
            // wait for the image to load and change the opacity back to 1
            $(this).one('load', function () {
                $(this).fadeTo(300, 1);
            });
            // trigger 'load' event manually if the image is already cached by the browser
            if ($(this)[0].complete) {
                $(this).trigger('load');
            }

        });

        // pre-load the next one if exists
        if (target.parent().next().length) {
            $('<img/>')[0].src = target.parent().next().find('a').attr('href');
        }
        // pre-load the previous one if exists
        if (target.parent().prev().length) {
            $('<img/>')[0].src = target.parent().prev().find('a').attr('href');
        }
    }


    // Review Block Functions
    /***************************************/

    /**
     * Register callback for Sorting buttons as well as dot nav buttons
     */
    function retister_review_navigation_callbacks() {
        //bind click event to default button
        $('.review-sort-buttons .d_sort').click(function (e) {
            // check if it's already selected and return if true
            if ($(this).hasClass('selected')) return;
            // remove 'selected' class from all buttons
            $('.review-sort-buttons button').removeClass('selected');
            // then add 'selected' class to this button
            $('.review-sort-buttons .d_sort').addClass('selected');
            // restore the default order with fading effect
            $('.reviews_list').fadeTo(300, .1, function () {
                $(this).html(default_reviews);
                review_show_first_page();
                $(this).fadeTo(200, 1);
            });
            review_reset_dot_nav();
        });

        //bind click event to 'Best First' button
        $('.review-sort-buttons .b_sort').click(function (e) {
            // check if it's already selected and return if true
            if ($(this).hasClass('selected')) return;
            // remove 'selected' class from all buttons
            $('.review-sort-buttons button').removeClass('selected');
            // then add 'selected' class to this button
            $('.review-sort-buttons .b_sort').addClass('selected');
            // call the sort function (false for highest first)
            sort_the_reviews(false);
        });

        //bind click event to 'Worst First' button
        $('.review-sort-buttons .w_sort').click(function (e) {
            // check if it's already selected and return if true
            if ($(this).hasClass('selected')) return;
            // remove 'selected' class from all buttons
            $('.review-sort-buttons button').removeClass('selected');
            // then add 'selected' class to this button
            $('.review-sort-buttons .w_sort').addClass('selected');
            // call the sort function (true for reverse sort in order to get lowest first)
            sort_the_reviews(true);
        });

        // bind click event to 'dot nav' buttons
        $('.review-dot-nav span').click(function (e) {
            var id = $(this).attr('id');
            $('.review-dot-nav span').removeClass('current');
            $(this).addClass('current');
            review_update_page(id);
        });
    }


    /**
     * function to sort the review (highest first). Also after sorting it will change the innerHTML of the review block
     * with fading effect
     * @param reverse_sort (if true then lowest first)
     */
    function sort_the_reviews(reverse_sort) {
        if ($('.reviews_list .one_review').length) {
            // get the review list as array and sort them based on review score - highest first
            var sorted_reviews = $('.reviews_list .one_review').sort(function (a, b) {
                var value_a = parseInt($(a).children('.review_score').text());
                var value_b = parseInt($(b).children('.review_score').text());
                return (value_a > value_b) ? -1 : (value_a < value_b) ? 1 : 0;
            });

            // reverse if necessary
            if (reverse_sort) {
                sorted_reviews = $.makeArray(sorted_reviews).reverse();
            }

            // change the html with sorted list with some fading effect
            $('.reviews_list').fadeTo(300, .1, function () {
                $(this).html(sorted_reviews);
                $(this).html(sorted_reviews);
                review_show_first_page();
                $(this).fadeTo(200, 1);
            });
            review_reset_dot_nav();
        }
    }

    /**
     * Show first page and hide others
     */
    function review_show_first_page() {
        // reset the class attribute to default
        $('.reviews_list .one_review').removeAttr('class').addClass('one_review');
        // add pagination classes (page1, page2 etc)
        review_add_page_classes();
        // hide all at first
        $('.reviews_list .one_review').hide();
        // show only the first page (items with class 'page1')
        $('.reviews_list .one_review.page1').show();
    }

    function review_update_page(nav_id) {
        $('.reviews_list .one_review').fadeOut().hide();
        var class_name = '.reviews_list .one_review.' + nav_id;
        $(class_name).fadeIn().show();
    }

    /**
     * Add page classes (page1, page2 etc.) to each review item
     */
    function review_add_page_classes() {
        var total_review, page_no = 1, current_review, i;

        // find total pages required
        total_review = $('.reviews_list .one_review').length;
        // catch the fist one
        current_review = $('.reviews_list .one_review:first-child');
        // loop through all the reviews
        for (i = 1; i <= total_review; i++) {
            var classname = 'page' + page_no;
            current_review.addClass(classname);
            current_review = current_review.next();
            // change page_no (which will change the class) when per_page limit is reached
            if (i % per_page == 0) page_no++;
        }
    }

    /**
     * Add a dot nav below the review block
     * Create some spans matching the number of pages and insert them into the target div
     */
    function review_make_dot_nav() {
        var nav_html = '', total_page, i;
        // find out how many pages
        total_page = Math.ceil($('.reviews_list .one_review').length / per_page);
        // append one span for each page
        for (i = 1; i <= total_page; i++) {
            nav_html = nav_html + '<span class=\"bullet\" id=\"page' + i + '\"></span>';
        }
        // mark the first one as current page by adding a class
        $('.review-dot-nav').html(nav_html).children('span:first-child').addClass('current');
    }

    /**
     * Reset the dot nav to first page (after sorting changes it's required to reset the dot nav)
     */
    function review_reset_dot_nav() {
        // remove the current class for the current nav
        $('.review-dot-nav span').removeClass('current');
        // assign it to the first one
        $('.review-dot-nav span:first-child').addClass('current');
    }
});

// Added by Afzal : end
