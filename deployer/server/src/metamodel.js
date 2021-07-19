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
    that.functionResource = spec.functionResource || ""; // ID of the function source code
    that.runtime = spec.runtime || ""; // Id of the software stack for the function
    that.ctx = spec.ctx || {}; // Context of the function
    that.triggers = spec.triggers || []; // The data the function should registered to be triggered

    return that;
};

/*****************************/
/* RuntimeRegistry          */
/*****************************/
var RuntimeRegistry = function (spec) {
    var that = {};

    that.runtimes = spec.runtimes || []; // A list of Runtime

    that.removeRuntimes = function (id) {
        var tab = that.runtimes.filter(function (elem) {
            if (elem.id !== id) {
                return elem;
            }
        });
        if (tab.length < that.runtimes.length) {
            that.runtimes = tab;
            return true;
        } else {
            return false;
        }
    };

    return that;
}

/*****************************/
/* Runtime                  */
/*****************************/
var Runtime = function (spec) {
    var that = {};
    that.id = spec.id || ""; // A unique ID
    that.description || "";
    that.runtime = spec.runtime || {}; // The software stack for the function

    return that;
};


/*****************************/
/* FunctionResource          */
/*****************************/
var FunctionResource = function (spec) {
    var that = {};
    that.id = spec.id || ""; // A unique ID
    that.description || "";
    that.path = spec.path || {}; // The software stack for the function

    return that;
};

/*****************************/
/* FunctionResourceRegistry          */
/*****************************/
var FunctionResourceRegistry = function (spec) {
    var that = {};

    that.FunctionResources = spec.FunctionResources || []; // A list of Runtime

    that.removeFunctionResource = function (id) {
        var tab = that.FunctionResources.filter(function (elem) {
            if (elem.id !== id) {
                return elem;
            }
        });
        if (tab.length < that.FunctionResources.length) {
            that.FunctionResources = tab;
            return true;
        } else {
            return false;
        }
    };

    return that;
}


module.exports = {
    Function: Function,
    Runtime: Runtime,
    FunctionRegistry: FunctionRegistry,
    RuntimeRegistry: RuntimeRegistry,
    FunctionResource: FunctionResource,
    FunctionResourceRegistry: FunctionResourceRegistry
};

