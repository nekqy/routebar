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

    function PathNotFoundError(property) {
        this.name = 'PathNotFoundError';
        CustomError.apply(this, arguments);
    }
    PathNotFoundError.prototype = Object.create(CustomError.prototype);
    PathNotFoundError.prototype.constructor = PathNotFoundError;

    function FatalError(property) {
        this.name = 'FatalError';
        CustomError.apply(this, arguments);
    }
    FatalError.prototype = Object.create(CustomError.prototype);
    FatalError.prototype.constructor = FatalError;

    return {
        ArgumentError: ArgumentError,
        PathNotFoundError: PathNotFoundError,
        FatalError: FatalError,
    };
});