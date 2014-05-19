var app = angular.module('presentation', 
                         ['ngMock', 'ngResource', 'ngRoute']);

app.factory('slidedeck', ['$location', '$route', function($location, $route) {
    var slidedeck = {
        touchpositionX: undefined,
	slides: [],
	activeSlide: null,	

	addSlide: function(elem) {
	    this.slides.push($(elem).attr('id'));

	    if (this.activeSlide == null) {
		var slideId = $(elem).attr('id');
		$('#' + slideId).addClass('active-slide');
                this.activeSlide = slideId;
	    }

	    if (this.slides.length-1 == ($location.search()).slide) {
		this.showSlide($(elem).attr('id'));
	    }
	},

	showSlide: function(slideId) {
	    $('.active-slide').removeClass('active-slide');
	    $('#' + slideId).addClass('active-slide');

	    this.activeSlide = slideId;
	    $location.search('slide', this.slides.indexOf(slideId)); 
	},
	
	nextSlide: function() {
	    var pos = this.slides.indexOf(this.activeSlide); 
	    if (pos < this.slides.length-1)
		pos++;
	    this.showSlide(this.slides[pos]);
	},

	prevSlide: function() {
	    var pos = this.slides.indexOf(this.activeSlide); 
	    if (pos > 0)
		pos--;
	    this.showSlide(this.slides[pos]);
	},

	firstSlide: function() {
	    this.showSlide(this.slides[0]);
	},

	lastSlide: function() {
	    this.showSlide(this.slides[this.slides.length-1]);
	},
    }

    $(document).bind('touchstart', function(event) {
        touchpositionX = event.screenX;
    });
    $(document).bind('touchend', function(event) {
        if (Math.abs(touchpositionX - event.screenX) < 10) {
            return ;
        }
        if (touchpositionX > event.screenX)
	    slidedeck.nextSlide();
        else
	    slidedeck.prevSlide();
    });
        
    $(document).keydown(function(event) {
	if (/^(input|textarea)$/i.test(event.target.nodeName) ||
	    event.target.isContentEditable
	   || event.altKey || event.ctrlKey || event.shiftKey || event.metaKey ) {
	    return;
	}
	
	switch (event.keyCode) {

	case 36: // down arrow
	    slidedeck.firstSlide();
	    event.preventDefault();
	    break;

	case 35: // down arrow
	    slidedeck.lastSlide();
	    event.preventDefault();
	    break;

	case 39: // right arrow
	case 32: // space
	case 34: // PgDn
	case 40: // down arrow
	    slidedeck.nextSlide();
	    event.preventDefault();
	    break;

	    
	case 37: // left arrow
	case 8: // Backspace
	case 33: // PgUp
	case 38: // up arrow
	    slidedeck.prevSlide();
	    event.preventDefault();
	    break;
	}
    });

    return slidedeck;
}]);

app.directive('slide', ['slidedeck', function (slidedeck) {
    return {
	restrict: 'AE',

	link: function (scope, elem, attrs) {

	    if (attrs.id == undefined)
		$(elem).attr('id', 'slide-' + Math.random().toString(36).substring(7));

	    slidedeck.addSlide(elem, attrs);
	}		
    }
}]);
