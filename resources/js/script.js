//audio
var shoot = $("#flashing")[0];
$("#take-photo ")
.mouseover(function() {
shoot.play();
});

$('.js--scroll-to-section-about').click(function () {
$('html, body').animate({scrollTop: $('.section-gap').offset().top}, 2000); 
});

$('.js--scroll-to-section-form').click(function () {
$('html, body').animate({scrollTop: $('.section-form').offset().top}, 2000); 
});

$('.js--scroll-to-section-social').click(function () {
$('html, body').animate({scrollTop: $('.page-footer').offset().top}, 2000); 
});

$('.js--scroll-to-section-recent-photo').click(function () {
$('html, body').animate({scrollTop: $('.section-gallery').offset().top}, 2000); 
});

$('.js--scroll-to-section-home').click(function () {
$('html, body').animate({scrollTop: $('#center').offset().top}, 2000); 
});

    


