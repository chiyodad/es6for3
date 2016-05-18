if(!window.Dest || bsTest)(function(){
	var pool = {}, Dest = (function(){
		var DEST = Symbol(), DEFAULT = Symbol(),
			getVal, getData, parse, destructuring, Var, Dest,
			arr = [], obj = [], a, o, ad, od, at, ot,
			rObj = /(\{[^\{\[\]\}]*\})/g, rArr = /(\[[^\{\[\]\}]*\])/g, 
			oR = function(v){return ot[o] = v, '@o_'+ od +'_' + (o++) + '@';}, //object replace -> ot : ot[o] = '{c}'
			aR = function(v){return at[a] = v, '@a_'+ ad +'_' + (a++) + '@';}, //
			rO = /(@o_[^@]+@)/g, rA = /(@a_[^@]+@)/g, rR = /^(@o_[^@]+@|@a_[^@]+@)$/,
			rNum = /^[-]?[.0-9]+$/, rStr = /^('[^']*'|"[^"]*")$/,
			primi = {'true':true, 'false':false, 'null':null};
		getData = function(d){
			var target = d.search(rO) > -1 ? obj : d.search(rA) > -1 ? arr : 0;
			if(target) return d = d.substring(1, d.length - 1).split('_'), target[d[1]][d[2]]; //obj, arr 중 
			return false;
		};
		getVal = function(d){
			var target = d.search(rO) > -1 ? obj : d.search(rA) > -1 ? arr : 0;
			if(target) return d = d.substring(1, d.length - 1).split('_'), JSON.parse(target[d[1]][d[2]]);
			else if(d.search(rStr) > -1) return d.substring(1, d.length - 1); //문자열 처리
			else if(d.search(rNum) > -1) return parseFloat(d); // parseFloat : 011 처리 
			else if(d = primi[d]) return d; //primi - 11번
		};
		Dest = function(dest){  //Dest 클래스 생성
			var loop, r = this[DEST] = {};  // r- DEST 저장용
			arr.length = obj.length = a = o = ad = od = 0, dest = dest.trim(); // 초기화, dest 값 trim()
			do{
				loop = 0; //재귀를 루프로 만들기 위해 만든 스택 - obj, a
				if(dest.search(rObj) > -1) obj[od] = ot = [], dest = dest.replace(rObj, oR), od++, loop = 1;//rObj-6번줄
				if(dest.search(rArr) > -1) arr[ad] = at = [], dest = dest.replace(rArr, aR), ad++, loop = 1;
			}while(loop);
			if(dest.indexOf('=') > -1) dest = dest.split('='), r[DEFAULT] = getVal(dest[1].trim()), dest = dest[0].trim();//getVal - 17
			if(dest.search(rR) == -1) throw 'invalid destructuring'; //잘못된 해체 - obj 나 arr이 아님
			parse(dest, r);
		};
		Dest.prototype.value = function(v){
			var result = {};
			destructuring(this[DEST], v === undefined ? this[DEST][DEFAULT] : v, result);
			return result;
		};
		Var = function(k){
			var i = k.indexOf('=');
			if(i > -1) this[DEFAULT] = getVal(k.substr(i + 1).trim()), k = k.substring(0, i).trim();
			this.k = k;
		};
		Var.prototype.toString = function(){return this.k;};
		parse = function(dest, r){ //파싱
			var v, isObj;
			dest = dest.trim();
			if(v = getData(dest)){
				isObj = v.charAt(0) == '{' ? 1 : 0; //obj 확인
				v.substring(1, v.length - 1).split(',').forEach(function(v, idx){
					var p;
					v = v.trim();
					if(isObj){
						p = v.indexOf(':');
						v = p > -1 ? [v.substring(0, p), v.substr(p + 1)] : [v, v];
						if(p = parse(v[1], {})) r[v[0].trim()] = p;
					}else if(p = parse(v, {})) r[idx] = p;
				});
				return r;
			}else return dest ? new Var(dest) : undefined;
		};
		destructuring = function(target, v, result){
			var k, key;
			for(k in target){
				key = target[k]; //파싱된 객체 트리를 이용해서 객체 트리를 실행함.
				if(key instanceof Var) result[key] = v[k] === undefined ? key[DEFAULT] : v[k];
				else if(key && typeof key == 'object') destructuring(key, v[k], result);
			}
		};
		return Dest;
	})();
	window.Dest = function(dest, v){return (pool[dest] || (pool[dest] = new Dest(dest))).value(v);};
})();
