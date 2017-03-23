(function(){
    var root = typeof self == 'object' && self.self === self && self ||
	typeof global == 'object' && global.global === global && global ||
	this ||
	{};
    // Create a safe reference to the Underscore object for use below.
    var _ = function(obj) {
	if (obj instanceof _) return obj;
	if (!(this instanceof _)) return new _(obj);
	this._wrapped = obj;
    };
    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for their old module API. If we're in
    // the browser, add `_` as a global object.
    // (`nodeType` is checked to ensure that `module`
    // and `exports` are not HTML elements.)
    if (typeof exports != 'undefined' && !exports.nodeType) {
	if (typeof module != 'undefined' && !module.nodeType && module.exports) {
	    exports = module.exports = _;
	}
	exports._ = _;
    } else {
	root._ = _;
    }
    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var nativeIsArray = Array.isArray,
	nativeKeys = Object.keys,
	nativeCreate = Object.create;

    // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
    var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
			      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

    var collectNonEnumProps = function(obj, keys) {
	var nonEnumIdx = nonEnumerableProps.length;
	var constructor = obj.constructor;
	var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

	// Constructor is a special case.
	var prop = 'constructor';
	if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

	while (nonEnumIdx--) {
	    prop = nonEnumerableProps[nonEnumIdx];
	    if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
		keys.push(prop);
	    }
	}
    };
    //helper functions
    var shallowProperty = function(key) {
	return function(obj) {
	    return obj == null ? void 0 : obj[key];
	};
    };
    // Helper for collection methods to determine whether a collection
    // should be iterated as an array or as an object.
    // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = shallowProperty('length');
    var isArrayLike = function(collection) {
	var length = getLength(collection);
	return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };
    //optimize callback(.eq Cb) function with arguments
    var optimizeCb = function(func,context,argCount){
	if(context === void 0)return func;
	switch(argCount){}
	return function(){
	    console.log(arguments);
	    return func.apply(context,arguments);
	}
    };
    _.keys = function(obj){
	if(!_.isObject(obj))return [];
	if(nativeKeys) return nativeKeys(obj);
	var keys = new Array();
	for(var key in obj){
	    if(_.has(obj,key))
		keys.push(key);
	}
	if(hasEnumBug) collectNonEnumProps(obj,keys);
	return keys;
    }
    _.isObject = function(obj){
	var type = typeof(obj);
	return type === 'function' || type === 'object' && !!obj;
    }
    _.has = function(obj,path){
	if(!_.isArray()){
	    return obj !=null && hasOwnProperty.call(obj,path);
	}
	var length = path.length;
	for (var i = 0; i < length; i++) {
	    var key = path[i];
	    if (obj == null || !hasOwnProperty.call(obj, key)) {
		return false;
	    }
	    obj = obj[key];
	}
	return !!length;
    }


    _.each = _.forEach = function(obj,callback,others){
	callback = optimizeCb(callback,others);
	for(var a in obj){
	    if(obj.hasOwnProperty(a)){
		callback.call(others,isNaN(parseInt(obj[a])) ? obj[a] : parseInt(obj[a]),isNaN(parseInt(a)) ? a : parseInt(a));
	    }
	}

    };

    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (typeof define == 'function' && define.amd) {
	define('underscore', [], function() {
	    return _;
	});
    }
}());
