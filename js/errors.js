/**
 * Модуль, содержащий всякие полезные переменные и функции
 * @module Errors
 */
define([], function() {

    function CustomError(property) {
        this.name = this.name || "CustomError";

        this.property = property;
        this.message = this.name + ": " + property;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        } else {
            this.stack = (new Error()).stack;
        }
    }

    /**
     * @class
     * Класс ошибки, означающий неправильно переданный в функцию аргумент
     * @param {string} argName - название аргумента
     * @param {Object} arg - значение аргумента
     * @constructor module:Errors~ArgumentError
     */
    function ArgumentError(argName, arg) {
        if (typeof arg === 'function') {
            arg = 'function() {...}';
        } else {
            arg = JSON.stringify(arg);
        }
        arg = 'wrong function argument "' + argName + '": ' + arg;
        this.name = 'ArgumentError';
        CustomError.apply(this, [arg]);
    }
    ArgumentError.prototype = Object.create(CustomError.prototype);
    ArgumentError.prototype.constructor = ArgumentError;

    /**
     * @class
     * Класс ошибки, означающий, что путь от одной модели до другой модели не был найден
     * @param {ScreenModel} fromScreen - модель, из которой осуществлялся поиск
     * @param {ScreenModel} toScreen - модель, в которую осуществлялся поиск
     * @constructor module:Errors~PathNotFoundError
     */
    function PathNotFoundError(fromScreen, toScreen) {
        this.name = 'PathNotFoundError';
        var arg = 'path not found: from ' + fromScreen.toString() + ' to ' + toScreen.toString();
        CustomError.apply(this, [arg]);
    }
    PathNotFoundError.prototype = Object.create(CustomError.prototype);
    PathNotFoundError.prototype.constructor = PathNotFoundError;

    /**
     * @class
     * Класс ошибки, означающий критическую ошибку логики
     * @param {string} property - подробности ошибки
     * @constructor module:Errors~FatalError
     */
    function FatalError(property) {
        this.name = 'FatalError';
        CustomError.apply(this, arguments);
    }
    FatalError.prototype = Object.create(CustomError.prototype);
    FatalError.prototype.constructor = FatalError;

    /**
     * @class
     * Класс ошибки, означающий, что функция интерфейса еще не реализована
     * @param {string} module - название интерфейса
     * @param {string} functionName - название функции
     * @constructor module:Errors~NotRealizedError
     */
    function NotRealizedError(module, functionName) {
        this.name = 'NotRealizedError';
        var arg = 'Not realized ' + module + ':' + functionName;
        CustomError.apply(this, [arg]);
    }
    NotRealizedError.prototype = Object.create(CustomError.prototype);
    NotRealizedError.prototype.constructor = NotRealizedError;

    return /** @alias module:Errors */ {
        /**
         * Класс ошибки, означающий неправильно переданный в функцию аргумент
         * @type {module:Errors~ArgumentError}
         */
        ArgumentError: ArgumentError,
        /**
         * Класс ошибки, означающий, что путь от одной модели до другой модели не был найден
         * @type {module:Errors~PathNotFoundError}
         */
        PathNotFoundError: PathNotFoundError,
        /**
         * Класс ошибки, означающий, что функция интерфейса еще не реализована
         * @type {module:Errors~NotRealizedError}
         */
        NotRealizedError: NotRealizedError,
        /**
         * Класс ошибки, означающий критическую ошибку логики
         * @type {module:Errors~FatalError}
         */
        FatalError: FatalError
    };
});