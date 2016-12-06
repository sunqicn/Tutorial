(function(w) {

    var init,
        document = w.document;

    //核心函数
    var moyas = function(selector) {
        return new moyas.fn.init(selector);
    };

    //核心原型
    moyas.fn = moyas.prototype = {
        constructor: moyas,
        length: 0,
        get: function(index) {
            index = index - 0;
            index = index < 0 ? index + this.length : index;
            return this[index];
        },
        eq: function(index) {
            return moyas(this.get(index));
        },
        first: function() {
            return this.eq(0);
        },
        last: function() {
            return this.eq(-1);
        }
    };

    //构建函数
    init = moyas.fn.init = function(selector) {
        //            + selector类型：
        //		- 无效值： null undefined '' false
        //            - 字符串
        //            * 选择器：	 'div' 根据选择器筛选dom元素，并以伪数组形式 存储在this上
        //            * html字符串 '<p>123</p><p>456</p>' '<p>' 将html字符串 转换成 html元素
        //            - DOM节点
        //            - DOM数组（伪数组）
        //		- function：入口函数 DOMContentLoaded
        //            * 使用静态属性isReady 存储 dom树是否加载完毕
        //            * 判断isReady值， 如果为true，就直接执行传入的函数。
        //			* 否则，就给document的DOMContentLoaded事件绑定处理
        //            程序，在处理程序中，先将isReady赋值为true，在执行传入的函数。

        //handle : null undefined ""  false
        if (!selector) return this;

        //handle : string
        else if (moyas.isString(selector)) {
            if (moyas.isHTML(selector)) {
                Array.prototype.push.apply(this, moyas.paseHTML(selector));
            }

            //handle : selector
            else {
                //根据选择器 获取dom
                var nodeList = document.querySelectorAll(selector);

                var ret = Array.prototype.slice.call(nodeList);
                Array.prototype.push.apply(this, ret);
            }
        }

        //handle :dom node
        else if (moyas.isDOM(selector)) {
            this[0] = selector;
            this.length = 1;
        }

        //handle :Array 为数组对象
        else if (moyas.isArrayLike(selector)) {
            // 获取selector类型
            var _type = Object.prototype.toString.call(selector).slice(8, -1).toLowerCase();
            // 如果不是数组类型,就 将其转换 为 真数组类型
            if (_type !== 'array')
                selector = Array.prototype.slice.call(selector);
            Array.prototype.push.apply(this, selector);
        }

        //handle :function
        else if (moyas.isFunction(selector)) {
            if (moyas.isReady) {
                selector();
            } else {
                document.addEventListener('DOMContentLoaded', function() {
                    selector();
                    moyas.isReady = true;
                });
            }
        }
    };

    //实现init 继承自 moyas.prototype
    init.prototype = moyas.fn;

    //可宽展方法
    moyas.extend = moyas.fn.extend = function(source, target) {
        target = target || this;
        for (var k in source) {
            target[k] = source[k];
        }
    }

    //添加工具类方法
    moyas.extend({
        isReady: false,
        paseHTML: function(html) {
            var div = document.createElement("div"),
                ret = [];
            div.innerHTML = html;
            for (var elem = div.firstChild; elem; elem = elem.nextSibling) {
                if (elem.nodeType === 1) ret.push(elem);
            }
            return ret;
        },
        each: function(obj, callback) {
            var i = 0,
                l = obj.length;
            //遍历数组元素
            for (; i < l; i++) {
                if (callback.call(obj[i], obj[i], i) === false) break;
            }
        }
    });

    //类型判断方法
    moyas.extend({
        isString: function(obj) {
            return !!obj && typeof obj === "string";
        },
        isHTML: function(obj) {

            //String.charAt(n)
            //返回字符串的第n 个字符, 如果字符n 没在字符长度之内,则返回空的字符串
            return !!obj && obj.charAt(0) === "<" &&
                obj.charAt(obj.length - 1) === ">" &&
                obj.length > 3
        },
        isDOM: function(obj) {
            return !!obj && !!obj.nodeType;
        },
        isFunction: function(obj) {
            return !!obj && typeof obj === "function";
        },
        isGlobal: function(obj) {
            return !!obj && !!obj.window === obj;
        },
        //判断是不是为数组
        isArrayLike: function(obj) {
            var _type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase(),
                length = !!obj && "length" in obj && obj.length;
            //过滤windows 对象 和函数对象
            if (moyas.isFunction(obj) || moyas.isGlobal(obj)) return false;

            return _type === "array" || length === 0 || typeof length === "number" &&
                length > 0 && (length - 1) in obj;
        }
    });

    //css样式模块
    moyas.fn.extend({
        //提供给对象调用
        //遍历this
        each: function(callback) {
            moyas.each(this, callback);
            return this;
        }
    })
    moyas.fn.extend({
        //检测类名方法
        hasClass: function(className) {
            var ret = false;
            for (var i = 0, l = this.length; i < l; i++) {
                if (("" + this[i].className + "").indexOf("" + className + "") !== -1) {
                    ret = true;
                    break;
                }
            }
            return ret;
        },
        //设置和获取css 样式
        css: function(name, value) {
            //如果只传入一个参数  就是 获取
            if (value == undefined) {
                //如果name的类型为对象,同时设置多个属性
                if (typeof name === "object") {
                    //遍历this上的每一个dom元素
                    this.each(function(v) {
                        for (var k in name) {

                            //给当前遍历到的dom元素设置样式
                            v.style[k] = name[k];
                        }
                    });
                } else {
                    //如果name 不为对象
                    //默认获取this上的第一个dom元素指定样式值
                    //如果浏览器支持 getConputedStyle  使用该方法获取指定的样式值

                    //如果this上没有任何的dom元素  就返回 null
                    if (!this[0]) return null;
                    return global.getComputedStyle ? global.getComputedStyle(this[0])[name] :
                        this[0].currentStyle[name];
                }
            } else {
                //如果传入两个参数
                this.each(function(v) {
                    v.style[name] = value;
                });
            }
            return this;
        },
        addClass: function(className) {
            return this.each(function(v) {
                if (!moyas(v).hasClass(className)) {
                    v.className += " " + className;
                }
            });
        },
        removeClass: function(className) {
            return this.each(function(v) {

                v.className = (' ' + v.className + ' ').replace(' ' + className + ' ', ' ');
            });
        },
        toggleClass: function(className) {
            return this.each(function(v) {
                var $v = moyas(v);
                if ($v.hasClass(className)) {
                    $v.removeClass(className);
                } else {
                    $v.addClass(className);
                }
            });
        }
    });

    //属性模块

    moyas.propFix = {
        'for': 'htmlFor',
        'class': 'className'
    };
    moyas.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
    ], function() {
        moyas.propFix[this.toLowerCase()] = this;
    });
    moyas.fn.extend({
        attr: function(name, value) {
            //如果是两个值  设置
            //如果是一个值  先判断 是不是 对象 是 设置  不是 获取
            if (value === undefined) {
                if (typeof name === "object") {
                    this.each(function(v) {
                        for (var k in name) {
                            v.setAttribute(k, name[k]);
                        }
                    })
                } else {
                    if (!this[0]) return null;
                    return this[0].getAttribute(name);
                }
            } else {
                //传入两个参数
                this.each(function(v) {
                    v.setAttribute(name, value);
                })
            }
            //实现链式编程
            return this;
        },

        //参数表示 有过传参 表示设置, 如果不传参 表示 获取
        html: function(html) {
            if (html == undefined) {
                return this[0] ? this[0].innerHTML : '';
            } else {
                //表示设置
                return this.each(function(v) {
                    v.innerHTML = html;
                })
            }
        },
        text: function(text) {
            //如果没传参  表示获取文本值
            if (text == undefined) {
                var ret = '';
                this.each(function(v) {
                    //如果支持textContent  使其获取文本 添加到ret 上
                    ret += "textContent" in document ? v.textContent : v.innerText.replace(/\r\n/g, '');
                });
                //返回所有文本
                return ret;
            } else {

                //如果穿入值 表示为每个dom 设置文本
                return this.each(function(v) {
                    //如果支持  就用textcontent为当前dom元素设置文本节点
                    //否则 使用 innerHTML设置文本节点值
                    if ('textContent' in document) {
                        v.textContent = text;
                    } else {
                        v.innerHTML = text;
                    }
                })
            }
        },
        val: function(value) {
            //如果没有值 获取第一个dom元素的value值
            //如果dom 上没有任何的元素  则返回的是空
            if (value == undefined) {
                return this[0] ? this[0].value : '';
            } else {
                return this.each(function() {
                    this.value = value;
                })
            }
        },
        prop: function(name, value) {
            //如果没给value 传值
            var prop;
            if (value == undefined) {
                //并且name 的类型为对象  表示给每一个dom 对象添加多个属性
                if (typeof name === "object") {
                    this.each(function() {
                        for (var k in name) {
                            //判断 如果是驼峰 返回小写,如果全小写 返回k
                            prop = moyas.propFix[k] ? moyas.propFix[k] : k;
                            this[prop] = name[k];
                        }
                    })
                } else {
                    prop = moyas.propFix[name] ? moyas.propFix[name] : name;
                    return this.length > 0 ? this[0][prop] : null;
                }
            } else {
                //如果传入的是两个参数,表示给每一个dom 对象添加单个属性
                //遍历moyas上的每一个dom 添加属性
                prop = moyas.propFix[name] ? moyas.propFix[name] : name;
                this.each(function() {
                    this[prop] = value;
                });
            }
            //实现链式编程
            return this;
        }

    });

    //dom操作模块
    moyas.extend({ //是一个工具方法，可以直接moyas。 调用  用户也可以调用。放在函数中
        unique: function(arr) {
            //储存去重的结果
            var ret = [];
            //遍历原数组
            moyas.each(arr, function() {
                //判断ret是否存在当前遍历到的元素
                //如果不存在 添加到ret 中
                if (ret.indexOf(this) === -1) ret.push(this);
            });
            return ret;
        }
    })
    moyas.fn.extend({
        appendTo: function(target) {
            var node,
                ret = [];
            target = moyas(target);
            //遍历this上的每一个dom元素
            this.each(function(v) {
                target.each(function(t, i) {
                    node = i === 0 ? v : v.cloneNode(true);
                    ret.push(node);
                    t.appendChild(node);
                });
            });
            //将每一个添加的dom元素.转换成对象返回, 实现链式编程
            //原因 在添加样式的时候 只会给没有克隆的节点添加样式
            return moyas(ret);
        },
        append: function(source) {
            source = moyas(source);
            source.appendTo(this);
            return this;
        },
        prependTo: function(target) {
            var node,
                firstChild,
                self = this,
                ret = [];
            target = moyas(target);
            //遍历target上的每一个目标dom 元素
            target.each(function(elem, i) {
                //缓存当前dom元素的第一个节点
                firstChild = elem.firstChild;
                //再遍历dom上的每一个dom 元素
                self.each(function(dom) {
                    node = i === 0 ? dom : dom.cloneNode(true);
                    //将上面的节点添加到ret中
                    ret.push(node);
                    //使用insertBefore给当前目标元素,在firstChild添加node 节点
                    elem.insertBefore(node, firstChild)
                })

            })
            return moyas(ret);
        },
        prepend: function(source) {
            source = moyas(source);
            source.prependTo(this);
            return this;
        },
        next: function() {
            //储存所用dom的下一个兄弟节点
            var ret = [];
            //遍历this上的所有dom 元素
            this.each(function() {
                //遍历当前dom元素下的所用兄弟元素
                for (var node = this.nextSibling; node; node = node.nextSibling) {
                    //如果当前兄弟节点为元素节点
                    //即为结果,将其添加到ret内 并结束循环

                    if (node.nodeType === 1) {
                        ret.push(node);
                        break;
                    }
                }
            });
            //将ret转换成对象 返回
            return moyas(ret);
        },
        nextAll: function() {
            var ret = [],
                node;
            this.each(function() {
                for (node = this.nextSibling; node; node = node.nextSibling) {
                    if (node.nodeType === 1) ret.push(node);
                }

            });
            return moyas(moyas.unique(ret));
        },
        before: function(source) {
            var node;
            source = moyas(source);
            this.each(function(dom, i) {
                source.each(function(elem) {
                    node = i === 0 ? elem : elem.cloneNode(true);
                    //获取dom的父节点 调用inserBefore方法在dom前面添加新的子节点node
                    dom.parentNode.insertBefore(node, dom);
                });
            });
            return this;
        },
        after: function(source) {
            var node,
                nextSibling;
            source = moyas(source);
            this.each(function(dom, i) {
                nextSibling = dom.nextSibling;
                source.each(function(elem) {
                    node = i === 0 ? elem : elem.cloneNode(true);
                    //获取dom的父节点.调用insetBefore方法在dom前添加新的子节点
                    dom.parentNode.insertBefore(node, nextSibling);
                });
            });
            return this;
        },

        remove: function() {
            return this.each(function() {
                this.parentNode.removeChild(this);
            });
        },

        prev: function() {
            var ret = [],
                node;

            this.each(function() {
                for (node = this.previousSibling; node; node = node.previousSibling) {
                    if (node.nodeType === 1) {
                        ret.push(node);
                        break;
                    }
                }
            });
            return moyas(ret);
        },

        prevAll: function() {
            var ret = [],
                node;
            this.each(function() {
                for (node = this.previousSibling; node; node = node.previousSibling) {
                    if (node.nodeType === 1) {
                        ret.push(node);
                    }
                }
            });

            return moyas(moyas.unique(ret));
        },

        empty: function() {
            return this.each(function() {
                this.innerHTML = '';
            })
        }
    });
    //兼容数组对象的indexOf方法
    (function() {
        //如果浏览器不支持indexOf方法
        //那么就给数组对象的原型添加indexOf方法
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function(val) {
                //遍历this
                for (var i = 0, l = this.length; i < l; i++) {
                    //如果遍历到当前元素和val相同 返回其索引值
                    if (this[i] == val) return i;
                }
                //表示具有指定的val 元素 返回 -1
                return -1;
            };
        }
    }());


    //事件模块
    //检测浏览器
    //提前返回
    var addEvent = function() {
        if (w.addEventListener) {
            return function(elem, type, callback, useCapture) {
                elem.addEventListener(type, callback, useCapture || false);
            };
        } else {
            return function(elem, type, callback) {
                elem.attachEvent("on" + type, callback);
            };
        }
    }();


    //addEventListenter 中的this 指向 事件的触发者
    //attachEvlent 中的this 指向 window 对象

    var removeEvent = function() {
        if (w.removeEventListener) {
            return function(elem, type, callback) {
                elem.removeEvent(type, callback);
            };
        } else {
            return function(elem, type, callback) {
                elem.detachEvent("on" + type, callback)
            };
        }
    }();

    //点击事件

    moyas.fn.extend({
        //事件添加的一般过程
        // click:function (callback,capture) {
        //     this.each(function () {
        //         this.addEvent(this,"click",callback,capture);
        //     });
        // },
        //
        // dblclick:function (calback, capture) {
        //     this.each(function () {
        //         this.addEvent(this,"dblclick",callback,capture);
        //     })
        // },

        on: function(type, callback, capture) {
            return this.each(function() {
                addEvent(this, type, callback, capture);
            })
        },

        off: function(type, callback) {
            return this.each(function() {
                removeEvent(this, type, callback);
            });
        }
    });


    //使用foreach 添加事件
    moyas.each([
            'click',
            'dblclick',
            'keypress',
            'keyup',
            'keydown',
            'mouseover',
            'mouseout',
            'mouseenter',
            'mouseleave',
            'mousemove',
            'mouseup',
            'mousedown'
        ],
        function(type) {
            moyas.fn[type] = function(callback, capture) {
                return this.on(type, callback, capture);
            };
        });



    //animate方法
    var easing = {
        linear: function(x, t, b, c, d) {
            return (c - b) * t / d;
        },
        minusspeed: function(x, t, b, c, d) {
            return 2 * (c - b) * t / d - (c - b) * t * t / (d * d);
        },
        easeInQuad: function(x, t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function(x, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        easeInCubic: function(x, t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function(x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeInQuart: function(x, t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutQuart: function(x, t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOutQuart: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        easeInQuint: function(x, t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOutQuint: function(x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeInSine: function(x, t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function(x, t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function(x, t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInExpo: function(x, t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function(x, t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function(x, t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function(x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOutCirc: function(x, t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInElastic: function(x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOutElastic: function(x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        easeInOutElastic: function(x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        },
        easeInBack: function(x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOutBack: function(x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOutBack: function(x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        easeOutBounce: function(x, t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        }
    };

    //获取所有动画的起始值
    var kv = {
        "left": "offsetLeft",
        "top": "offsetTop",
        "width": "offsetWidth",
        "height": "offsetHeight"
    };

    //获取起始位置
    function getLocation(elem, target) {
        var obj = {};
        for (var k in target) {
            obj[k] = elem[kv[k]];
        }
        return obj;
    };

    //获取动画的总距离
    function getDistance(location, target) {
        var obj = [];
        for (var k in target) {
            obj[k] = parseFloat(target[k]) - location[k];
        }

        return obj;
    };

    //获取单位时间 内的间隔
    function getTween(time, location, target, duration, easingName) {
        var obj = [];
        for (var k in target) {
            obj[k] = easing[easingName](null, time, location[k], target[k], duration);
        }
        return obj;
    };

    //设置样式
    function setStyle(elem, location, tween) {
        var k;
        for (k in location) {
            elem.style[k] = location[k] + tween[k] + "px";
        }
    }

    var animate = function(elem, target, duration, easingName) {
        var timer, //定时器id
            speed, //速度
            location, //起始位置
            distance, //动画总距离
            startTime, //动画开始事件
            currentTime, //动画当前时间
            time, //当前动画经过总时间间隔
            tween; //单位时间间隔内的 位移

        location = getLocation(elem, target);
        distance = getDistance(location, target);
        startTime = +new Date;

        var render = function() {
            currentTime = +new Date;
            time = currentTime - startTime;

            if (time >= duration) {
                // 1是动画到达终点
                tween = distance;
                //2停止动画  清除定时器
                w.clearInterval(timer);

                //3删除动画元素上的id 属性
                delete elem.timerId;
            } else {
                tween = getTween(time, location, target, duration, easingName)
            }
            setStyle(elem, location, tween);
        };

        //启动定时器 开始动画
        timer = w.setInterval(render, 1000 / 60);
        //把定时器id 存在动画元素上
        elem.timerId = timer;
    };

    moyas.fn.extend({
        animate: function(target, duration, easingName) {
            easingName = easingName || "linear";
            return this.each(function() {
                if (!('timerId' in this)) {
                    animate(this, target, duration, easingName);
                }
            });
        },
        stop: function() {
            return this.each(function() {
                if ("timerId" in this) {
                    w.clearInterval(this.timerId);
                    delete this.timerId;
                }
            });
        }
    });
    //ajax 模块
    moyas.extend({
        ajaxSetting: {
            url: '',
            type: 'GET',
            dataType: 'text',
            contentType: 'application/x-www-form-urlencoded',
            jsonp: 'callback',
            jsonpCallback: '',
            data: null,
            async: true,
            success: null,
            fail: null,
            timeout: 0
        },
        ajax: function(config) {
            //过滤无效的参数
            if (!config || !config.url) {
                console.warn("参数异常");
                return;
            }

            if (config.dataType.toLowerCase() === 'jsonp') {
                jsonp(config);
            } else {
                ajax(config);
            }
        }

    });

    function jsonp(config) {
        var scriptElem,
            headElem,
            context = {},
            callbackName;

        //过滤无效的参数
        if (!config || !config.url) {
            console.warn('参数异常');
            return;
        };

        moyas.extend(moyas.ajaxSetting, context);
        moyas.extend(config, context);

        //1 创建对象
        scriptElem = document.createElement('script');

        //2 将创建的script标签添加到页面的head下
        headElem = document.getElementsByTagName('head')[0];
        headElem.appendChild(scriptElem);

        //3 格式化数据
        context.url += '?' + formatData(context.data);

        //4 创建全局回调函数的名字
        callbackName = context.jsonpCallback ? context.jsonpCallback :
            'jsonp_' + (+new Date);

        //把全局回调函数的名字发给服务器
        context.url += '&' + context.jsonp + '=' + callbackName;

        window[callbackName] = function(data) {
            //请求成功
            //删除动态创建的script 标签
            headElem.removeChild(scriptElem);
            //删除全局回调函数
            delete window[callbackName];
            //清除超时的延迟函数
            window.clearTimeout(scriptElem.timer);
            //执行用户指定的成功的回调函数
            context.success && context.success(data);
        };

        //设置超时时间
        if (context.timeout) {
            scriptElem.timer = window.setTimeout(function() {
                //请求失败
                //删除动态创建的script标签
                headElem.removeChild(scriptElem);
                //删除全局回调函数
                delete window[callbackName];
                //执行用户指定的失败的回调函数
                context.fail && context.fail({
                    'message': '请求超时'
                });
            }, context.timeout);
        }

        //发送请求
        scriptElem.src = context.url;
    }



    function createRequest() {
        return window.XMLHttpRequest ? new window.XMLHttpRequest() :
            new ActiveXObject('Microsoft.XMLHTTP');
    }

    function formatData(data) {
        var ret = [];
        for (var k in data) {
            ret.push(window.encodeURIComponent(k) + '=' + window.encodeURIComponent(data[k]));
        }

        //如果不想从服务器缓存中读取数据
        ret.push(('_=' + Math.random()).replace('.', ''));
        return ret.join('&');
    }

    function ajax(config) {
        var context = {},
            xhr,
            postData = '';
        //过滤无效的参数
        if (!config || !config.url) {
            consloe.warn('参数异常');
            return;
        }

        //获取默认配置信息
        moyas.extend(moyas.ajaxSetting, context);
        //用户配置信息 覆盖默认配置
        moyas.extend(config, context);

        //1 创建请求对象
        xhr = createRequest();
        //2 格式话数据
        if (context.data) {
            postData = formatData(context.data);
        }
        //3 与服务器建立链接
        if (context.type.toUpperCase() === 'GET') {
            xhr.open('GET', context.url + '?' + postData, context.async);
            postData = null;
        } else {
            //模拟表单提交 设置请求头信息
            xhr.setRequestHeader('content-Type', context.contentType);
            xhr.open('OPST', context.url, contex.async);
        }

        //监听请求状态
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304){
                    //获取到请求回来的数据
                    var text = xhr.responseText;
                    //如果指定的数据格式为 json 那么就将其转换成json 对象
                    text = context.dataType.toLowerCase() === 'json'?JSON.parse(text) : text;

                    context.success && context.success(text);
                } else {
                    context.fail && context.fail({
                        "errorCode": xhr.status,
                        "massage": "请求超时"
                    });
                }
            }
        };
        //发送请求
        xhr.send(postData);
    }

    //暴露给用户
    w.$ = w.moyas = moyas;
}(window))