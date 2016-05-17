if(!window.Generator || bsTest) window.Generator = function(f){
	return function(){
		var r = [];
		window.Yield = function(v){r[r.length] = v;};
		f.apply(null, arguments);
		delete window.Yield;
		return new Iter(r);
	};
};
