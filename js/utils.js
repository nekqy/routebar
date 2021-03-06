/**
 * Модуль, содержащий всякие полезные переменные и функции
 * @module Utils
 */
define(['errors'], function(Errors) {
    "use strict";

    /**
     * Функция, возвращающая противоположную сторону к исходной
     * @param {string} side - исходная сторона
     * @returns {string} противоположная сторона
     * @memberOf module:Utils
     */
    function oppositeSide(side) {
        if (side === 'left') return 'right';
        if (side === 'right') return 'left';
        if (side === 'top') return 'bottom';
        if (side === 'bottom') return 'top';
        if (side === 'center') return 'center';
        throw new Errors.ArgumentError('side', side);
    }
    /**
     * Функция, возвращающая левую (верхнюю) сторону к исходной
     * @param {string} side - исходная сторона
     * @returns {string} левая (верхняя) сторона
     * @memberOf module:Utils
     */
    function getStartSide(side) {
        if (side === 'left') return 'left';
        if (side === 'right') return 'left';
        if (side === 'top') return 'top';
        if (side === 'bottom') return 'top';
        if (side === 'center') return 'center';
        throw new Errors.ArgumentError('side', side);
    }

    /**
     * Возвращает модуль числа index в конечной группе порядка length.
     * @param {number} index - исходное число
     * @param {number} length - порядок группы
     * @returns {number} модуль числа
     * @memberOf module:Utils
     */
    function cycledNumber(index, length) {
        return (index % length + length) % length;
    }
    /**
     * Делает первую букву строки заглавной
     * @param {string} string - исходная строка
     * @returns {string} строка с первой заглавной буквой
     * @memberOf module:Utils
     */
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    /**
     * Подмешать миксин к классу
     * @param {function} base - исходный класс
     * @param {Object} mixin - миксин
     * @memberOf module:Utils
     */
    function mixin(base, mixin) {
        for(var key in mixin) {
            if (mixin.hasOwnProperty(key)) {
                base.prototype[key] = mixin[key];
            }
        }
    }
    /**
     * Унаследовать класс от базового класса
     * @param {function} child - класс-наследник
     * @param {function} parent - базовый класс
     * @memberOf module:Utils
     */
    function inherite(child, parent) {
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
    }
    /**
     * Пустая функция
     * @memberOf module:Utils
     */
    function nop() {}

    // Mobile check
    /**
     * Возвращает флаг, является ли окружение мобильным устройством
     * @returns {boolean} флаг, является ли окружение мобильным устройством
     * @memberOf module:Utils
     */
    function mobileCheck() {
        var check = false;
        (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

    if (!Array.prototype.find) {
        Array.prototype.find = function(predicate) {
            if (this == null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        };
    }

    (function(e){
        e.closest = e.closest || function(css){
                var node = this;

                while (node) {
                    if (node.matches(css)) return node;
                    else node = node.parentElement;
                }
                return null;
            }
    })(Element.prototype);

    return /** @alias module:Utils */ {
        /**
         * Массив из возможных сторон
         */
        sides:  ['left', 'top', 'right', 'bottom'],
        /**
         * Массив из возможных сторон включая центральную
         */
        sidesWithCenter:  ['center', 'left', 'top', 'right', 'bottom'],
        /**
         * Является ли окружение мобильным устройством
         */
        isMobile: mobileCheck(),
        nop: nop,
        cycledNumber: cycledNumber,
        oppositeSide: oppositeSide,
        getStartSide: getStartSide,
        capitalizeFirstLetter: capitalizeFirstLetter,
        mixin: mixin,
        inherite: inherite
    };
});