if(!window.Set || bsTest) (function(){
	var SET = Symbol(), Set = function(a){
		this[SET] = a instanceof Array ? a.slice(0) : [];
		Object.freeze(this);
	}, fn = Set.prototype;
	fn.has = function(v){return this[SET].indexOf(v) != -1;};
	fn.add = function(v){if(!this.has(v)) this[SET].push(v);};
	fn['delete'] = function(v){if(this.has(v)) this[SET].splice(this[SET].indexOf(v), 1);};
	fn.clear = function(){this[SET].length = 0;};
	fn.values = function(){return this[SET].slice(0);};
	fn.forEach = function(f){for(var set = this[SET], i = 0, j = set.length; i < j; i++) f(set[i], i, this);};
	fn[Symbol.iterator] = function(){return this[SET][Symbol.iterator]();};
	window.Set = Set;
})();
