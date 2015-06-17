// you can enter your JS here!
jQuery(document).ready(function ($) {

    // Photo carousel
    /***************************************/

    // load initial photo
    $('.large_photo img').attr('src', $('.photos li:first-child a').attr('href'));
    $('.large_photo p').html($('.photos li:first-child img').attr('alt'));
    //pre-load next one
    $('<img/>')[0].src = $('.photos li:first-child').next().find('a').attr('href');

    // Change photo on thumbnail click
    $('.photos li a').each(function(){
        $(this).click(function (e) {
            var $clicked_link = $(this);
            e.preventDefault();

            //start pre-loading before fading
            $('<img/>')[0].src = $clicked_link.attr('href');

            // fade to opacity 0.2
            $('.large_photo img').fadeTo(200,.2, function () {
                // after reaching opacity 0.2 change the image src
                $(this).attr('src', $clicked_link.attr('href'));
                $('.large_photo p').html($clicked_link.find('img').attr('alt'));
                // change the opacity back to 1
                $(this).fadeTo(200,1);
            });

            // pre-load the next one
            $('<img/>')[0].src = $clicked_link.parent().next().find('a').attr('href');
            // pre-load the previous one
            $('<img/>')[0].src = $clicked_link.parent().prev().find('a').attr('href');
        });
    });

});