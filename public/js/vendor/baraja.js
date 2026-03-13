/**
 *  BarajaJS
 *  A plugin for spreading items in a card-like fashion.
 *
 *  Copyright 2019-2025, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

/**
 * @param {HTMLElement} container
 *   Containing HTML element.
 *
 * @param {Object} options
 *   Configuration overrides (optional).
 */
function Baraja(container, options) {
  if (options === void 0) {
    options = {};
  }
  var self = this;
  var defaults = {
    easing: 'ease-in-out',
    speed: 300
  };
  (function () {
    self.options = Object.assign(defaults, options);
    setDefaultFanSettings();
    self.items = getItemsAsArray();
    self.itemTotal = self.items.length;
    if (self.itemTotal > 1) {
      self.isClosed = true;
      self.zIndexMin = 1000;
      setStack();
      initClickEvents();
    } else {
      throw new Error('Failed to initialize (no items found)');
    }
  })();
  function setDefaultFanSettings() {
    self.fanSettings = {
      easing: 'ease-out',
      direction: 'right',
      origin: {
        x: 25,
        y: 100
      },
      speed: 500,
      range: 90,
      translation: 0,
      center: true,
      scatter: false
    };
  }

  /**
   * Validate default fan settings.
   *
   * @param {Object} settings
   *   Fan settings (optional).
   */
  function validateDefaultFanSettings(settings) {
    settings.direction = settings.direction || self.fanSettings.direction;
    settings.easing = settings.easing || self.fanSettings.easing;
    settings.speed = settings.speed || self.fanSettings.speed;
    settings.range = settings.range || self.fanSettings.range;
    settings.translation = settings.translation || self.fanSettings.translation;
    if (!settings.origin) {
      settings.origin = self.fanSettings.origin;
    } else {
      settings.origin.x = settings.origin.x || self.fanSettings.origin.x;
      settings.origin.y = settings.origin.y || self.fanSettings.origin.y;
    }
    if (!settings.center) {
      settings.center = self.fanSettings.center;
    }
    if (!settings.scatter) {
      settings.scatter = self.fanSettings.scatter;
    }
    self.direction = settings.direction;
    return settings;
  }

  /**
   * Set the zIndex for the given items.
   *
   * @param {Array} items.
   *   Array of HTML elements (optional).
   */
  function setStack(items) {
    if (items === void 0) {
      items = self.items;
    }
    items.forEach(function (item, index) {
      item.style.zIndex = (self.zIndexMin + self.itemTotal - 1 - index).toString();
    });
  }

  /**
   * Update the zIndex for the given element.
   *
   * @param {HTMLElement} element
   *   HTML element.
   *
   * @param {String} direction
   *   Stack direction (last|next).
   */
  function updateStack(element, direction) {
    var stepNext = direction === 'next';
    var zIndexCurr = parseInt(element.style.zIndex);
    element.style.zIndex = stepNext ? self.zIndexMin - 1 : self.zIndexMin + self.itemTotal;
    self.items.forEach(function (item) {
      var zIndex = parseInt(item.style.zIndex);
      var update = stepNext ? zIndex < zIndexCurr : zIndex > zIndexCurr;
      if (update) {
        item.style.zIndex = stepNext ? zIndex + 1 : zIndex - 1;
      }
    });
  }

  /**
   * Initialize element click event handlers.
   *
   * @param {Array} items
   *   Array of HTML elements (optional).
   */
  function initClickEvents(items) {
    if (items === void 0) {
      items = self.items;
    }
    items.forEach(function (item) {
      var eventHandler = function eventHandler() {
        if (!self.isAnimating) {
          move2front(item);
        }
      };
      item.addEventListener('click', eventHandler, true);
    });
  }

  /**
   * Disable the CSS transition for a given element.
   *
   * @param {HTMLElement} element
   *   HTML element.
   */
  function resetTransition(element) {
    element.style.transition = 'none';
  }

  /**
   * Set the CSS transform-origin for a given element.
   *
   * @param {HTMLElement} element
   *   HTML element.
   *
   * @param {Number} x
   *   Horizontal axis.
   *
   * @param {Number} y
   *   Vertical axis.
   */
  function setOrigin(element, x, y) {
    element.style.transformOrigin = x + "% " + y + "%";
  }

  /**
   * Set the CSS transition for a given element.
   *
   * @param {HTMLElement} element
   *   HTML element.
   *
   * @param {String} property
   *   Property (optional).
   *
   * @param {String} duration
   *   Duration (optional).
   *
   * @param {String} timingFunc
   *   Timing-function (optional).
   *
   * @param {Number} delay
   *   Delay (optional).
   */
  function setTransition(element, property, duration, timingFunc, delay) {
    if (property === void 0) {
      property = 'all';
    }
    if (duration === void 0) {
      duration = self.options.speed;
    }
    if (timingFunc === void 0) {
      timingFunc = self.options.easing;
    }
    if (delay === void 0) {
      delay = 0;
    }
    var animation = duration + "ms " + timingFunc + " " + delay + "ms";
    element.style.transition = property === 'transform' ? "transform " + animation : property + " " + animation;
  }

  /**
   * Apply the CSS transform for a given element.
   *
   * @param {HTMLElement} element
   *   HTML element.
   *
   * @param {String} easing
   *   Transform-function.
   *
   * @param {Function} eventHandler
   *   Listener event handler.
   *
   * @param {Boolean} force
   *   Force listener event (optional).
   */
  function applyTransition(element, easing, eventHandler, force) {
    if (force === void 0) {
      force = false;
    }
    if (eventHandler) {
      element.addEventListener('transitionend', eventHandler, false);
      if (force) {
        eventHandler.call();
      }
    }
    setTimeoutFrame(function () {
      if (easing === 'none') {
        element.style.opacity = '1';
      }
      element.style.transform = easing;
    }, 25);
  }

  /**
   * Relocate the element on top of the stack.
   *
   * @param {HTMLElement} element
   *   HTML element.
   */
  function move2front(element) {
    self.isAnimating = true;
    var zIndexCurr = parseInt(element.style.zIndex);
    var isTop = zIndexCurr === self.zIndexMin + self.itemTotal - 1;
    var callback = isTop ? function () {
      self.isAnimating = false;
    } : function () {
      return false;
    };
    element = isTop ? null : element;
    if (!self.isClosed) {
      close(callback, element);
    } else {
      fan();
    }
    if (isTop) {
      return;
    }
    resetTransition(element);
    setOrigin(element, 50, 50);
    element.style.opacity = '0';
    element.style.transform = 'scale(2) translate(100px) rotate(20deg)';
    updateStack(element, 'last');
    setTimeoutFrame(function () {
      setTransition(element, 'all', self.options.speed, 'ease-in');
      var cssTransform = 'none';
      var _eventHandler = function eventHandler() {
        element.removeEventListener('transitionend', _eventHandler);
        self.isAnimating = false;
      };
      applyTransition(element, cssTransform, _eventHandler);
    }, self.options.speed / 2);
  }

  /**
   * Add items to the HTMLElement container.
   *
   * @param {String} html
   *   HTML elements as text.
   */
  function add(html) {
    container.insertAdjacentHTML('beforeend', html);
    var oldItemTotal = self.itemTotal;
    var currItems = getItemsAsArray();
    self.items = currItems.slice();
    self.itemTotal = currItems.length;
    var newItemCount = Math.abs(self.itemTotal - oldItemTotal);
    var newItems = currItems.splice(oldItemTotal, newItemCount);
    newItems.forEach(function (item) {
      item.style.opacity = '0';
    });
    initClickEvents(newItems);
    setStack(newItems);
    newItems = newItems.reverse();
    var count = 0;
    newItems.forEach(function (item, index) {
      item.style.transform = 'scale(1.8) translate(200px) rotate(15deg)';
      setTransition(item, 'all', '500', 'ease-out', index * 200);
      var cssTransform = 'none';
      var _eventHandler2 = function eventHandler() {
        ++count;
        item.removeEventListener('transitionend', _eventHandler2);
        resetTransition(item);
        if (count === newItemCount) {
          self.isAnimating = false;
        }
      };
      applyTransition(item, cssTransform, _eventHandler2);
    });
  }

  /**
   * Close the spread fan.
   *
   * @param {Function} callback
   *   Callback function (optional).
   *
   * @param {HTMLElement} element
   *   HTML element (optional).
   */
  function close(callback, element) {
    if (callback === void 0) {
      callback = null;
    }
    if (element === void 0) {
      element = null;
    }
    var items = self.items;
    if (element) {
      items = items.filter(function (item) {
        return item !== element;
      });
    }
    var force = self.isClosed;
    var cssTransform = 'none';
    items.forEach(function (item) {
      var _eventHandler3 = function eventHandler() {
        self.isClosed = true;
        item.removeEventListener('transitionend', _eventHandler3);
        resetTransition(item);
        setTimeoutFrame(function () {
          setOrigin(item, 50, 50);
          if (callback) {
            callback.call();
          }
        }, 25);
      };
      applyTransition(item, cssTransform, _eventHandler3, force);
    });
  }

  /**
   * Spread the stack based on defined settings.
   *
   * @param {Object} settings
   *   Fan settings (optional).
   */
  function fan(settings) {
    if (settings === void 0) {
      settings = {};
    }
    self.isClosed = false;
    settings = validateDefaultFanSettings(settings);
    var stepLeft = settings.direction === 'left';
    if (settings.origin.minX && settings.origin.maxX) {
      var max = settings.origin.maxX;
      var min = settings.origin.minX;
      var stepOrigin = (max - min) / self.itemTotal;
      self.items.forEach(function (item) {
        var zIndexCurr = parseInt(item.style.zIndex);
        var pos = self.itemTotal - 1 - (zIndexCurr - self.zIndexMin);
        var originX = pos * (max - min + stepOrigin) / self.itemTotal + min;
        if (stepLeft) {
          originX = max + min - originX;
        }
        setOrigin(item, originX, settings.origin.y);
      });
    } else {
      self.items.forEach(function (item) {
        setOrigin(item, settings.origin.x, settings.origin.y);
      });
    }
    var stepAngle = settings.range / (self.itemTotal - 1);
    var stepTranslation = settings.translation / (self.itemTotal - 1);
    var count = 0;
    self.items.forEach(function (item) {
      setTransition(item, 'transform');
      var zIndexCurr = parseInt(item.style.zIndex);
      var pos = self.itemTotal - 1 - (zIndexCurr - self.zIndexMin);
      var val = settings.center ? settings.range / 2 : settings.range;
      var angle = val - stepAngle * pos;
      var position = stepTranslation * (self.itemTotal - pos - 1);
      if (stepLeft) {
        angle *= -1;
        position *= -1;
      }
      if (settings.scatter) {
        var extraAngle = Math.floor(Math.random() * stepAngle);
        var extraPosition = Math.floor(Math.random() * stepTranslation);
        if (pos !== self.itemTotal - 1) {
          if (stepLeft) {
            angle = angle + extraAngle;
            position = position - extraPosition;
          } else {
            angle = angle - extraAngle;
            position = position + extraPosition;
          }
        }
      }
      var cssTransform = "translate(" + position + "px) rotate(" + angle + "deg)";
      var _eventHandler4 = function eventHandler() {
        ++count;
        item.removeEventListener('transitionend', _eventHandler4);
        if (count === self.itemTotal - 1) {
          self.isAnimating = false;
        }
      };
      applyTransition(item, cssTransform, _eventHandler4);
    });
  }

  /**
   * Show the last/next item in the stack.
   *
   * @param {String} direction
   *   Stack direction (last|next).
   */
  function navigate(direction) {
    self.isClosed = false;
    var stepNext = direction === 'next';
    var zIndexCurr = stepNext ? self.zIndexMin + self.itemTotal - 1 : self.zIndexMin;
    var element = self.items.find(function (item) {
      return parseInt(item.style.zIndex) === zIndexCurr;
    });
    var rotation, translation;
    if (stepNext) {
      rotation = 5;
      translation = element.offsetWidth + 15;
    } else {
      rotation = 5 * -1;
      translation = element.offsetWidth * -1 - 15;
    }
    setTransition(element, 'transform');
    var cssTransform = "translate(" + translation + "px) rotate(" + rotation + "deg)";
    var _eventHandler6 = function _eventHandler5() {
      element.removeEventListener('transitionend', _eventHandler6);
      updateStack(element, direction);
      cssTransform = 'translate(0px) rotate(0deg)';
      _eventHandler6 = function eventHandler() {
        element.removeEventListener('transitionend', _eventHandler6);
        self.isAnimating = false;
        self.isClosed = true;
      };
      applyTransition(element, cssTransform, _eventHandler6);
    };
    applyTransition(element, cssTransform, _eventHandler6);
  }

  /**
   * Dispatch the fan spread action.
   *
   * @param {Function} func
   *   Function to execute.
   *
   * @param {*} args
   *   Function arguments.
   */
  function dispatch(func, args) {
    if (self.itemTotal > 1 || !self.isAnimating) {
      self.isAnimating = true;
      if (!self.isClosed) {
        close(function () {
          func.call(self, args);
        });
      } else {
        func.call(self, args);
      }
    }
  }

  /**
   * setTimeout alternative for handling animations.
   *
   * @param {Function} handler
   *   Animation handler.
   *
   * @param {Number} timeout
   *   Timeout in milliseconds (optional).
   */
  function setTimeoutFrame(handler, timeout) {
    if (timeout === void 0) {
      timeout = 5000;
    }
    var start = 0;
    var _step = function step(timestamp) {
      if (!start) {
        start = timestamp;
      }
      var progress = timestamp - start;
      if (progress < timeout) {
        window.requestAnimationFrame(_step);
      } else {
        handler();
      }
    };
    window.requestAnimationFrame(_step);
  }

  /**
   * Return HTMLElement container items as array.
   *
   * @return {Array}
   */
  function getItemsAsArray() {
    var elements = container.querySelectorAll('li');
    if (elements) {
      return Array.prototype.slice.call(elements);
    }
  }

  /**
   * Protected members.
   */
  self.add = function (html) {
    if (!this.isAnimating) {
      dispatch(add, html);
    }
  };
  self.fan = function (settings) {
    if (!this.isAnimating) {
      dispatch(fan, settings);
    }
  };

  // Deprecated previous() method (use last)
  self.last = self.previous = function () {
    if (!this.isAnimating) {
      dispatch(navigate, 'last');
    }
  };
  self.next = function () {
    if (!this.isAnimating) {
      dispatch(navigate, 'next');
    }
  };
  self.close = function () {
    if (!this.isAnimating) {
      close();
    }
  };
  return self;
}

/**
 * Set global/exportable instance, where supported.
 */
window.baraja = function (container, options) {
  return new Baraja(container, options);
};
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Baraja;
}
//# sourceMappingURL=baraja.js.map