/* =====================
  スムーススクロール
===================== */
$(function() {
    $('a[href^="#"]').click(function() {
        var speed = 500;
        var href = $(this).attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        var position = target.offset().top;
        $("html, body").animate({
            scrollTop: position
        }, speed, "swing");
        return false;
    });
});
/* =====================
  固定フッター
===================== */
$(document).ready(function() {
    $("#topBtn").hide();
    $(window).on("scroll", function() {
        if ($(this).scrollTop() > 100) {
            $("#topBtn").fadeIn("fast");
        } else {
            $("#topBtn").fadeOut("fast");
        }
        scrollHeight = $(document).height();
        //ドキュメントの高さ 
        scrollPosition = $(window).height() + $(window).scrollTop();
        //現在地 
        footHeight = $("footer").innerHeight();
        //footerの高さ（＝止めたい位置）
        if (scrollHeight - scrollPosition <= footHeight) {
            //ドキュメントの高さと現在地の差がfooterの高さ以下になったら
            $("#topBtn").css({
                "position": "absolute",
                //pisitionをabsolute（親：wrapperからの絶対値）に変更
                "bottom": footHeight + 20 //下からfooterの高さ + 20px上げた位置に配置
            });
        } else {
            //それ以外の場合は
            $("#topBtn").css({
                "position": "fixed",
                //固定表示
                "bottom": "20px"//下から20px上げた位置に
            });
        }
    });

});
/* =====================
  フッターアコーディオン
===================== */
(function(window, $, undefined) {
    var $event = $.event, resizeTimeout;
    $event.special.smartresize = {
        setup: function() {
            $(this).bind("resize", $event.special.smartresize.handler);
        },
        teardown: function() {
            $(this).unbind("resize", $event.special.smartresize.handler);
        },
        handler: function(event, execAsap) {
            var context = this
              , args = arguments;
            event.type = "smartresize";
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(function() {
                jQuery.event.handle.apply(context, args);
            }, execAsap === "execAsap" ? 0 : 100);
        }
    };
    $.fn.smartresize = function(fn) {
        return fn ? this.bind("smartresize", fn) : this.trigger("smartresize", ["execAsap"]);
    }
    ;
    $.Accordion = function(options, element) {
        this.$el = $(element);
        this.$items = this.$el.children('ul').children('li');
        this.itemsCount = this.$items.length;
        this._init(options);
    }
    ;
    $.Accordion.defaults = {
        open: -1,
        oneOpenedItem: false,
        speed: 600,
        easing: 'easeInOutExpo',
        scrollSpeed: 900,
        scrollEasing: 'easeInOutExpo'
    };
    $.Accordion.prototype = {
        _init: function(options) {
            this.options = $.extend(true, {}, $.Accordion.defaults, options);
            this._validate();
            this.current = this.options.open;
            this.$items.find('div.footer-content').hide();
            this._saveDimValues();
            if (this.current != -1)
                this._toggleItem(this.$items.eq(this.current));
            this._initEvents();
        },
        _saveDimValues: function() {
            this.$items.each(function() {
                var $item = $(this);
                $item.data({
                    originalHeight: $item.find('a:first').height(),
                    offsetTop: $item.offset().top
                });
            });
        },
        _validate: function() {
            if (this.options.open < -1 || this.options.open > this.itemsCount - 1)
                this.options.open = -1;
        },
        _initEvents: function() {
            var instance = this;
            this.$items.find('a:first').bind('click.accordion', function(event) {
                var $item = $(this).parent();
                if (instance.options.oneOpenedItem && instance._isOpened() && instance.current !== $item.index()) {
                    instance._toggleItem(instance.$items.eq(instance.current));
                }
                instance._toggleItem($item);
                return false;
            });
            $(window).bind('smartresize.accordion', function(event) {
                instance._saveDimValues();
                instance.$el.find('li.footer-open').each(function() {
                    var $this = $(this);
                    $this.css('height', $this.data('originalHeight') + $this.find('div.footer-content').outerHeight(true));
                });
                if (instance._isOpened())
                    instance._scroll();
            });
        },
        _isOpened: function() {
            return (this.$el.find('li.footer-open').length > 0);
        },
        _toggleItem: function($item) {
            var $content = $item.find('div.footer-content');
            ($item.hasClass('footer-open')) ? (this.current = -1,
            $content.stop(true, true).fadeOut(this.options.speed),
            $item.removeClass('footer-open').stop().animate({
                height: $item.data('originalHeight')
            }, this.options.speed, this.options.easing)) : (this.current = $item.index(),
            $content.stop(true, true).fadeIn(this.options.speed),
            $item.addClass('footer-open').stop().animate({
                height: $item.data('originalHeight') + $content.outerHeight(true)
            }, this.options.speed, this.options.easing),
            this._scroll(this))
        },
        _scroll: function(instance) {
            var instance = instance || this, current;
            (instance.current !== -1) ? current = instance.current : current = instance.$el.find('li.footer-open:last').index();
            $('html, body').stop().animate({
                scrollTop: (instance.options.oneOpenedItem) ? instance.$items.eq(current).data('offsetTop') : instance.$items.eq(current).offset().top
            }, instance.options.scrollSpeed, instance.options.scrollEasing);
        }
    };
    var logError = function(message) {
        if (this.console) {
            console.error(message);
        }
    };
    $.fn.accordion = function(options) {
        if (typeof options === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var instance = $.data(this, 'accordion');
                if (!instance) {
                    logError("cannot call methods on accordion prior to initialization; " + "attempted to call method '" + options + "'");
                    return;
                }
                if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                    logError("no such method '" + options + "' for accordion instance");
                    return;
                }
                instance[options].apply(instance, args);
            });
        } else {
            this.each(function() {
                var instance = $.data(this, 'accordion');
                if (!instance) {
                    $.data(this, 'accordion', new $.Accordion(options,this));
                }
            });
        }
        return this;
    }
    ;
}
)(window, jQuery);

/* =====================
  easing.js(フッターアコーディオンに必要)
===================== */
!function(n) {
    "function" == typeof define && define.amd ? define(["jquery"], function(e) {
        return n(e)
    }) : "object" == typeof module && "object" == typeof module.exports ? exports = n(require("jquery")) : n(jQuery)
}(function(n) {
    function e(n) {
        var e = 7.5625
          , t = 2.75;
        return n < 1 / t ? e * n * n : n < 2 / t ? e * (n -= 1.5 / t) * n + .75 : n < 2.5 / t ? e * (n -= 2.25 / t) * n + .9375 : e * (n -= 2.625 / t) * n + .984375
    }
    n.easing.jswing = n.easing.swing;
    var t = Math.pow
      , u = Math.sqrt
      , r = Math.sin
      , i = Math.cos
      , a = Math.PI
      , c = 1.70158
      , o = 1.525 * c
      , s = 2 * a / 3
      , f = 2 * a / 4.5;
    n.extend(n.easing, {
        def: "easeOutQuad",
        swing: function(e) {
            return n.easing[n.easing.def](e)
        },
        easeInQuad: function(n) {
            return n * n
        },
        easeOutQuad: function(n) {
            return 1 - (1 - n) * (1 - n)
        },
        easeInOutQuad: function(n) {
            return n < .5 ? 2 * n * n : 1 - t(-2 * n + 2, 2) / 2
        },
        easeInCubic: function(n) {
            return n * n * n
        },
        easeOutCubic: function(n) {
            return 1 - t(1 - n, 3)
        },
        easeInOutCubic: function(n) {
            return n < .5 ? 4 * n * n * n : 1 - t(-2 * n + 2, 3) / 2
        },
        easeInQuart: function(n) {
            return n * n * n * n
        },
        easeOutQuart: function(n) {
            return 1 - t(1 - n, 4)
        },
        easeInOutQuart: function(n) {
            return n < .5 ? 8 * n * n * n * n : 1 - t(-2 * n + 2, 4) / 2
        },
        easeInQuint: function(n) {
            return n * n * n * n * n
        },
        easeOutQuint: function(n) {
            return 1 - t(1 - n, 5)
        },
        easeInOutQuint: function(n) {
            return n < .5 ? 16 * n * n * n * n * n : 1 - t(-2 * n + 2, 5) / 2
        },
        easeInSine: function(n) {
            return 1 - i(n * a / 2)
        },
        easeOutSine: function(n) {
            return r(n * a / 2)
        },
        easeInOutSine: function(n) {
            return -(i(a * n) - 1) / 2
        },
        easeInExpo: function(n) {
            return 0 === n ? 0 : t(2, 10 * n - 10)
        },
        easeOutExpo: function(n) {
            return 1 === n ? 1 : 1 - t(2, -10 * n)
        },
        easeInOutExpo: function(n) {
            return 0 === n ? 0 : 1 === n ? 1 : n < .5 ? t(2, 20 * n - 10) / 2 : (2 - t(2, -20 * n + 10)) / 2
        },
        easeInCirc: function(n) {
            return 1 - u(1 - t(n, 2))
        },
        easeOutCirc: function(n) {
            return u(1 - t(n - 1, 2))
        },
        easeInOutCirc: function(n) {
            return n < .5 ? (1 - u(1 - t(2 * n, 2))) / 2 : (u(1 - t(-2 * n + 2, 2)) + 1) / 2
        },
        easeInElastic: function(n) {
            return 0 === n ? 0 : 1 === n ? 1 : -t(2, 10 * n - 10) * r((10 * n - 10.75) * s)
        },
        easeOutElastic: function(n) {
            return 0 === n ? 0 : 1 === n ? 1 : t(2, -10 * n) * r((10 * n - .75) * s) + 1
        },
        easeInOutElastic: function(n) {
            return 0 === n ? 0 : 1 === n ? 1 : n < .5 ? -(t(2, 20 * n - 10) * r((20 * n - 11.125) * f)) / 2 : t(2, -20 * n + 10) * r((20 * n - 11.125) * f) / 2 + 1
        },
        easeInBack: function(n) {
            return (c + 1) * n * n * n - c * n * n
        },
        easeOutBack: function(n) {
            return 1 + (c + 1) * t(n - 1, 3) + c * t(n - 1, 2)
        },
        easeInOutBack: function(n) {
            return n < .5 ? t(2 * n, 2) * (7.189819 * n - o) / 2 : (t(2 * n - 2, 2) * ((o + 1) * (2 * n - 2) + o) + 2) / 2
        },
        easeInBounce: function(n) {
            return 1 - e(1 - n)
        },
        easeOutBounce: e,
        easeInOutBounce: function(n) {
            return n < .5 ? (1 - e(1 - 2 * n)) / 2 : (1 + e(2 * n - 1)) / 2
        }
    })
});
$(function() {
    $('#footer-accordion').accordion();
});