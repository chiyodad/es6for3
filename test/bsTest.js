var bsTest = (function(){
	var funcToStr, compare,
		que, printer, result, test, isReady,
		id, isOK, isNode, con;

	funcToStr = (function(){
		var r0 = /</g, r1 = /\t/g;
		return function(func){
			var str, tab, i, j;
			str = func.toString();
			if(str.indexOf("\n") == -1) return str;
			str = str.split("\n"),
			tab = str[str.length - 1],
			tab = tab.substr(0, tab.length - 1);
			for( i = 0, j = str.length ; i < j ; i++ )
				if(str[i].substr(0, tab.length) == tab) str[i] = str[i].substr(tab.length);
			return str.join("\n").replace(r0, "&lt;").replace(r1, "  ");
		};
	})(),
	compare = (function(){
		var t0 = [],
		deepCompare = function(a, b){
			var type, i, j;
			type = typeof a;
			if(type != typeof b) return false;
			if(type == "object"){
				if(a === null) return a === b;
				else if(a.splice){
					if(!b.splice || a.length != b.length) return false;
					for(i = 0, j = a.length ; i < j ; i++) if(!deepCompare(a[i], b[i])) return false;
					return true;
				}else{
					j = 0;
					for( i in b ) j++;
					for( i in a ){
						if(!deepCompare(a[i], b[i])) return false;
						j--;
					}
					return !j;
				}
			}
			return a === b;
		};
		return function(t, o){
			switch(t.bsTestType){
			case'reg':return t0[0] = 'regEx(' + t[0].toString() + ')', t0[1] = (new RegExp(t[0], 'g')).test(o) ? 1 : 0, t0;
			case'in':return t0[0] = 'of [' + t.join(',') +']', t0[1] = t.indexOf(o) > -1 ? 1 : 0, t0;
			case'not':return t0[0] = '!= ' + t[0], t0[1] = o !== t[0] ? 1 : 0, t0;
			case'lt':return t0[0] = '< ' + t[0], t0[1] = o < t[0] ? 1 : 0, t0;
			case'gt':return t0[0] = '> ' + t[0], t0[1] = o > t[0] ? 1 : 0, t0;
			case'item':return t0[0] = '== ' + t, t0[1] = deepCompare( t, o ), t0;
			case'range':return t0[0] = '( ' + t[0] + ' ~ ' + t[1] + ' ) ', t0[1] = ( t[0] < t[1] ? t[0] : t[1] ) <= o && o <= ( t[0] < t[1] ? t[1] : t[0] ), t0;
			default:return t0[0] = t, t0[1] = o, t0;
			}
		};
	})();
	
	id = 0, isOK = 1, que = [], isReady = 0,
	
	test = function(title){
		var r, expected, val, txt, ok, fail, t0, i, j;
		switch(isReady){
		case 0:return que.push(arguments);
		case 1:
			isReady = 2;
			for( i = 0, j = que.length ; i < j ; i++ ) test.apply(null, que[i]);
			que.length = 0;
			return;
		}
		id++,
		r = isNode ? ['[test#'+id+'] '+title+'\n========================'] :
			'<div style="border:1px dashed #999;padding:10px;margin:10px">'+
				'<div id="bsTestOn'+id+'" style="display:none;cursor:pointer" onclick="bsTest.on(this)">'+
					'<div style="float:left">'+
						'<b>'+title+'</b><hr>'+
							'<ol>';
		//test
		ok = fail = 0, i = 1, j = arguments.length;
		while( i < j ){
			t0 = arguments[i++], expected = arguments[i++];
			//value
			txt = typeof t0 == 'function' ? ( val = t0(), funcToStr(t0) ) : ( val = arguments[i++], t0 );
			//compare
			if( val && val.bsTestType ) t0 = compare( val, expected );
			else if( expected && expected.bsTestType ) t0 = compare( expected, val );
			else t0 = compare( ' == ' + expected, val === expected );
			//result
			t0[1] ? ok++ : fail++;
			txt = ( isNode ? txt + '\n' +  val + ' ::\n'  :
					'<li><pre style="display:inline;">' + txt + '</pre> <b>' + val + '</b> :: <b>'
				) + 
				t0[0] +
				( isNode ? t0[1] ? ' OK' : ' FAIL' :
					'</b> <b style="color:#' + ( t0[1] ? '0a0">OK' : 'a00">NO') + '</b></li>'
				);
			isNode ? r[r.length] = con( txt, t0[1] ? 'green' : 'red' ) : r += txt;
		}
		//total result
		if( fail ) isOK = 0;
		//print
		if( isNode ){
			//console.log( t0 = 'RESULT[#' + id + '] : ' + ( fail ? con("FAIL", 'red') : con( 'OK', 'green') ) + '[' + con( "OK: " + s, 'green' ) + ' ' + con( "FAIL: " + f, 'red' ) + ']' );
			for( i = 0, j = r.length ; i < j ; i++) console.log(r[i]);
			//console.log(t0);
		}else{
			printer( r = r + '</ol></div>'+
				'<div id="bsTestResult'+id+'" style="padding:5px;float:right;border:1px dashed #999;text-align:center"><b style="font-size:30px;color:#' + ( fail ? 'a00">FAIL' : '0a0">OK' ) + '</b><br>ok:<b style="color:#0a0">' + ok + '</b> fail:<b style="color:#a00">' + fail + '</b></div><br clear="both"></div>'+
				'<div id="bsTestOff'+id+'" style="display:block;cursor:pointer" onclick="bsTest.off(this)"><b>'+title+'</b> : <b style="color:#' + ( fail ? 'a00">FAIL' : '0a0">OK' ) + '</b></div></div>'
			);
			if( ( t0 = window.top ) != window.self && t0.bsTest && t0.bsTest.suite.urls && fail ) t0.bsTest.suiteResult(location.pathname);
			if( result ) result( '<hr><div style="font-weight:bold;font-size:30px;padding:10px;color:#' + ( isOK ? '0a0">OK' : 'a00">FAIL'  ) + '</div>' );
		}
	},
	test.isOK = function(){
		return isOK;
	},
	test.on = function(dom){dom.style.display = 'none', document.getElementById('bsTestOff'+dom.id.substr(8)).style.display = 'block';},
	test.off = function(dom){dom.style.display = 'none', document.getElementById('bsTestOn'+dom.id.substr(9)).style.display = 'block';},
	//assert option
	test.NOT = function(){return arguments.bsTestType = 'not', arguments;},
	test.ITEM = function(a){return a.bsTestType = 'item', a;},
	test.IN = function(){
		var t0 = Array.prototype.slice.call( arguments, 0 );
		return t0.bsTestType = 'in', t0;
	},
	test.LT = function(){return arguments.bsTestType = 'lt', arguments;},
	test.GT = function(){return arguments.bsTestType = 'gt', arguments;},
	test.RANGE = function( a, b ){
		var t0 = [a, b];
		return t0.bsTestType = 'range', t0;
	},
	test.REG = function( a ){return arguments.bsTestType = 'reg', arguments;},
	//tear
	test.tear = function( title, func ){
		id++, func();
		if( isNode ) console.log( '[tear#'+id + '] '+ title + '\n======================' + funcToStr(func) + '\n' );
		else printer(
			'<div style="border:1px solid #999;background:#eee;padding:10px;margin:10px">'+
				'<div id="bsTestOn'+id+'" style="display:none;cursor:pointer" onclick="bsTest.on(this)"><b>'+title+'</b><hr><pre>'+funcToStr(func)+'</pre></div>'+
				'<div id="bsTestOff'+id+'" style="display:block;cursor:pointer" onclick="bsTest.off(this)"><b>'+title+'</b></div>'+
			'</div>' );
	};
	if( typeof process !== 'undefined' && process.version ){
		isNode = 1,
		conStyle = {
			'bold':['\x1B[1m','\x1B[22m'],'italic':['\x1B[3m','\x1B[23m'],'underline':['\x1B[4m','\x1B[24m'],'inverse':['\x1B[7m','\x1B[27m'],'strikethrough':['\x1B[9m','\x1B[29m'],
			'white':['\x1B[37m','\x1B[39m'],'grey':['\x1B[90m','\x1B[39m'],'black':['\x1B[30m','\x1B[39m'],'blue':['\x1B[34m','\x1B[39m'],'yellow':['\x1B[33m','\x1B[39m'],
			'cyan':['\x1B[36m','\x1B[39m'],'green':['\x1B[32m','\x1B[39m'],'magenta':['\x1B[35m','\x1B[39m'],'red':['\x1B[31m','\x1B[39m'],
			'whiteBG':['\x1B[47m','\x1B[49m'],'greyBG':['\x1B[49;5;8m','\x1B[49m'],'blackBG':['\x1B[40m','\x1B[49m'],'blueBG':['\x1B[44m','\x1B[49m'],'yellowBG':['\x1B[43m','\x1B[49m'],
			'cyanBG':['\x1B[46m','\x1B[49m'],'greenBG':['\x1B[42m','\x1B[49m'],'magentaBG':['\x1B[45m','\x1B[49m'],'redBG':['\x1B[41m','\x1B[49m']
		},
		con = function( str, style ){return style = conStyle[style] || conStyle['white'], style[0] + str + style[1];},
		module.exports = test;
		isReady = 2;
	}else{
		test.suite = function(){
			var i = arguments.length, url;
			test.suite.urls = arguments;
			while( i-- ) url = arguments[i], printer(
				'<div style="width:250px;float:left;border:1px dashed #999;background:#eee;padding:10px;margin:10px">'+
					'<div>'+
						'<a href="'+url+'" target="_blank">'+url+'</a> ' +
						'<span id="'+url+'"><b style="font-size:20px;color:#0a0">OK</b></span>'+
					'</div>'+
					'<iframe src="'+url+'" scrolling="no" style="margin-top:10px;border:0;width:100%;height:200px"></iframe>'+
				'</div>'
			);
			result( '<div style="font-weight:bold;font-size:30px;padding:10px;color:#0a0">OK</div><hr>' );
		},
		test.suiteResult = function(v){
			document.getElementById(v.split("/").pop()).innerHTML = '<b style="font-size:20px;color:#a00">FAIL</b>',
			result('<div style="font-weight:bold;font-size:30px;padding:10px;color:#a00">FAIL</div><hr>');
		};
		(function(){
			var TEST, RESULT;
			RESULT = document.getElementById("bsTestResult");
			if(!RESULT){
				RESULT = document.createElement("DIV");
				RESULT.id = "bsTestResult";
				document.body.appendChild(RESULT);
			}
			TEST = document.getElementById('bsTestTest');
			if(!TEST){
				TEST = document.createElement("DIV");
				TEST.id = "bsTestTest";
				document.body.appendChild(TEST);
			}
			RESULT.style.fontFamily = TEST.style.fontFamily = 'Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif';
			printer = function(r){
				TEST.innerHTML += r;
			},
			result = function(r){
				//console.log(r);
				RESULT.innerHTML = r;
			};
			isReady = 1;
			test();
		})();
	}
	if(!isNode){
		test.mouseEvent = function(target, type, x, y){
			var el = target, l = 0, t = 0, e;
			if(el.nodeType != 1) throw 1;
			do{
				l += el.offsetLeft;
				t += el.offsetTop;
			}while(el = el.offsetParent)
			e = document.createEvent('MouseEvents');
			e.initMouseEvent(type, true, true, document.defaultView, 0, x, y, x - l, y - t, false, false, false, false, 0, null);
			target.dispatchEvent(e);
		};
		test.keyEvent = (function(){
			var _initKeyboardEvent_type = (function(e){
					try {
						e.initKeyboardEvent("keyup", false, false, window, "+", 3, true, false, true, false, false);		
						return ((e["keyIdentifier"] || e["key"]) == "+" && (e["keyLocation"] || e["location"]) == 3) && 
							(e.ctrlKey ? e.altKey ? 1 : 3 : e.shiftKey ? 2 : 4) || 9;
					}catch(_e){_initKeyboardEvent_type = 0}
				})(document.createEvent("KeyboardEvent")),
				_keyboardEvent_properties_dictionary = {
					"char": "", "key": "", "location": 0, "ctrlKey": false, "shiftKey": false, "altKey": false, "metaKey": false, "repeat": false, "locale": "",
					"detail":0, "bubbles":false, "cancelable":false,
					"keyCode": 0, "charCode": 0, "which": 0
				},
				own = Function.prototype.call.bind(Object.prototype.hasOwnProperty),
				_Object_defineProperty = Object.defineProperty || function(obj, prop, val) {
					if( "value" in val ) {
						obj[prop] = val["value"];
					}
				},
				crossBrowser_initKeyboardEvent = function (type, dict){
					var e;
					if( _initKeyboardEvent_type ) {
						e = document.createEvent( "KeyboardEvent" );
					}
					else {
						e = document.createEvent( "Event" );
					}
					var _prop_name
						, localDict = {};
				
					for( _prop_name in _keyboardEvent_properties_dictionary ) if(own(_keyboardEvent_properties_dictionary, _prop_name) ) {
						localDict[_prop_name] = (own(dict, _prop_name) && dict || _keyboardEvent_properties_dictionary)[_prop_name];
					}
				
					var _ctrlKey = localDict["ctrlKey"]
						, _shiftKey = localDict["shiftKey"]
						, _altKey = localDict["altKey"]
						, _metaKey = localDict["metaKey"]
						, _altGraphKey = localDict["altGraphKey"]
				
						, _modifiersListArg = _initKeyboardEvent_type > 3 ? (
							(_ctrlKey ? "Control" : "")
								+ (_shiftKey ? " Shift" : "")
								+ (_altKey ? " Alt" : "")
								+ (_metaKey ? " Meta" : "")
								+ (_altGraphKey ? " AltGraph" : "")
							).trim() : null
				
						, _key = localDict["key"] + ""
						, _char = localDict["char"] + ""
						, _location = localDict["location"]
						, _keyCode = localDict["keyCode"] || (localDict["keyCode"] = _key && _key.charCodeAt( 0 ) || 0)
						, _charCode = localDict["charCode"] || (localDict["charCode"] = _char && _char.charCodeAt( 0 ) || 0)
				
						, _bubbles = localDict["bubbles"]
						, _cancelable = localDict["cancelable"]
				
						, _repeat = localDict["repeat"]
						, _locale = localDict["locale"]
						, _view = window
					;
					
					localDict["which"] || (localDict["which"] = localDict["keyCode"]);
				
					if( "initKeyEvent" in e ) {//FF
						e.initKeyEvent( type, _bubbles, _cancelable, _view, _ctrlKey, _altKey, _shiftKey, _metaKey, _keyCode, _charCode );
					}
					else if(  _initKeyboardEvent_type && "initKeyboardEvent" in e ) {
						if( _initKeyboardEvent_type == 1 ) { // webkit
							e.initKeyboardEvent( type, _bubbles, _cancelable, _view, _key, _location, _ctrlKey, _shiftKey, _altKey, _metaKey, _altGraphKey );
						}
						else if( _initKeyboardEvent_type == 2 ) { // old webkit
							e.initKeyboardEvent( type, _bubbles, _cancelable, _view, _ctrlKey, _altKey, _shiftKey, _metaKey, _keyCode, _charCode );
						}
						else if( _initKeyboardEvent_type == 3 ) { // webkit
							e.initKeyboardEvent( type, _bubbles, _cancelable, _view, _key, _location, _ctrlKey, _altKey, _shiftKey, _metaKey, _altGraphKey );
						}
						else if( _initKeyboardEvent_type == 4 ) { // IE9
							e.initKeyboardEvent( type, _bubbles, _cancelable, _view, _key, _location, _modifiersListArg, _repeat, _locale );
						}
						else { // FireFox|w3c
							e.initKeyboardEvent( type, _bubbles, _cancelable, _view, _char, _key, _location, _modifiersListArg, _repeat, _locale );
						}
					}
					else {
						e.initEvent(type, _bubbles, _cancelable)
					}
				
					for( _prop_name in _keyboardEvent_properties_dictionary )if( own( _keyboardEvent_properties_dictionary, _prop_name ) ) {
						if( e[_prop_name] != localDict[_prop_name] ) {
							try {
								delete e[_prop_name];
								_Object_defineProperty( e, _prop_name, { writable: true, "value": localDict[_prop_name] } );
							}
							catch(e) {
								//Some properties is read-only
							}
						}
					}
					
					return e;
				};
			
			
			return function(target, type, key, shift, ctrl, alt){
				var t0 = {key:key};
				if(target.nodeType != 1) throw 1;
				if(shift) t0.shiftKey = true;
				if(ctrl) t0.metaKey = true;
				if(alt) t0.altKey = true;
				target.dispatchEvent(crossBrowser_initKeyboardEvent(type, t0));
			};
		})();
	}
	return test;
})();
