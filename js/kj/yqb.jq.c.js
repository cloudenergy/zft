/*/
/*
/* Rank: 1
/* Home site main intialization
/* Rely on jquery files
/*
/*/

// Native language prototype chain extensions
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};
String.prototype.attrRetrievalMode = function () {
    return"[" + this +"]";
};
String.prototype.keepDigital = function () {
    return this.replace(/\D/g,"");
};
String.prototype.keepDecimal = function () {
    var str;
    str = this.replace(/[^\d\.]*/g,"");
    var reg = /^\.\d+/g;
    var reg2 = /\./g;
    if (reg.test(str))
        return parseFloat(str.replace(/\./,"0."))
    return parseFloat(str);
};

// return random of from 0 to Number-1 
Number.prototype.GetRandom = function () {
    return Math.floor(Math.random() * this)
};

// Convert text to html
window.txt2html = function (txt) {
    var html, txt_list, _i, _len;
    txt_list = txt.split('\n');
    html = '';
    for (_i = 0, _len = txt_list.length; _i < _len; _i++)
        html +="<p>" + txt_list[_i] +"</p>";
    return html;
};


// 监测整个页面的click事件，如果事件源是数组中的值，那么将不会执行fn方法
(function () {
    var runFn = function (e, arr, fn) {
        var target = e.target;
        var end = false;
        for (var i in arr) {
            $(arr[i]).each(function () {
                if ($(this)[0] == target) {
                    end = true;
                    return false;
                }
            })
            if (end)
                return;
        }
        if (fn)
            fn();
    };

    $.documentClick = function (arr, fn) {
        var Browser = $.YQB.BROWSER;
        if (Browser.isAndorid || Browser.isiOS)
            $(document)[0].addEventListener('touchend', function (e) {
                runFn(e, arr, fn);
            }, false);
        else
            $("body").mousedown(function (e) {
                runFn(e, arr, fn);
            });
    };
}).call(this);

// YQB namespace
$.YQB = $.YQB || {};

$.YQB.Ajax = {
    weChat:{
        url:"/j/share/wechat/ticket"
    },
    callbackStates: {
        success: 0,
        failed: -1,
    },
    addCSRFToken2Header: function (csrf_token) {
        return function (request) {
            if (csrf_token)
                request.setRequestHeader("X-CSRFToken", csrf_token);
        }
    }
};

(function () {
    var weChat = $.YQB.weChat = $.YQB.weChat || {};
    weChat.weChatConf ="";
    weChat.regWeChatConf = function (X_CSRFToken, jsApiList,regSuccessCallback) {
        //if (!$.YQB.BROWSER.isWeChat) return 0;
        var weChatConf = weChat.weChatConf;
        var url = $.YQB.Ajax.weChat.url,
           _data = $.extend(true, {}, $.YQB.Ajax.weChat.baseData || {}),
            csrf_token = X_CSRFToken,
            dataType ="json";

        _data.url = location.href;
        $.ajax({
            type:"POST",
            dataType: dataType,
            url: url,
            data: _data,
            beforeSend: $.YQB.Ajax.addCSRFToken2Header(csrf_token),
            success: function (data) {
                if (parseInt(data.success)
                                  == $.YQB.Ajax.callbackStates.success) {
                    weChatConf = data.data;
                    weChatConf.debug = false;
                    weChatConf.jsApiList = jsApiList;
                    wx.config(weChatConf);

                    regSuccessCallback();
                }
                if (data.message)
                    $notification.notificationToggle(data.message);
            }
        });
    }
}).call(this);

// YQB data set
$.YQB.dataSet = $.YQB.dataSet || {};
(function () {
    var $dataSet = $.YQB.dataSet;

    var _matchFields = function (data1, data2) {
        //if (!(data1 && data2)) return false;
        for (var K in data1)
            data1[K] = data2[K] == 0 || data2[K] === false ? data2[K] :
                       data2[K] ? data2[K] :"";
            return data1;
    }

    $dataSet.Model = {
        user: {
            id:"",
            access_token:"",
            defaultpart:""
        },
        projectDetails:"",
        projectBasicInformation:""
    };
    $dataSet.operation = {
        setUser: function (userData) {
            $dataSet.Model.user = _matchFields($dataSet.Model.user, userData);
        }
    }
}).call(this);

(function () {
    var analysis_comid = function () {
        // Url format : http://12917928.tonghs.me/
        // Discard   // Url format : http://localhost:46051/html/investor/details/38201920/?xx=xxx
        var reg, href, matchStr, comid;
        // reg = /\/details\/(\d+)\//i;
        reg = /(\d+)\./;
        href = location.href;
        matchStr = href.match(reg);
        comid = matchStr ? matchStr[1] :"";
        return comid ||"";
    }

    $.YQB.url = {
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name +"=([^&]*)(&|$)","i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return"";
        },
        getSource: function () {
            return unescape(this.getQueryString("source"));
        },
        getComid: function () {
            return this.getQueryString("comid") ||"";
        },
        getUserId: function () {
            return this.getQueryString("userid") ||"";
        },
        getPageNum: function () {
            var num = parseInt(this.getQueryString("page"));
            return num > 0 ? num : 1;
        },
        getDetailsPageDomainURL: function () {
            var domain = location.host.match(/.+\.(.+\.[a-zA-Z0-9]+)/);
            return domain ? location.protocol+"//" + domain[0] :"";
        },
        addedSouceUrl: function (str) {
            return str + escape(location.href);
        },
        isTestMode: function () {
            if (this.getQueryString("test_mode"))
                return true;
            else return false;
        }
    }
}).call(this);

// Tools

$.YQB.regexStr = {
    phone: /^\d{11}$/,
    strict_validation_phone: /^0?(13[0-9]|15[012356789]|17[05678]|18[0-9]|14[57])[0-9]{8}$/,
    mail: /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/,
    qq: /^\d{5,10}$/,
    chinese_Unicode: /^[\u2E80-\u9FFF]+$/,
    chinese_Name: /^[\u2E80-\u9FFF]{2,5}$/
};

$.YQB.preventRepeatClick = function ($this, time) {
    if ($this.hasClass("js-wait"))
        return true;
    else {
        $this.addClass("js-wait");
        setTimeout((function ($this) {
            return function () {
                $this.removeClass("js-wait");
            }
        })($this), 600);
        return false;
    }
};

$.fn.keyCode_enter_bind = function (fn) {
    $(this).keydown(function (e) {
        var enter = 13;
        if (e.keyCode == enter) {
            if (typeof fn =="function")
                fn();
            $(this).blur();
        }
    })
    return $(this);
};

$.fn.input_text_autocomplete = function (turn_on) {
    if ($(this).attr("autocomplete")) return 0;
    var auto = turn_on ?"on" :"off";
    $(this).attr("autocomplete", auto);
};

// 使input元素只能输入数字
$.fn.justNumber = function (Decimal) {
    $(this).keydown(function (e) {
        var minNum = 48, maxNum = 57,
            del = 46, back = 8,
            tab = 9,
            home = 36, end = 35,
            min2 = 37, max2 = 40;
        var dec = 190;
        if ((e.keyCode >= minNum && e.keyCode <= maxNum) ||
            e.keyCode == del || e.keyCode == back ||
            e.keyCode == tab ||
            e.keyCode == home || e.keyCode == end ||
            (e.keyCode >= min2 && e.keyCode <= max2)) {
            return true;
        }
        if (Decimal)
            if (e.keyCode == dec) return true;

        return false;
    })
    return $(this);
};

$.fn.ReplacedVSHalfWidthSymbols = function (onlyText) {
    var htm = $(this).html().replace(/，/g,",").replace(/：/g,":").replace(/；/g,";");
    $(this).html(htm);
};

(function () {
    var ua = navigator.userAgent.toLowerCase();
    $.YQB.BROWSER = {
        isAndorid: ua.indexOf("android") != -1 ? 1 : 0,
        isiOS: !!ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/),
        isiPhone: ua.indexOf('iphone') > -1 || ua.indexOf('mac') > -1,
        isiPad: ua.indexOf('ipad') > -1,

        isWeChat: ua.indexOf("micromessenger") != -1 ? 1 : 0
    };
}).call(this);

/********************
       Utilities
 ********************/

// Utilities for YQB
$.YQB.Utilities = $.YQB.Utilities || {};

$.YQB.Utilities.back2top = function () {
    $(".st-top").click(function () {
        $(document).scrollTop(0);
    })
};

$.YQB.Utilities.hidden2Visible = function () {
    $(".hidden2Visible").removeClass("hidden2Visible");
};

$.YQB.Utilities.changeTitleTxt = function (str) {
    if (str) $("head title").text(str);
};

$.YQB.Utilities.dialogueConfirm = function () {
    $("[data-confirm-dialogue]").click(function () {
        if (confirm($(this).attr("data-confirm-dialogue"))) {
            $(this).attr("data-confirm-donot-redirect","");
            return true;
        } else
            $(this).attr("data-confirm-donot-redirect", true);
        return false;
    });
};

// Modules

/**********************
      Slider module
  **********************/
;(function () {
    var className = {
        container:".slider-container",
        list:".slider-container > ul",
    };
    var defaultConfig = {
        toRight: false,
        ignoreImg: false,
        rightSpaceWidth: 60
    }

    var _imgManipulation = function ($img, options) {
        var $container = $img.closest(className.container);
        $img[0].onload = function () {
            $img.parents(className.container).calculateSliderModuleWidth(options);
        };
    };
    var _calculationLogic = function (options) {
        var toRight, varible,
            measure, globeWidth, ignoreImg,
            config;
        var $image;
        config = options || defaultConfig;
        toRight = config.toRight || defaultConfig.toRight,
        ignoreImg = config.ignoreImg || defaultConfig.ignoreImg,
        varible = config.rightSpaceWidth != undefined ?
                  config.rightSpaceWidth : defaultConfig.rightSpaceWidth,
        measure = varible,
        globeWidth = $(".details").width();
        $(this).find("li").each(function () {
            $image = $(this).find("img");
            if ($image.length && $image.attr("src") && !ignoreImg) {
                _imgManipulation($image, options);
            };
            measure += $(this).outerWidth(true);
        });

        //if (measure > globeWidth) {
            $(this).width(measure);
            if (toRight) $(this).parent().scrollLeft(measure);
        //}
    };
    // Group Method
    // Slider module overflow initial
    $.YQB.calculateSliderModuleWidth = function (options) {
        $(className.list).each(function () {
            _calculationLogic.call(options);
        });
    };
    // Single Method
    // Slider module overflow initial
    $.fn.calculateSliderModuleWidth = function (options) {
        $(this).find("ul").each(function () {
            _calculationLogic.call(this, options)
        });
    };
}).call(this);

$.YQB.notificationInit = function () {
    var className = {
        bar:".notification"
    }
    var $bar, $close;
    $bar = $(className.bar);
    $close = $bar.find(".close");
    $close.click(function () {
        $(this).closest(className.bar).fadeOut(240);
    });
};

(function () {
    var timeHandle=0;
    $.fn.notificationToggle = function (txt) {
        clearTimeout(timeHandle);
        if (txt)
            $(this).find(".txt").text(txt);
        $(".notification").hide();
        $(this).stop(true).slideDown(240);
        timeHandle = setTimeout((function ($that) {
            return function () {
                $that.fadeOut(240);
            };
        }).call(this, $(this)), 4800);
        return $(this);
    };
}).call(this);

(function () {
    $.YQB.headerMenu = function () {
        var $options = $(".head .options"),
            $menu = $options.find(".hidden-menu");
        var _time = 220;

        if (!$menu.length) return 0;
        $options.click(function () {
            if (!$menu.is(":visible"))
                $menu.show();
            else
                $menu.stop(true).slideUp(_time);
        });

        var arr = [
           ".head .options",
           ".head .options span",
           ".head .options .hidden-menu",
           ".head .options .hidden-menu li"
        ];

        $.documentClick(arr, function () {
            $menu.stop(true).slideUp(_time);
        });
    };
}).call(this);

(function () {
    var ele_handle = function () {
        var href = $(this).attr("data-href"),
                test_mode_href = $(this).attr("data-test-mode-href"),
                isRedirect = $(this).attr("data-confirm-donot-redirect"),
                _target = $(this).attr("data-target");
        if (!href || isRedirect) return 0;
        if (test_mode_href) href = test_mode_href;
        if (_target =="_blank") window.open(href);
        else location.href = href;
    };

    $.fn.linkBtnInit = function () {
        ele_handle.call(this);
    };

    $.YQB.linkBtnInit = function () {
        $("[data-href]").click(function () {
            ele_handle.call(this);
        });
    };
}).call(this);

$.YQB.wechatImg = function () {
    $("body").append('<div id="wx_pic"><img src="/static/images/wapsite/231937129837912.png" /></div>');
};

// Main Initialize
$(function () {
    $.YQB.notificationInit();
    $.YQB.linkBtnInit();
    //$.YQB.wechatImg();

    $("input").input_text_autocomplete();
})