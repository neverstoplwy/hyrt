$(function() {
    var imageSetting = {
        keyCode: 0,
        isFirst: true,
        currIndex: 0,
        sliderWidth: 0,
        sliderLength: 0,
        sliderHeight: 0,
        sliderOutTimer: null
    };

    var sliderImage = {
        init: function() {
            sliderImage.imageData();

            $('#slider ul').css({'width': imageSetting.sliderWidth * imageSetting.sliderLength, 'height': imageSetting.sliderHeight});

            sliderImage.createButton();

            imageSetting.sliderOutTimer = setTimeout(sliderImage.showImage, 3000);
        },

        imageData: function() {
            imageSetting.sliderWidth = $('#slider').width();

            imageSetting.sliderHeight = $('#slider').height();

            imageSetting.sliderLength = $('#slider #imgbox ul li').length;
        },

        showImage: function(direction, clickIndex) {
            sliderImage.stopTimer();

            var direction = (clickIndex != undefined) ? 'button' : (direction ? direction : 'next');

            if(direction == 'prev') {
                imageSetting.currIndex = imageSetting.currIndex - 1 < 0 ? imageSetting.sliderLength - 1 : imageSetting.currIndex - 1;
            }

            if(direction == 'next') {
                imageSetting.currIndex = imageSetting.currIndex + 1 >= imageSetting.sliderLength ? 0 : imageSetting.currIndex + 1;
            }

            if(direction == 'button') {
                imageSetting.currIndex = clickIndex;
            }

            $('#slider ul').stop().animate({'left': -imageSetting.currIndex * imageSetting.sliderWidth}, 300);

            $('#slider #numbox span').removeClass('active').eq(imageSetting.currIndex).addClass('active');

            imageSetting.sliderOutTimer = setTimeout(sliderImage.showImage, 5000);
        },

        stopTimer: function() {
            clearTimeout(imageSetting.sliderOutTimer);
        },

        createButton: function() {
            if(imageSetting.isFirst == false) {
                return;
            }

            for(var i = 1; i <= imageSetting.sliderLength; i++) {
                var active = (i == 1) ? 'active' : '';

                $('#slider #numbox').append("<span class='" + active + "'></span>");
            }

            imageSetting.isFirst = false;
        }
    };

    $('#slider #numbox span').live('click', function() {
        sliderImage.showImage(null, $('#slider #numbox span').index(this));
    });

    sliderImage.init();
});/**
 * Created by lwy on 15/3/2.
 */
