if(!window.Map || bsTest)(function(){
	var MAP = Symbol(), Map = function(a){
		var map = this[MAP] = {}, self = this;
		if(a instanceof Array) a.forEach(function(v){map[v[0]] = v[1];});
	}, fn = Map.prototype;
	fn.set = function(k, v){this[MAP][k] = v;};
	fn.get = function(k){return this.has(k) ? this[MAP][k] : undefined;};
	fn.has = function(k){return this[MAP].hasOwnProperty(k);};
	fn['delete'] = function(k){delete this[MAP][k];};
	fn.clear = function(){this[MAP] = {};};
	fn.entries = function(){
		var r = [], map = this[MAP], k;
		for(k in map) if(map.hasOwnProperty(k)) r[r.length] = [k, map[k]];
		return r;
	};
	fn.keys = function(){
		var r = [], map = this[MAP], k;
		for(k in map) if(map.hasOwnProperty(k)) r[r.length] = k;
		return r;
	};
	fn.values = function(){
		var r = [], map = this[MAP], k;
		for(k in map) if(map.hasOwnProperty(k)) r[r.length] = map[k];
		return r;
	};
	fn.forEach = function(f){
		var map = this[MAP], k;
		for(k in map) if(map.hasOwnProperty(k)) f(map[k], k, this);
	};
	fn[Symbol.iterator] = function(){return this.entries()[Symbol.iterator]();};
	window.Map = Object.freeze(Map);
})();
