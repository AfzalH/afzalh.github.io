// you can enter your JS here!
jQuery(document).ready(function ($) {

    // Photo carousel
    /***************************************/
    var $clicked_link;
    var sliderInterval;
    var slideShowDelay = 4000;

    // load initial photo
    $('.large_photo img').attr('src', $('.photos li:first-child a').addClass('active').attr('href'));
    $('.large_photo p').html($('.photos li:first-child img').attr('alt'));
    //pre-load next one if exists
    if( $('.photos li:first-child').next().length ) {
        $('<img/>')[0].src = $('.photos li:first-child').next().find('a').attr('href');
    }

    // Change photo on thumbnail click
    $('.photos li a').each(function(){
        $(this).click(function (e) {
            $clicked_link = $(this);
            e.preventDefault();
            change_big_photo($clicked_link);
        });
    });

    // Load Next image on 'Next Button' click
    $('.carousel_nav.next').click(function () {
        // if the last child is active then load the first one
        if($('.photos li:last-child a').hasClass('active')){
            change_big_photo($('.photos li:first-child a'));
        }
        // find the active thumb and load the next one
        else {
            change_big_photo( $('.photos').find('a.active').parent().next().children('a') );
        }
    });

    // Auto SlideShow (trigger next button click in every 4 seconds)
    sliderInterval = setInterval(function () {
        // trigger next button click
        $('.carousel_nav.next').click();
    },slideShowDelay);

    // Load Prev image on 'Prev Button' click
    $('.carousel_nav.prev').click(function () {
        // if the first child is active then load the last one
        if($('.photos li:first-child a').hasClass('active')){
            change_big_photo($('.photos li:last-child a'));
        }
        // find the active thumb and load the next one
        else {
            change_big_photo( $('.photos').find('a.active').parent().prev().children('a') );
        }
    });

    /**
     * This function changes the big photo with fading effect. Also pre-loads the previous and next image
     * @param target - the 'a' tag having the big image's link as href attribute
     */
    function change_big_photo(target){

        // Reset the SlideShow timer - need to reset it as user may change image by clicking during the SlideInterval
        clearInterval(sliderInterval);
        sliderInterval = setInterval(function () {
            // trigger next button click
            $('.carousel_nav.next').click();
        },slideShowDelay);

        // remove 'active' class from siblings and assign 'active' class to current thumbnail
        target.parent().siblings().each(function () {
            $(this).children('a').removeClass('active');
        });
        target.addClass('active');

        //start pre-loading before fading
        $('<img/>')[0].src = target.attr('href');

        // fade to opacity 0.2
        $('.large_photo img').fadeTo(300,.2, function () {
            // after reaching opacity 0.2 change the image src
            $(this).attr('src', target.attr('href'));
            $('.large_photo p').html(target.find('img').attr('alt'));
            // wait for the image to load and change the opacity back to 1
            $(this).one('load', function () {
                $(this).fadeTo(300,1);
            });
            // trigger 'load' event manually if the image is already cached by the browser
            if($(this)[0].complete){
                $(this).trigger('load');
            }

        });

        // pre-load the next one if exists
        if(target.parent().next().length) {
            $('<img/>')[0].src = target.parent().next().find('a').attr('href');
        }
        // pre-load the previous one if exists
        if(target.parent().prev().length) {
            $('<img/>')[0].src = target.parent().prev().find('a').attr('href');
        }
    }

});