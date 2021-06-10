/*****************************/
/* FunctionRegistry          */
/*****************************/
var FunctionRegistry = function (spec) {
    var that = {};

    that.functions = spec.functions || []; // A list of functions

    return that;
}


/*****************************/
/* Function                  */
/*****************************/
var Function = function (spec) {
    var that = {};

    that.id = spec.id || ""; // A unique ID
    that.src = spec.src || ""; // Path to the function source code
    that.runtime = spec.runtime || {}; // The software stack for the function
    that.ctx = spec.ctx || {}; // Context of the function
    that.triggers = spec.triggers || []; // The data the function should registered to be triggered

    return that;
};

module.exports = {
    Function: Function,
    FunctionRegistry: FunctionRegistry
};