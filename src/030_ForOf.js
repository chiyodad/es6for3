if(!window.For || bsTest)(function(){
	var DEST = Symbol(), Of;
	Of = function(d){this[DEST] = d;};
	Of.prototype.Of = function(iter, f){
		var cnt = 100000, val, dest = this[DEST];
		if(typeof iter[Symbol.iterator] == 'function') iter = iter[Symbol.iterator]();
		if(typeof iter.next != 'function') throw 'invalid iterator';
		while(cnt--){
			val = iter.next();
			if(val.done) break;
			else f(dest ? Dest(dest, val.value) : val.value);
		}
	};
	window.For = function(dest){
		this[DEST] = '';
		return new Of(dest);
	};
	window.For.Of = Of.prototype.Of;
})();
