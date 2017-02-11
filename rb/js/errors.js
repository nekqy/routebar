define([], function() {

    function CustomError(property) {
        this.name = "CustomError";

        this.property = property;
        this.message = "CustomError: " + property;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        } else {
            this.stack = (new Error()).stack;
        }
    }

    function PropertyError(property) {
        CustomError.apply(this, arguments);
        this.name = 'PropertyError';
    }
    PropertyError.prototype = Object.create(CustomError.prototype);
    PropertyError.prototype.constructor = PropertyError;

    function PathNotFoundError(property) {
        CustomError.apply(this, arguments);
        this.name = 'PropertyError';
    }
    PathNotFoundError.prototype = Object.create(CustomError.prototype);
    PathNotFoundError.prototype.constructor = PathNotFoundError;

    function FatalError(property) {
        CustomError.apply(this, arguments);
        this.name = 'PropertyError';
    }
    FatalError.prototype = Object.create(CustomError.prototype);
    FatalError.prototype.constructor = FatalError;

    return {
        PropertyError: PropertyError,
        PathNotFoundError: PathNotFoundError,
        FatalError: FatalError
    };
});