if(!window.WeakSet || bsTest) (function(){
	var SET = Symbol(), ID = Symbol(),
		type = {'object':1, 'function':1},
		check = function(k){return k && type[typeof k];},
		WSet = function(a){
			var self = this;
			this[SET] = [];
			if(a)For.Of(a, function(v){self.add(v);});
			Object.freeze(this);
		},
		fn = WSet.prototype;
	fn.has = function(v){return check(v) ? this[SET].indexOf(v) > -1 : false;};
	fn.add = function(v){if(!this.has(v)) this[SET].push(v);};
	fn['delete'] = function(v){if(this.has(v)) this[SET].splice(this[SET].indexOf(v), 1);};
	window.WeakSet = WSet;
})();
