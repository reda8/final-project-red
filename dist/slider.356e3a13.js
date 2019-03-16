// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"vendors/js/slider.js":[function(require,module,exports) {
(function ($) {
  "use strict";

  var Slider = window.Slider || {};

  Slider = function () {
    function Slider(el, settings) {
      var _ = this;

      var interval;
      _.defaults = {
        speed: 1000,
        delay: 3000,
        autoplay: true,
        pauseonhover: true,
        navigation: true,
        pagination: true,
        initialslide: 1,
        metric: '%',
        width: '100%',
        height: 'auto',
        slidertype: 'slide',
        direction: 'right',
        responsive: true,
        buttons: {
          prev: "<div class='prev slider-buttons'><span>&#8249;</span></div>",
          next: "<div class='next slider-buttons'><span>&#8250;</span></div>"
        }
      }, _.markup = {
        $slider: $(el),
        $slidercontainer: null,
        $slides: null,
        $btnprev: null,
        $btnnext: null,
        $dots: [],
        $dotscontainer: null,
        slidewidth: null
      }, _.options = $.extend({}, _.defaults, settings);

      _.init();
    }

    return Slider;
  }();

  Slider.prototype.init = function () {
    var _ = this;

    _.setup();

    if (_.options.autoplay === true) {
      _.startSlider();
    }
  };

  Slider.prototype.setup = function () {
    var _ = this; // create and store slider container


    _.markup.$slider.wrap("<div class='slider-container'></div>");

    _.markup.$slidercontainer = _.markup.$slider.parent(); // duplicate initial slide for smooth transitions

    _.markup.$slider.append(_.markup.$slider.children('li')[_.options.initialslide - 1].outerHTML); // get slides


    _.markup.$slides = _.markup.$slider.children('li'); // set slider container width

    _.markup.$slidercontainer.width(_.options.width); // set slider width


    _.markup.$slider.width(_.markup.$slides.length * 100 + _.options.metric); // set slide width


    _.markup.$slides.width(_.markup.$slider.width() / _.markup.$slides.length); // set slider container height


    if (_.options.height === 'auto') {
      var minimumHeight = 99999;

      _.markup.$slides.each(function () {
        if ($(this).height() < minimumHeight) {
          minimumHeight = $(this).height();
        }
      });

      _.markup.$slidercontainer.height(minimumHeight);
    } else {
      _.markup.$slidercontainer.height(_.options.height);
    } // set single slide width


    _.markup.slidewidth = _.markup.$slidercontainer.width(); // add slider navigation

    if (_.options.navigation === true) {
      _.markup.$slidercontainer.append(_.options.buttons.prev, _.options.buttons.next);

      _.markup.$btnprev = _.markup.$slidercontainer.find('.prev');
      _.markup.$btnnext = _.markup.$slidercontainer.find('.next');

      _.markup.$btnprev.on('click', $.proxy(_.slide, _, true, 'left', null));

      _.markup.$btnnext.on('click', $.proxy(_.slide, _, true, 'right', null));
    } // add slider pagination


    if (_.options.pagination === true) {
      for (var i = 1; i < _.markup.$slides.length; i++) {
        _.markup.$dots.push("<li class='dot' data-number='" + i + "'></li>");
      }

      var pagination = '';
      $.each(_.markup.$dots, function () {
        pagination += this;
      });

      _.markup.$slidercontainer.append("<ul class='pagination-container'>" + pagination + "</ul>");

      _.markup.$dotscontainer = _.markup.$slidercontainer.find('.pagination-container'); // set first slide active

      _.markup.$dotscontainer.children('li').eq(0).addClass('active'); // add click event to pagination dots


      _.markup.$dotscontainer.children('li').on('click', function () {
        var slideNumber = parseInt($(this).attr('data-number'), 10);

        _.slide(true, '', slideNumber);
      });
    }

    if (_.options.responsive === true) {
      _.resizeSlider();

      $(window).on('resize orientationchange', $.proxy(_.responsive, _));
    }
  };

  Slider.prototype.resizeSlider = function () {
    var _ = this; // if provided pixel width is bigger then window width, make slidercontainer width 100%


    if ($(window).width() <= parseInt(_.options.width, 10)) {
      _.markup.$slidercontainer.width('100%');
    } else {
      _.markup.$slidercontainer.width(_.options.width);
    }
  };

  Slider.prototype.responsive = function () {
    var _ = this;

    var minimumHeight = 99999;

    _.resizeSlider();

    _.pauseSlider();

    if (_.markup.$slider.is(':animated')) {
      _.markup.$slider.stop(true, true);
    }

    _.markup.$slides.width(_.markup.$slider.width() / _.markup.$slides.length);

    _.markup.slidewidth = _.markup.$slidercontainer.width();
    var slidePoint = _.markup.slidewidth * (_.options.initialslide - 1);

    _.markup.$slider.css({
      'margin-left': -slidePoint
    });

    _.markup.$slides.each(function () {
      if ($(this).height() < minimumHeight) {
        minimumHeight = $(this).height();
      }
    });

    if (minimumHeight < parseInt(_.options.height, 10) || _.options.height === 'auto') {
      _.markup.$slidercontainer.height(minimumHeight);
    }

    if (_.options.autoplay === true) {
      _.startSlider();
    }
  };

  Slider.prototype.pauseSlider = function () {
    var _ = this;

    clearInterval(_.interval);
  };

  Slider.prototype.startSlider = function () {
    var _ = this;

    _.sliderInit();
  };

  Slider.prototype.sliderInit = function () {
    var _ = this;

    switch (_.options.slidertype) {
      case 'slide':
        _.slide();

        break;
    }
  };

  Slider.prototype.slide = function (immediate, direction, frame) {
    var _ = this;

    var direction = direction ? direction : _.options.direction;

    if (immediate === true) {
      if (!_.markup.$slider.is(':animated')) {
        _.pauseSlider();

        _.slideTransition(direction, frame);
      }
    } else {
      _.pauseSlider();

      _.interval = setInterval($.proxy(_.slideTransition, _, direction), _.options.delay);
    }
  };

  Slider.prototype.slideTransition = function (direction, frame) {
    var _ = this;

    if (direction === 'left') {
      var slidePos = frame ? '-' + _.markup.slidewidth * (frame - 1) : '+=' + _.markup.slidewidth; // check if slider is on the first slide - if true, move to last slide

      if (_.options.initialslide === 1) {
        _.markup.$slider.css({
          'margin-left': '-' + (_.markup.$slides.length - 1) * _.markup.slidewidth + 'px'
        });

        _.options.initialslide = _.markup.$slides.length;
      }

      _.markup.$slider.animate({
        'margin-left': slidePos + 'px'
      }, _.options.speed, function () {
        if (frame) {
          _.options.initialslide = frame;
        } else {
          _.options.initialslide--;
        }

        _.updateDots(_.options.initialslide);

        if (_.options.autoplay === true) {
          _.startSlider();
        }
      });
    } else {
      var slidePos = frame ? '-' + _.markup.slidewidth * (frame - 1) : '-=' + _.markup.slidewidth; // check if slider is on the last slide - if true, move to beginning 

      if (_.options.initialslide === _.markup.$slides.length) {
        _.markup.$slider.css({
          'margin-left': 0
        });

        _.options.initialslide = 1;
      }

      _.markup.$slider.animate({
        'margin-left': slidePos + 'px'
      }, _.options.speed, function () {
        if (frame) {
          _.options.initialslide = frame;
        } else {
          _.options.initialslide++;
        }

        _.updateDots(_.options.initialslide);

        if (_.options.autoplay === true) {
          _.startSlider();
        }
      });
    }
  };

  Slider.prototype.updateDots = function (slideNumber) {
    var _ = this;

    if (slideNumber === _.markup.$slides.length) {
      var slideNumber = 1;
    }

    _.markup.$dotscontainer.children('li.active').removeClass('active');

    _.markup.$dotscontainer.find("[data-number='" + slideNumber + "']").addClass('active');
  };

  $.fn.slider = function (args) {
    this.slider = new Slider(this, args);
  };
})(jQuery);
},{}],"../../AppData/Roaming/npm/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "1911" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel/src/builtins/hmr-runtime.js","vendors/js/slider.js"], null)
//# sourceMappingURL=/slider.356e3a13.map