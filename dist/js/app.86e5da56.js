(function(t){function e(e){for(var n,i,u=e[0],l=e[1],c=e[2],p=0,d=[];p<u.length;p++)i=u[p],Object.prototype.hasOwnProperty.call(a,i)&&a[i]&&d.push(a[i][0]),a[i]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(t[n]=l[n]);s&&s(e);while(d.length)d.shift()();return o.push.apply(o,c||[]),r()}function r(){for(var t,e=0;e<o.length;e++){for(var r=o[e],n=!0,u=1;u<r.length;u++){var l=r[u];0!==a[l]&&(n=!1)}n&&(o.splice(e--,1),t=i(i.s=r[0]))}return t}var n={},a={app:0},o=[];function i(e){if(n[e])return n[e].exports;var r=n[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=t,i.c=n,i.d=function(t,e,r){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(r,n,function(e){return t[e]}.bind(null,n));return r},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/mthebot/";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],l=u.push.bind(u);u.push=e,u=u.slice();for(var c=0;c<u.length;c++)e(u[c]);var s=l;o.push([0,"chunk-vendors"]),r()})({0:function(t,e,r){t.exports=r("56d7")},"56d7":function(t,e,r){"use strict";r.r(e);r("e260"),r("e6cf"),r("cca6"),r("a79d");var n=r("2b0e"),a=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-app",[r("v-app-bar",{attrs:{app:"","clipped-left":"",dense:"",flat:"",color:"primary"}},[r("div",{staticClass:"d-flex align-center"},[r("app-bar-header")],1)]),r("v-navigation-drawer",{attrs:{clipped:"",app:""}},[r("v-list",t._l(t.sidebarItems,(function(e){return r("v-list-item",{key:e.title,attrs:{link:"",href:e.route}},[r("v-list-item-content",[r("v-list-item-title",[t._v(t._s(e.title))])],1)],1)})),1)],1),r("v-content",[r("router-view")],1)],1)},o=[],i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"appHeader"},on:{click:t.goHome}},[n("v-img",{staticClass:"shrink mr-2",attrs:{alt:"MtheBot_ Logo",contain:"",src:r("cf05"),transition:"scale-transition",width:"30"}}),n("v-toolbar-title",[t._v("MtheBot_")])],1)},u=[],l={name:"app-bar-header",methods:{goHome:function(){"/"!==this.$router.currentRoute.path&&this.$router.push({path:"/"})}}},c=l,s=(r("7eba"),r("2877")),p=r("6544"),d=r.n(p),f=r("adda"),b=r("2a7f"),v=Object(s["a"])(c,i,u,!1,null,null,null),h=v.exports;d()(v,{VImg:f["a"],VToolbarTitle:b["a"]});var m={name:"App",components:{AppBarHeader:h},data:function(){return{sidebarItems:[{title:"Dashboard",route:"/dashboard"},{title:"About",route:"/about"}]}}},g=m,y=r("7496"),_=r("40dc"),w=r("a75b"),O=r("8860"),j=r("da13"),x=r("5d23"),V=r("f774"),k=Object(s["a"])(g,a,o,!1,null,null,null),P=k.exports;d()(k,{VApp:y["a"],VAppBar:_["a"],VContent:w["a"],VList:O["a"],VListItem:j["a"],VListItemContent:x["a"],VListItemTitle:x["b"],VNavigationDrawer:V["a"]});var T=r("f309");n["a"].use(T["a"]);var C=new T["a"]({}),I=r("8c4f"),M=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-container",[t._v(" Content TODO ")])},$=[],A={name:"Dashboard",data:function(){return{}}},L=A,S=r("a523"),B=Object(s["a"])(L,M,$,!1,null,null,null),D=B.exports;d()(B,{VContainer:S["a"]}),n["a"].use(I["a"]);var H=[{path:"/",redirect:"/dashboard"},{path:"/dashboard",component:D},{path:"/about",redirect:"/dashboard"}],E=new I["a"]({mode:"history",routes:H});n["a"].config.productionTip=!1,new n["a"]({render:function(t){return t(P)},vuetify:C,router:E,components:{}}).$mount("#app")},"7eba":function(t,e,r){"use strict";var n=r("bdb7"),a=r.n(n);a.a},bdb7:function(t,e,r){},cf05:function(t,e,r){t.exports=r.p+"img/logo.cf3c5491.png"}});
//# sourceMappingURL=app.86e5da56.js.map