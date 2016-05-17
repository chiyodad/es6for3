if(!window.WeakMap || bsTest) (function(){
	var KEY = Symbol(), MAP = Symbol(), ID = Symbol(),
		type = {'object':1, 'function':1},
		check = function(k){return k && k[ID] && type[typeof k];},
		WMap = function(a){
			var map = this[MAP] = {};
			if(a instanceof Array) a.forEach(function(v){self.set(v[0], v[1]);});
			Object.freeze(this);
		},
		fn = WMap.prototype;
	fn.set = function(k, v){if(k && type[typeof k]) this[MAP][k[ID] || (k[ID] = Symbol() + '')] = v;};
	fn.get = function(k){if(check(k)) return this[MAP][k[ID]];};
	fn.has = function(k){return check(k) ? this[MAP].hasOwnProperty(k[ID]) :false;};
	fn['delete'] = function(k){return check(k) ? delete this[MAP][k[ID]] && delete k[ID] : false;};
	window.WeakMap = WMap;
})();
