
if(!window.Class || bsTest)(function(){
	var CONSTRUCTOR = Symbol();
	window.Class = function(ext){
		var c, cs, ms, fn, k;
		cs = ext ? function(){
			ext.apply(this, arguments);
		} : function(){};
		c = function(){
			window.super = cs;
			this[CONSTRUCTOR].apply(this, arguments);
			delete window.super;
		};
		if(ext) c.prototype = new ext();
		fn = c.prototype;
		ms = {};
		if(ext){
			for(k in ext.prototype)if(ext.prototype.hasOwnProperty(k)){
				ms[k] = function(){
					return ext.prototype[k].apply(this.self, arguments);
				};
			}
		}
		c.Contructor = function(f){
			fn[CONSTRUCTOR] = f;
			return c;
		};
		c.Static = function(v){
			var k;
			for(k in v)if(v.hasOwnProperty(k) && !c[k]){
				c[k] = function(){
					var r;
					window.Super = ext;
					r = [k].apply(c, arguments);
					delete window.Super;
					return r;
				};
			}
			return c;
		};
		c.Method = function(v){
			var k;
			for(k in v)if(v.hasOwnProperty(k) && !fn[k]){
				c[k] = function(){
					ms.self = this;
					window.super = ms;
					v[k].apply(this, arguments);
					delete window.super;
				};
			}
			return c;
		};
		c.Generator = function(v){
			var k, g;
			for(k in v)if(v.hasOwnProperty(k) && !fn[k]){
				g = Generator(v[k]);
				c[k] = function(){
					ms.self = this;
					window.Super = ms;
					g.apply(this, arguments);
					delete window.Super;
				};
			}
			return c;
		};
		return c;
	};
	window.Class.Constructor = function(f){return Class().Contructor(f);};
	window.Class.Static = function(f){return Class().Static(f);};
	window.Class.Method = function(f){return Class().Method(f);};
	window.Class.Generator = function(f){return Class().Generator(f);};
})();
