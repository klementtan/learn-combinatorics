(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{MZhU:function(D,u,e){D.exports={main:"main___3ipCw"}},"wn4/":function(D,u,e){"use strict";e.r(u);var h=e("o0o1"),i=e.n(h),U=e("VTBJ"),M=e("HaE+"),T=e("ODXe"),x=e("fOrg"),I=e("+KLJ"),l=e("nKUr"),S=e.n(l),g=e("q1tI"),G=e.n(g),E=e("9kvl"),J=e("anxO"),b=e("MZhU"),v=e.n(b),O=e("3HZZ"),Z=e.n(O),j=e("s4NR"),N=e.n(j),B=e("Qyje"),C=e.n(B),$=function(n){var t=n.content;return Object(l.jsx)(I.a,{style:{marginBottom:24},message:t,type:"error",showIcon:!0})},d=function(n){console.log(n)},K=function(n){var t=n.userLogin,f=t===void 0?{}:t,F=n.submitting,H=f.status,Q=f.type,p=Object(g.useState)("profile"),P=Object(T.a)(p,2),V=P[0],X=P[1],k=Object(E.e)(),A=Object(O.useGoogleLogout)({clientId:"608775942205-ag865bismt1ojrhi01r7kjk13hctmlk0.apps.googleusercontent.com",onLogoutSuccess:d,onFailure:d}),R=A.signOut,L=C.a.parse(n.location.search,{ignoreQueryPrefix:!0}).action==="logout";Object(g.useEffect)(function(){L&&y()},[]);var W=function(){var m=Object(M.a)(i.a.mark(function o(a){var c;return i.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return c=n.dispatch,r.next=3,c({type:"login/login",payload:Object(U.a)({},a)});case 3:return r.next=5,c({type:"user/fetchCurrent"});case 5:E.c.push("/");case 6:case"end":return r.stop()}},o)}));return function(a){return m.apply(this,arguments)}}(),y=function(){var m=Object(M.a)(i.a.mark(function o(){var a;return i.a.wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return R(),a=n.dispatch,s.next=4,a({type:"login/logout",payload:{}});case 4:case"end":return s.stop()}},o)}));return function(){return m.apply(this,arguments)}}();return Object(l.jsx)("div",{className:v.a.main,children:Object(l.jsx)(O.GoogleLogin,{isSignedIn:!L,className:v.a.button,clientId:"608775942205-ag865bismt1ojrhi01r7kjk13hctmlk0.apps.googleusercontent.com",buttonText:"Login With Google",onSuccess:W,onFailure:d})})};u.default=Object(E.b)(function(_){var n=_.login,t=_.loading;return{userLogin:n,submitting:t.effects["login/login"]}})(K)}}]);
