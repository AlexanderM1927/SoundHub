(function(e){function t(t){for(var o,r,i=t[0],c=t[1],s=t[2],u=0,d=[];u<i.length;u++)r=i[u],Object.prototype.hasOwnProperty.call(a,r)&&a[r]&&d.push(a[r][0]),a[r]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(e[o]=c[o]);p&&p(t);while(d.length)d.shift()();return l.push.apply(l,s||[]),n()}function n(){for(var e,t=0;t<l.length;t++){for(var n=l[t],o=!0,r=1;r<n.length;r++){var i=n[r];0!==a[i]&&(o=!1)}o&&(l.splice(t--,1),e=c(c.s=n[0]))}return e}var o={},r={3:0},a={3:0},l=[];function i(e){return c.p+"js/"+({1:"chunk-common"}[e]||e)+"."+{1:"519e69af",2:"997452e7",4:"7cf53477",5:"a13371c7",6:"01fc0349",7:"d20ce409",8:"4c5cd03e",9:"46340489",10:"4e675f3f",11:"11e4c769",12:"3deb26bf",13:"4f80595b",14:"9c52a1fa"}[e]+".js"}function c(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.e=function(e){var t=[],n={1:1,2:1,4:1,5:1,6:1,7:1,8:1,9:1,10:1,11:1,12:1,13:1};r[e]?t.push(r[e]):0!==r[e]&&n[e]&&t.push(r[e]=new Promise((function(t,n){for(var o="css/"+({1:"chunk-common"}[e]||e)+"."+{1:"d7e38300",2:"93e2e15a",4:"583596d6",5:"6d3e905f",6:"94ac0baf",7:"7a0be411",8:"b9378610",9:"21eb147b",10:"a4c08e14",11:"c6d18af1",12:"998eb30a",13:"a9caf52f",14:"31d6cfe0"}[e]+".css",a=c.p+o,l=document.getElementsByTagName("link"),i=0;i<l.length;i++){var s=l[i],u=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(u===o||u===a))return t()}var d=document.getElementsByTagName("style");for(i=0;i<d.length;i++){s=d[i],u=s.getAttribute("data-href");if(u===o||u===a)return t()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=t,p.onerror=function(t){var o=t&&t.target&&t.target.src||a,l=new Error("Loading CSS chunk "+e+" failed.\n("+o+")");l.code="CSS_CHUNK_LOAD_FAILED",l.request=o,delete r[e],p.parentNode.removeChild(p),n(l)},p.href=a;var m=document.getElementsByTagName("head")[0];m.appendChild(p)})).then((function(){r[e]=0})));var o=a[e];if(0!==o)if(o)t.push(o[2]);else{var l=new Promise((function(t,n){o=a[e]=[t,n]}));t.push(o[2]=l);var s,u=document.createElement("script");u.charset="utf-8",u.timeout=120,c.nc&&u.setAttribute("nonce",c.nc),u.src=i(e);var d=new Error;s=function(t){u.onerror=u.onload=null,clearTimeout(p);var n=a[e];if(0!==n){if(n){var o=t&&("load"===t.type?"missing":t.type),r=t&&t.target&&t.target.src;d.message="Loading chunk "+e+" failed.\n("+o+": "+r+")",d.name="ChunkLoadError",d.type=o,d.request=r,n[1](d)}a[e]=void 0}};var p=setTimeout((function(){s({type:"timeout",target:u})}),12e4);u.onerror=u.onload=s,document.head.appendChild(u)}return Promise.all(t)},c.m=e,c.c=o,c.d=function(e,t,n){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)c.d(n,o,function(t){return e[t]}.bind(null,o));return n},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="/",c.oe=function(e){throw console.error(e),e};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],u=s.push.bind(s);s.push=t,s=s.slice();for(var d=0;d<s.length;d++)t(s[d]);var p=u;l.push([0,0]),n()})({0:function(e,t,n){e.exports=n("2f39")},"034f":function(e,t,n){"use strict";n("ed82")},"2f39":function(e,t,n){"use strict";n.r(t);var o={};n.r(o),n.d(o,"setSearchResults",(function(){return k})),n.d(o,"setSearchText",(function(){return j})),n.d(o,"setLoading",(function(){return N})),n.d(o,"setSong",(function(){return x})),n.d(o,"setSongOnPlaylist",(function(){return I})),n.d(o,"setPosOnPlaylist",(function(){return L})),n.d(o,"reloadPlaylist",(function(){return T}));var r={};n.r(r),n.d(r,"getItemsByName",(function(){return B})),n.d(r,"getSongById",(function(){return C})),n.d(r,"getSongByUrl",(function(){return E})),n.d(r,"setPosition",(function(){return M})),n.d(r,"reloadPlaylist",(function(){return q}));var a={};n.r(a),n.d(a,"addChats",(function(){return D})),n.d(a,"addNotification",(function(){return J})),n.d(a,"removeNotification",(function(){return U}));var l={};n.r(l),n.d(l,"addChats",(function(){return V})),n.d(l,"addNotification",(function(){return H})),n.d(l,"removeNotification",(function(){return $}));n("e6cf"),n("ddb0"),n("5319"),n("7d6e"),n("e54f"),n("985d"),n("31cd");var i=n("2b0e"),c=n("1f91"),s=n("42d2"),u=n("b05d"),d=n("2a19"),p=n("436b"),m=n("f508");i["a"].use(u["a"],{config:{},lang:c["a"],iconSet:s["a"],plugins:{Notify:d["a"],Dialog:p["a"],Loading:m["a"]}});var f=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"q-app"}},[n("router-view")],1)},h=[],g={name:"App"},b=g,y=(n("034f"),n("2877")),v=Object(y["a"])(b,f,h,!1,null,null,null),P=v.exports,S=n("2f62"),w=function(){return{searchResults:null,loading:!1,searchText:"",song:null,playlist:[],position:1}},O=n("eead");const k=(e,t)=>{e.searchResults=t},j=(e,t)=>{e.searchText=t},N=(e,t)=>{e.loading=t},x=(e,t)=>{e.song=t},I=(e,t)=>{e.playlist.push(t)},L=(e,t)=>{e.position=t},T=e=>{e.playlist=[],e.position=0,e.song=null};var _=n("b14c");const B=async({commit:e},t)=>{try{e("setLoading",!0);const n=await _["a"].getItemsByName(t);return e("setSearchResults",n.data.data.items),e("setSearchText",t.name),e("setLoading",!1),n}catch(n){console.log(n),e("setLoading",!1)}},C=({commit:e},t)=>{try{const n=_["a"].getSongById(t);return t.isFirstOnPlaylist&&e("setSongOnPlaylist",{url:n,payload:t}),t.playlistMode?e("setSongOnPlaylist",{url:n,payload:t}):e("setSong",{url:n,payload:t}),n}catch(n){console.log(n)}},E=({commit:e},t)=>{try{t.isFirstOnPlaylist&&e("setSongOnPlaylist",{url:t.url,payload:t}),t.playlistMode?e("setSongOnPlaylist",{url:t.url,payload:t}):e("setSong",{url:t.url,payload:t})}catch(n){console.log(n)}},M=({commit:e},t)=>{try{e("setPosOnPlaylist",t)}catch(n){console.log(n)}},q=({commit:e})=>{try{e("reloadPlaylist")}catch(t){console.log(t)}};var A={namespaced:!0,state:w,getters:O,mutations:o,actions:r},R=function(){return{chats:[],notifications:[]}},F=n("bd34");const D=(e,t)=>{e.chats.push(t)},J=(e,t)=>{e.notifications.push(t)},U=(e,t)=>{const n=e.notifications.indexOf(t);e.notifications.splice(n)},V=({commit:e},t)=>{try{e("addChats",t)}catch(n){console.log(n)}},H=({commit:e},t)=>{try{e("addNotification",t)}catch(n){console.log(n)}},$=({commit:e},t)=>{try{e("removeNotification",t)}catch(n){console.log(n)}};var K={namespaced:!0,state:R,getters:F,mutations:a,actions:l};i["a"].use(S["a"]);var Q=function(){const e=new S["a"].Store({modules:{sounds:A,chat:K},strict:!1});return e},z=n("8c4f");const G=[{path:"/",component:()=>Promise.all([n.e(0),n.e(1),n.e(2)]).then(n.bind(null,"713b")),children:[{name:"home",path:"",component:()=>Promise.all([n.e(0),n.e(1),n.e(4)]).then(n.bind(null,"8b24")),meta:{title:"SoundHub"}}]},{path:"/login",component:()=>Promise.all([n.e(0),n.e(1),n.e(2)]).then(n.bind(null,"713b")),children:[{name:"login",path:"",component:()=>Promise.all([n.e(0),n.e(1),n.e(7)]).then(n.bind(null,"013f")),meta:{title:"Login"}},{name:"recovery",path:"/recovery",component:()=>Promise.all([n.e(0),n.e(13)]).then(n.bind(null,"afad")),meta:{title:"Recovery"}}]},{path:"/profile",component:()=>Promise.all([n.e(0),n.e(1),n.e(2)]).then(n.bind(null,"713b")),children:[{name:"myprofile",path:"",props:{notmyprofile:!1},component:()=>Promise.all([n.e(0),n.e(1),n.e(10)]).then(n.bind(null,"756b")),meta:{title:"Profile"}}]},{path:"/profile/:id",component:()=>Promise.all([n.e(0),n.e(1),n.e(2)]).then(n.bind(null,"713b")),children:[{name:"profile",path:"/profile/:id",props:{notmyprofile:!0},component:()=>Promise.all([n.e(0),n.e(1),n.e(12)]).then(n.bind(null,"2ff9")),meta:{title:"Profile"}}]},{path:"/search/:name",component:()=>Promise.all([n.e(0),n.e(1),n.e(2)]).then(n.bind(null,"713b")),children:[{name:"search",path:"",component:()=>Promise.all([n.e(0),n.e(1),n.e(6)]).then(n.bind(null,"5c65")),meta:{title:"Search"}}]},{path:"/sound",component:()=>Promise.all([n.e(0),n.e(1),n.e(2)]).then(n.bind(null,"713b")),children:[{name:"sound",path:"",component:()=>Promise.all([n.e(0),n.e(1),n.e(5)]).then(n.bind(null,"d017")),meta:{title:"My songs"}}]},{path:"/favoritos",component:()=>Promise.all([n.e(0),n.e(1),n.e(2)]).then(n.bind(null,"713b")),children:[{name:"Favoritos",path:"",component:()=>Promise.all([n.e(0),n.e(1),n.e(9)]).then(n.bind(null,"65f4")),meta:{title:"My Favorites",requireSession:!0}}]},{path:"/playlist",component:()=>Promise.all([n.e(0),n.e(1),n.e(2)]).then(n.bind(null,"713b")),children:[{name:"playlist",path:"",component:()=>Promise.all([n.e(0),n.e(1)]).then(n.bind(null,"098e")),meta:{title:"My playlists",requireSession:!0}}]},{path:"/playlist/:playlist_id",component:()=>Promise.all([n.e(0),n.e(1),n.e(2)]).then(n.bind(null,"713b")),children:[{name:"playlist-profile",path:"",component:()=>Promise.all([n.e(0),n.e(1),n.e(11)]).then(n.bind(null,"9447")),meta:{title:"Playlist"}}]},{name:"facebook",path:"/facebook/:token/:user",meta:{title:"Login facebook"},props:e=>({token:e.params.token,user:JSON.parse(e.params.user)})},{path:"/chat",component:()=>Promise.all([n.e(0),n.e(1),n.e(2)]).then(n.bind(null,"713b")),children:[{name:"chat",path:"",component:()=>Promise.all([n.e(0),n.e(1),n.e(8)]).then(n.bind(null,"ab55")),meta:{title:"My chats",requireSession:!0}}]},{name:"logout",path:"/logout",meta:{title:"Logout",requireSession:!0}},{path:"*",component:()=>Promise.all([n.e(0),n.e(14)]).then(n.bind(null,"e51e"))}];var W=G;i["a"].use(z["a"]);var X=function(){const e=new z["a"]({scrollBehavior:()=>({x:0,y:0}),routes:W,mode:"history",base:"/"});return e.beforeEach((async(e,t,n)=>{if(document.title=e.meta.title,"logout"===e.name){try{localStorage.removeItem("user"),localStorage.removeItem("token")}catch(r){localStorage.removeItem("user"),localStorage.removeItem("token")}location.href="login"}"facebook"===e.name&&(localStorage.setItem("user",e.matched.some((e=>e.props.user))),localStorage.setItem("token",e.matched.some((e=>e.props.token))),location.href="/");const o=e.matched.some((e=>e.meta.requireSession));o?localStorage.getItem("token")?n():location.href="login":"login"===e.name&&localStorage.getItem("token")?location.href="/":n()})),e},Y=async function(){const e="function"===typeof Q?await Q({Vue:i["a"]}):Q,t="function"===typeof X?await X({Vue:i["a"],store:e}):X;e.$router=t;const n={router:t,store:e,render:e=>e(P),el:"#q-app"};return{app:n,store:e,router:t}},Z=n("9483");Object(Z["a"])("/service-worker.js",{ready(){},registered(){},cached(){},updatefound(){},updated(){},offline(){},error(){}});var ee=n("758b");/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream&&window.navigator.standalone&&n.e(0).then(n.t.bind(null,"a0db",7));const te="/";async function ne(){const{app:e,store:t,router:n}=await Y();let o=!1;const r=e=>{o=!0;const t=Object(e)===e?n.resolve(e).route.fullPath:e;window.location.href=t},a=window.location.href.replace(window.location.origin,""),l=[ee["a"]];for(let s=0;!1===o&&s<l.length;s++)if("function"===typeof l[s])try{await l[s]({app:e,router:n,store:t,Vue:i["a"],ssrContext:null,redirect:r,urlPath:a,publicPath:te})}catch(c){return c&&c.url?void(window.location.href=c.url):void console.error("[Quasar] boot error:",c)}!0!==o&&new i["a"](e)}ne()},"31cd":function(e,t,n){},"758b":function(e,t,n){"use strict";var o=n("bc3a"),r=n.n(o);t["a"]=()=>r.a.create({baseURL:"https://soundhubback.soft-corp.online/v1/"})},b14c:function(e,t,n){"use strict";var o=n("758b");t["a"]={getItemsByName(e){return Object(o["a"])().get("search/"+e.name)},getSongById(e){return"https://soundhubback.soft-corp.online/v1/download/"+e.type+"/"+e.url},download(e){return Object(o["a"])().get("download/"+e.type+"/"+e.url,{responseType:"blob"})}}},bd34:function(e,t){},ed82:function(e,t,n){},eead:function(e,t){}});