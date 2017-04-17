"use strict";function isObject(e){return e===Object(e)}function makeStackTraceLong(e,t){if(hasStacks&&t.stack&&"object"==typeof e&&null!==e&&e.stack&&-1===e.stack.indexOf(STACK_JUMP_SEPARATOR)){for(var r=[],n=t;n&&handlers.get(n);n=handlers.get(n).became)n.stack&&r.unshift(n.stack);r.unshift(e.stack);var o=r.join("\n"+STACK_JUMP_SEPARATOR+"\n");e.stack=filterStackString(o)}}function filterStackString(e){if(Q.isIntrospective)return e;for(var t=e.split("\n"),r=[],n=0;n<t.length;++n){var o=t[n];isInternalFrame(o)||isNodeFrame(o)||!o||r.push(o)}return r.join("\n")}function isNodeFrame(e){return-1!==e.indexOf("(module.js:")||-1!==e.indexOf("(node.js:")}function getFileNameAndLineNumber(e){var t=/at .+ \((.+):(\d+):(?:\d+)\)$/.exec(e);if(t)return[t[1],Number(t[2])];var r=/at ([^ ]+):(\d+):(?:\d+)$/.exec(e);if(r)return[r[1],Number(r[2])];var n=/.*@(.+):(\d+)$/.exec(e);return n?[n[1],Number(n[2])]:void 0}function isInternalFrame(e){var t=getFileNameAndLineNumber(e);if(!t)return!1;var r=t[0],n=t[1];return r===qFileName&&n>=qStartingLine&&qEndingLine>=n}function captureLine(){if(hasStacks)try{throw new Error}catch(e){var t=e.stack.split("\n"),r=t[0].indexOf("@")>0?t[1]:t[2],n=getFileNameAndLineNumber(r);if(!n)return;return qFileName=n[0],n[1]}}function deprecate(e,t,r){return function(){return"undefined"!=typeof console&&"function"==typeof console.warn&&(r?console.warn(t+" is deprecated, use "+r+" instead.",new Error("").stack):console.warn(t+" is deprecated.",new Error("").stack)),e.apply(this,arguments)}}function Q_getHandler(e){var t=handlers.get(e);return t&&t.became?(t=follow(t),handlers.set(e,t),t):t}function follow(e){return e.became?(e.became=follow(e.became),e.became):e}function Q(e){return Q_isPromise(e)?e:isThenable(e)?(thenables.has(e)||thenables.set(e,new Promise(new Thenable(e))),thenables.get(e)):new Promise(new Fulfilled(e))}function Q_reject(e){return new Promise(new Rejected(e))}function defer(){var e=new Pending,t=new Promise(e),r=new Deferred(t);if(Q.longStackSupport&&hasStacks)try{throw new Error}catch(n){t.stack=n.stack.substring(n.stack.indexOf("\n")+1)}return r}function Q_all(e){function t(){a=-1/0;for(var e=0;e<s.length;e++)s[e]>a&&(a=s[e])}if(Q_isPromise(e))return"undefined"!=typeof console&&"function"==typeof console.warn&&console.warn("Q.all no longer directly unwraps a promise. Use Q(array).all()"),Q(e).all();var r,n=0,o=defer(),i=Array(e.length),s=[],a=-1/0;return Array.prototype.forEach.call(e,function(c,l){var p;Q_isPromise(c)&&"fulfilled"===(p=Q_getHandler(c)).state?i[l]=p.value:(++n,c=Q(c),c.then(function(e){i[l]=e,0===--n&&o.resolve(i)},o.reject),c.observeEstimate(function(n){var i=s[l];s[l]=n,n>a?a=n:i===a&&a>=n&&t(),s.length===e.length&&a!==r&&(o.setEstimate(a),r=a)}))}),0===n&&o.resolve(i),o.promise}function Q_allSettled(e){return Q_isPromise(e)?("undefined"!=typeof console&&"function"==typeof console.warn&&console.warn("Q.allSettled no longer directly unwraps a promise. Use Q(array).allSettled()"),Q(e).allSettled()):Q_all(e.map(function(e){function t(){return e.inspect()}return e=Q(e),e.then(t,t)}))}function Q_spread(e,t,r){return Q(e).spread(t,r)}function Q_race(e){return new Promise(function(t){e.forEach(function(e){Q(e).then(t.resolve,t.reject)})})}function Promise_function(e){return function(){for(var t=new Array(arguments.length),r=0;r<arguments.length;r++)t[r]=arguments[r];return Q(e).apply(this,t)}}function Q_async(e){return function(){function t(e,t){var i;try{i=r[e](t)}catch(s){return Q_reject(s)}return i.done?Q(i.value):Q(i.value).then(n,o)}var r=e.apply(this,arguments),n=t.bind(t,"next"),o=t.bind(t,"throw");return n()}}function Q_spawn(e){Q_async(e)().done()}function Promise(e){if(!(this instanceof Promise))return new Promise(e);if("function"==typeof e){var t=e,r=defer();e=Q_getHandler(r.promise);try{t(r.resolve,r.reject,r.setEstimate)}catch(n){r.reject(n)}}handlers.set(this,e)}function Promise_resolve(e){return Q(e)}function Q_isPromise(e){return isObject(e)&&!!handlers.get(e)}function isThenable(e){return isObject(e)&&"function"==typeof e.then}function Promise_rethrow(e){throw e}function Deferred(e){this.promise=e,promises.set(this,e);var t=this,r=this.resolve;this.resolve=function(e){r.call(t,e)};var n=this.reject;this.reject=function(e){n.call(t,e)}}function Fulfilled(e){this.value=e,this.estimate=Date.now()}function Rejected(e){this.reason=e,this.estimate=1/0}function Pending(){this.messages=[],this.observers=[],this.estimate=1/0}function Thenable(e){this.thenable=e,this.became=null,this.estimate=1/0}function Passed(e){this.promise=e}var hasStacks=!1;try{throw new Error}catch(e){hasStacks=!!e.stack}var qStartingLine=captureLine(),qFileName,WeakMap=require("weak-map"),iterate=require("pop-iterate"),asap=require("asap"),STACK_JUMP_SEPARATOR="From previous event:",handlers=new WeakMap,theViciousCycleError=new Error("Can't resolve a promise with itself"),theViciousCycleRejection=Q_reject(theViciousCycleError),theViciousCycle=Q_getHandler(theViciousCycleRejection),thenables=new WeakMap;module.exports=Q,Q.longStackSupport=!1,Q.reject=Q_reject,Q.defer=defer,Q.when=function(e,t,r,n){return Q(e).then(t,r,n)},Q.all=Q_all,Q.allSettled=Q_allSettled,Q.delay=function(e,t){return void 0===t&&(t=e,e=void 0),Q(e).delay(t)},Q.timeout=function(e,t,r){return Q(e).timeout(t,r)},Q.spread=Q_spread,Q.join=function(e,t){return Q.spread([e,t],function(e,t){if(e===t)return e;throw new Error("Can't join: not the same: "+e+" "+t)})},Q.race=Q_race,Q.try=function(e){return Q(e).dispatch("call",[[]])},Q.function=Promise_function,Q.promised=function(e){return function(){for(var t=new Array(arguments.length),r=0;r<arguments.length;r++)t[r]=arguments[r];return Q_spread([this,Q_all(t)],function(t,r){return e.apply(t,r)})}},Q.passByCopy=Q.push=function(e){return Object(e)!==e||Q_isPromise(e)||passByCopies.set(e,!0),e},Q.isPortable=function(e){return Object(e)===e&&passByCopies.has(e)};var passByCopies=new WeakMap;Q.async=Q_async,Q.spawn=Q_spawn,Q.Promise=Promise,Promise.all=Q_all,Promise.race=Q_race,Promise.resolve=Promise_resolve,Promise.reject=Q_reject,Q.isPromise=Q_isPromise,Promise.prototype.inspect=function(){return Q_getHandler(this).inspect()},Promise.prototype.isPending=function(){return"pending"===Q_getHandler(this).state},Promise.prototype.isFulfilled=function(){return"fulfilled"===Q_getHandler(this).state},Promise.prototype.isRejected=function(){return"rejected"===Q_getHandler(this).state},Promise.prototype.toBePassed=function(){return"passed"===Q_getHandler(this).state},Promise.prototype.toString=function(){return"[object Promise]"},Promise.prototype.then=function(e,t,r){var n,o=this,i=defer();n="function"==typeof e?function(t){try{i.resolve(e.call(void 0,t))}catch(r){i.reject(r)}}:i.resolve;var s;if(s="function"==typeof t?function(e){try{i.resolve(t.call(void 0,e))}catch(r){i.reject(r)}}:i.reject,this.done(n,s),void 0!==r){var a=function(){i.setEstimate(o.getEstimate()+r)};this.observeEstimate(a),a()}return i.promise},Promise.prototype.done=function(e,t){var r=this,n=!1;asap(function(){var o;"function"==typeof e&&(o=Q.onerror?function(t){if(!n){n=!0;try{e.call(void 0,t)}catch(r){(Q.onerror||Promise_rethrow)(r)}}}:function(t){n||(n=!0,e.call(void 0,t))});var i;i="function"==typeof t&&Q.onerror?function(e){if(!n){n=!0,makeStackTraceLong(e,r);try{t.call(void 0,e)}catch(o){(Q.onerror||Promise_rethrow)(o)}}}:"function"==typeof t?function(e){n||(n=!0,makeStackTraceLong(e,r),t.call(void 0,e))}:Q.onerror||Promise_rethrow,"object"==typeof process&&process.domain&&(i=process.domain.bind(i)),Q_getHandler(r).dispatch(o,"then",[i])})},Promise.prototype.thenResolve=function(e){return e=Q(e),Q_all([this,e]).then(function(){return e},null,0)},Promise.prototype.thenReject=function(e){return this.then(function(){throw e},null,0)},Promise.prototype.all=function(){return this.then(Q_all)},Promise.prototype.allSettled=function(){return this.then(Q_allSettled)},Promise.prototype.catch=function(e){return this.then(void 0,e)},Promise.prototype.finally=function(e,t){return e?(e=Q(e),this.then(function(t){return e.call().then(function(){return t})},function(t){return e.call().then(function(){throw t})},t)):this},Promise.prototype.observeEstimate=function(e){return this.rawDispatch(null,"estimate",[e]),this},Promise.prototype.getEstimate=function(){return Q_getHandler(this).estimate},Promise.prototype.dispatch=function(e,t){var r=defer();return this.rawDispatch(r.resolve,e,t),r.promise},Promise.prototype.rawDispatch=function(e,t,r){var n=this;asap(function(){Q_getHandler(n).dispatch(e,t,r)})},Promise.prototype.get=function(e){return this.dispatch("get",[e])},Promise.prototype.invoke=function(e){for(var t=new Array(arguments.length-1),r=1;r<arguments.length;r++)t[r-1]=arguments[r];return this.dispatch("invoke",[e,t])},Promise.prototype.apply=function(e,t){return this.dispatch("call",[t,e])},Promise.prototype.call=function(e){for(var t=new Array(Math.max(0,arguments.length-1)),r=1;r<arguments.length;r++)t[r-1]=arguments[r];return this.dispatch("call",[t,e])},Promise.prototype.bind=function(e){for(var t=this,r=new Array(Math.max(0,arguments.length-1)),n=1;n<arguments.length;n++)r[n-1]=arguments[n];return function(){for(var n=r.slice(),o=0;o<arguments.length;o++)n[n.length]=arguments[o];return t.dispatch("call",[n,e])}},Promise.prototype.keys=function(){return this.dispatch("keys",[])},Promise.prototype.iterate=function(){return this.dispatch("iterate",[])},Promise.prototype.spread=function(e,t,r){return this.all().then(function(t){return e.apply(void 0,t)},t,r)},Promise.prototype.timeout=function(e,t){var r=defer(),n=setTimeout(function(){r.reject(new Error(t||"Timed out after "+e+" ms"))},e);return this.then(function(e){clearTimeout(n),r.resolve(e)},function(e){clearTimeout(n),r.reject(e)}),r.promise},Promise.prototype.delay=function(e){return this.then(function(t){var r=defer();return r.setEstimate(Date.now()+e),setTimeout(function(){r.resolve(t)},e),r.promise},null,e)},Promise.prototype.pull=function(){return this.dispatch("pull",[])},Promise.prototype.pass=function(){return this.toBePassed()?this:new Promise(new Passed(this))};var promises=new WeakMap;Deferred.prototype.resolve=function(e){var t=Q_getHandler(promises.get(this));t.messages&&t.become(Q(e))},Deferred.prototype.reject=function(e){var t=Q_getHandler(promises.get(this));t.messages&&t.become(Q_reject(e))},Deferred.prototype.setEstimate=function(e){if(e=+e,e!==e&&(e=1/0),1e12>e&&e!==-1/0)throw new Error("Estimate values should be a number of miliseconds in the future");var t=Q_getHandler(promises.get(this));t.setEstimate&&t.setEstimate(e)},Fulfilled.prototype.state="fulfilled",Fulfilled.prototype.inspect=function(){return{state:"fulfilled",value:this.value}},Fulfilled.prototype.dispatch=function(e,t,r){var n;if("then"===t||"get"===t||"call"===t||"invoke"===t||"keys"===t||"iterate"===t||"pull"===t)try{n=this[t].apply(this,r)}catch(o){n=Q_reject(o)}else if("estimate"===t)r[0].call(void 0,this.estimate);else{var i=new Error("Fulfilled promises do not support the "+t+" operator");n=Q_reject(i)}e&&e(n)},Fulfilled.prototype.then=function(){return this.value},Fulfilled.prototype.get=function(e){return this.value[e]},Fulfilled.prototype.call=function(e,t){return this.callInvoke(this.value,e,t)},Fulfilled.prototype.invoke=function(e,t){return this.callInvoke(this.value[e],t,this.value)},Fulfilled.prototype.callInvoke=function(e,t,r){for(var n,o=0;o<t.length;o++)Q_isPromise(t[o])&&t[o].toBePassed()&&(n=n||[],n.push(t[o]));if(n){var i=this;return Q_all(n).then(function(){return i.callInvoke(e,t.map(function(e){return Q_isPromise(e)&&e.toBePassed()?e.inspect().value:e}),r)})}return e.apply(r,t)},Fulfilled.prototype.keys=function(){return Object.keys(this.value)},Fulfilled.prototype.iterate=function(){return iterate(this.value)},Fulfilled.prototype.pull=function(){var e;if(Object(this.value)===this.value){e=Array.isArray(this.value)?[]:{};for(var t in this.value)e[t]=this.value[t]}else e=this.value;return Q.push(e)},Rejected.prototype.state="rejected",Rejected.prototype.inspect=function(){return{state:"rejected",reason:this.reason}},Rejected.prototype.dispatch=function(e,t,r){var n;n="then"===t?this.then(e,r[0]):this,e&&e(n)},Rejected.prototype.then=function(e,t){return t?t(this.reason):this},Pending.prototype.state="pending",Pending.prototype.inspect=function(){return{state:"pending"}},Pending.prototype.dispatch=function(e,t,r){if(this.messages.push([e,t,r]),"estimate"===t){this.observers.push(r[0]);var n=this;asap(function(){r[0].call(void 0,n.estimate)})}},Pending.prototype.become=function(e){this.became=theViciousCycle;var t=Q_getHandler(e);this.became=t,handlers.set(e,t),this.promise=void 0,this.messages.forEach(function(t){asap(function(){var r=Q_getHandler(e);r.dispatch.apply(r,t)})}),this.messages=void 0,this.observers=void 0},Pending.prototype.setEstimate=function(e){if(this.observers){var t=this;t.estimate=e,this.observers.forEach(function(t){asap(function(){t.call(void 0,e)})})}},Thenable.prototype.state="thenable",Thenable.prototype.inspect=function(){return{state:"pending"}},Thenable.prototype.cast=function(){if(!this.became){var e=defer(),t=this.thenable;asap(function(){try{t.then(e.resolve,e.reject)}catch(r){e.reject(r)}}),this.became=Q_getHandler(e.promise)}return this.became},Thenable.prototype.dispatch=function(e,t,r){this.cast().dispatch(e,t,r)},Passed.prototype.state="passed",Passed.prototype.inspect=function(){return this.promise.inspect()},Passed.prototype.dispatch=function(e,t,r){return this.promise.rawDispatch(e,t,r)},Q.ninvoke=function(e,t){for(var r=new Array(Math.max(0,arguments.length-1)),n=2;n<arguments.length;n++)r[n-2]=arguments[n];var o=Q.defer();return r[n-2]=o.makeNodeResolver(),Q(e).dispatch("invoke",[t,r]).catch(o.reject),o.promise},Promise.prototype.ninvoke=function(e){for(var t=new Array(arguments.length),r=1;r<arguments.length;r++)t[r-1]=arguments[r];var n=Q.defer();return t[r-1]=n.makeNodeResolver(),this.dispatch("invoke",[e,t]).catch(n.reject),n.promise},Q.denodeify=function(e,t){return function(){for(var r=new Array(arguments.length+1),n=0;n<arguments.length;n++)r[n]=arguments[n];var o=Q.defer();return r[n]=o.makeNodeResolver(t),Q(e).apply(this,r).catch(o.reject),o.promise}},Deferred.prototype.makeNodeResolver=function(e){var t=this.resolve;return e===!0?function(e){if(e)t(Q_reject(e));else{for(var r=new Array(Math.max(0,arguments.length-1)),n=1;n<arguments.length;n++)r[n-1]=arguments[n];t(r)}}:e?function(r){if(r)t(Q_reject(r));else{for(var n={},o=0;o<e.length;o++)n[e[o]]=arguments[o+1];t(n)}}:function(e,r){t(e?Q_reject(e):r)}},Promise.prototype.nodeify=function(e){return e?void this.done(function(t){e(null,t)},e):this},Q.nextTick=deprecate(asap,"nextTick","asap package"),Q.resolve=deprecate(Q,"resolve","Q"),Q.fulfill=deprecate(Q,"fulfill","Q"),Q.isPromiseAlike=deprecate(isThenable,"isPromiseAlike","(not supported)"),Q.fail=deprecate(function(e,t){return Q(e).catch(t)},"Q.fail","Q(value).catch"),Q.fin=deprecate(function(e,t){return Q(e).finally(t)},"Q.fin","Q(value).finally"),Q.progress=deprecate(function(e){return e},"Q.progress","no longer supported"),Q.thenResolve=deprecate(function(e,t){return Q(e).thenResolve(t)},"thenResolve","Q(value).thenResolve"),Q.thenReject=deprecate(function(e,t){return Q(e).thenResolve(t)},"thenResolve","Q(value).thenResolve"),Q.isPending=deprecate(function(e){return Q(e).isPending()},"isPending","Q(value).isPending"),Q.isFulfilled=deprecate(function(e){return Q(e).isFulfilled()},"isFulfilled","Q(value).isFulfilled"),Q.isRejected=deprecate(function(e){return Q(e).isRejected()},"isRejected","Q(value).isRejected"),Q.master=deprecate(function(e){return e},"master","no longer necessary"),Q.makePromise=function(){throw new Error("makePromise is no longer supported")},Q.dispatch=deprecate(function(e,t,r){return Q(e).dispatch(t,r)},"dispatch","Q(value).dispatch"),Q.get=deprecate(function(e,t){return Q(e).get(t)},"get","Q(value).get"),Q.keys=deprecate(function(e){return Q(e).keys()},"keys","Q(value).keys"),Q.post=deprecate(function(e,t,r){return Q(e).post(t,r)},"post","Q(value).invoke (spread arguments)"),Q.mapply=deprecate(function(e,t,r){return Q(e).post(t,r)},"post","Q(value).invoke (spread arguments)"),Q.send=deprecate(function(e,t){return Q(e).post(t,Array.prototype.slice.call(arguments,2))},"send","Q(value).invoke"),Q.set=function(){throw new Error("Q.set no longer supported")},Q.delete=function(){throw new Error("Q.delete no longer supported")},Q.nearer=deprecate(function(e){return Q_isPromise(e)&&e.isFulfilled()?e.inspect().value:e},"nearer","inspect().value (+nuances)"),Q.fapply=deprecate(function(e,t){return Q(e).dispatch("call",[t])},"fapply","Q(callback).apply(thisp, args)"),Q.fcall=deprecate(function(e){return Q(e).dispatch("call",[Array.prototype.slice.call(arguments,1)])},"fcall","Q(callback).call(thisp, ...args)"),Q.fbind=deprecate(function(e){var t=Q(e),r=Array.prototype.slice.call(arguments,1);return function(){return t.dispatch("call",[r.concat(Array.prototype.slice.call(arguments)),this])}},"fbind","bind with thisp"),Q.promise=deprecate(Promise,"promise","Promise"),Promise.prototype.fapply=deprecate(function(e){return this.dispatch("call",[e])},"fapply","apply with thisp"),Promise.prototype.fcall=deprecate(function(){return this.dispatch("call",[Array.prototype.slice.call(arguments)])},"fcall","try or call with thisp"),Promise.prototype.fail=deprecate(function(e){return this.catch(e)},"fail","catch"),Promise.prototype.fin=deprecate(function(e){return this.finally(e)},"fin","finally"),Promise.prototype.set=function(){throw new Error("Promise set no longer supported")},Promise.prototype.delete=function(){throw new Error("Promise delete no longer supported")},Deferred.prototype.notify=deprecate(function(){},"notify","no longer supported"),Promise.prototype.progress=deprecate(function(){return this},"progress","no longer supported"),Promise.prototype.mapply=deprecate(function(e,t){return this.dispatch("invoke",[e,t])},"mapply","invoke"),Promise.prototype.fbind=deprecate(function(){return Q.fbind.apply(Q,[void 0].concat(Array.prototype.slice.call(arguments)))},"fbind","bind(thisp, ...args)"),Promise.prototype.send=deprecate(function(){return this.dispatch("invoke",[name,Array.prototype.slice.call(arguments,1)])},"send","invoke"),Promise.prototype.mcall=deprecate(function(){return this.dispatch("invoke",[name,Array.prototype.slice.call(arguments,1)])},"mcall","invoke"),Promise.prototype.passByCopy=deprecate(function(e){return e},"passByCopy","Q.passByCopy"),Q.nfapply=deprecate(function(e,t){var r=Q.defer(),n=Array.prototype.slice.call(t);return n.push(r.makeNodeResolver()),Q(e).apply(this,n).catch(r.reject),r.promise},"nfapply"),Promise.prototype.nfapply=deprecate(function(e){return Q.nfapply(this,e)},"nfapply"),Q.nfcall=deprecate(function(e){var t=Array.prototype.slice.call(arguments,1);return Q.nfapply(e,t)},"nfcall"),Promise.prototype.nfcall=deprecate(function(){for(var e=new Array(arguments.length),t=0;t<arguments.length;t++)e[t]=arguments[t];return Q.nfapply(this,e)},"nfcall"),Q.nfbind=deprecate(function(e){var t=Array.prototype.slice.call(arguments,1);return function(){var r=t.concat(Array.prototype.slice.call(arguments)),n=Q.defer();return r.push(n.makeNodeResolver()),Q(e).apply(this,r).catch(n.reject),n.promise}},"nfbind","denodeify (with caveats)"),Promise.prototype.nfbind=deprecate(function(){for(var e=new Array(arguments.length),t=0;t<arguments.length;t++)e[t]=arguments[t];return Q.nfbind(this,e)},"nfbind","denodeify (with caveats)"),Q.nbind=deprecate(function(e,t){var r=Array.prototype.slice.call(arguments,2);return function(){function n(){return e.apply(t,arguments)}var o=r.concat(Array.prototype.slice.call(arguments)),i=Q.defer();return o.push(i.makeNodeResolver()),Q(n).apply(this,o).catch(i.reject),i.promise}},"nbind","denodeify (with caveats)"),Q.npost=deprecate(function(e,t,r){var n=Q.defer();return r.push(n.makeNodeResolver()),Q(e).dispatch("invoke",[t,r]).catch(n.reject),n.promise},"npost","ninvoke (with spread arguments)"),Promise.prototype.npost=deprecate(function(e,t){return Q.npost(this,e,t)},"npost","Q.ninvoke (with caveats)"),Q.nmapply=deprecate(Q.nmapply,"nmapply","q/node nmapply"),Promise.prototype.nmapply=deprecate(Promise.prototype.npost,"nmapply","Q.nmapply"),Q.nsend=deprecate(Q.ninvoke,"nsend","q/node ninvoke"),Q.nmcall=deprecate(Q.ninvoke,"nmcall","q/node ninvoke"),Promise.prototype.nsend=deprecate(Promise.prototype.ninvoke,"nsend","q/node ninvoke"),Promise.prototype.nmcall=deprecate(Promise.prototype.ninvoke,"nmcall","q/node ninvoke");var qEndingLine=captureLine();