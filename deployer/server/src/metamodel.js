/*****************************/
/* FunctionRegistry          */
/*****************************/
var FunctionRegistry = function (spec) {
    var that = {};

    that.functions = spec.functions || [];

    return that;
}


/*****************************/
/* Function                  */
/*****************************/
var Function = function (spec) {
    var that = {};

    that.id = spec.id || "";
    that.runtime = spec.runtime || {};
    that.ctx = spec.ctx || {};
    that.triggers = spec.triggers || [];

    return that;
};

module.exports = {
    Function: Function,
    FunctionRegistry: FunctionRegistry
};