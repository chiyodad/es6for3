if(!window.WeakSet || bsTest) (function(){
	var SET = Symbol(),
		WSet = function(a){
			var cnt = 10000;
			this[SET] = [];
			if(typeof a[Symbol.iterator] === 'function') a = a[Symbol.iterator]();
			else if(typeof a.next !== 'function') return;
			do {
				v = a.next();
				if(v.done) break;
				this.add(v.value);
			} while(cnt--);
			Object.freeze(this);
		},
		fn = WSet.prototype;
	fn.has = function(v){return this[SET].indexOf(v) !== -1;};
	fn.add = function(v){if(!this.has(v) && v instanceof Object) this[SET].push(v);};
	fn['delete'] = function(v){if(this.has(v)) this[SET].splice(this[SET].indexOf(v), 1);};
	window.WeakSet = WSet;
})();
