if(!window.Spread || bsTest)(function(){
	var sp = function(r, a){
			for(var i = 0, j = a.length; i < j; i++){
				if(a[i] == '...') sp(r, a[++i]);
				else r[r.length] = a[i];
			}
		};
	window.Spread =  function(a){
		var r = [];
		sp(r, arguments.length > 1 ? arguments : a);
		return r;
	};
})();
