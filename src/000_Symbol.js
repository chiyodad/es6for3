"use strict"
if(typeof Object.freeze != 'function') Object.freeze = function(v){return v;};
if(!String.prototype.trim) (function(){
	var trim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	String.prototype.trim = function(){return this.replace(trim, '');};
})();
if(!window.Symbol || bsTest)(function(){
	var uuid = 0,
		getId = function(){
			return '@@Symbol:' + (+new Date) + ':' + (uuid++) + ':' + (Math.random() + '').substr(0, 5);
		},
		ID = getId(),
		Sym = function(id){
			this[ID] = id;
			return Object.freeze(this);
		},
		Symbol = function(){return new Sym(getId());},
		keys = {},
		syms = {};
	Sym.prototype.toString = function(){return this[ID];},
	Symbol['for'] = function(k) {
		if(!keys[k]) syms[keys[k] = Symbol(k)] = k;
		return keys[k];
	};
	Symbol.keyFor = function(s){return syms[s];};
	Symbol.iterator = Object.freeze(new Sym('@@iterator'));
	window.Symbol = Object.freeze(Symbol);
})();
