(this["webpackJsonppokidex-app"]=this["webpackJsonppokidex-app"]||[]).push([[0],{75:function(e,t,a){},76:function(e,t,a){"use strict";a.r(t);var r=a(1),n=a(6),s=a(11),i=a(12),c=a(23),o=a(16),d=a(17),l=a(0),u=a.n(l),h=a(25),j=a.n(h),m=a(84),b=a(22),p=a(7),f=a(42),O=a(78),x=a(79),v=a(80);a(62);var g=function(e){Object(o.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(s.a)(this,a),(r=t.call(this,e)).state={image:null},r}return Object(i.a)(a,[{key:"takePhoto",value:function(e){var t;(t=e,new Promise((function(e,a){if(null==t)return a();var r=document.createElement("canvas"),n=r.getContext("2d"),s=new Image;s.addEventListener("load",(function(){r.width=s.width,r.height=s.height,n.drawImage(s,0,0,r.width,r.height),e(cv.imread(r))})),s.src=t}))).then((function(e){console.log(e)}))}},{key:"render",value:function(){var e=this;return Object(r.jsx)(p.a,{exact:!0,path:"/scanner",render:function(t){var a=t.history;return Object(r.jsxs)(O.a,{className:"mt-4",children:[Object(r.jsx)(x.a,{children:Object(r.jsx)(v.a,{className:"rounded-pill px-4",onClick:function(){return a.push("/profile")},children:"Profile"})}),Object(r.jsx)(x.a,{children:Object(r.jsx)(f.Camera,{idealFacingMode:f.FACING_MODES.ENVIRONMENT,idealResolution:{width:640,height:480},imageCompression:.97,isMaxResolution:!1,isImageMirror:!1,isSilentMode:!0,isDisplayStartCameraError:!0,isFullscreen:!1,sizeFactor:1,onTakePhoto:e.takePhoto})})]})}})}}]),a}(u.a.Component),y=a(30),C=a(56);var N=function(){function e(t){Object(s.a)(this,e),this.time=0;var a=1;t&&(t.milliseconds&&(this.time+=t.milliseconds*a),a*=1e3,t.seconds&&(this.time+=t.seconds*a),a*=60,t.minutes&&(this.time+=t.minutes*a),a*=60,t.hours&&(this.time+=t.hours*a),a*=24,t.days&&(this.time+=t.days*a))}return Object(i.a)(e,[{key:"toObj",value:function(){var e={},t=this.time;return e.milliseconds=t%1e3,t=Math.floor(t/1e3),e.seconds=t%60,t=Math.floor(t/60),e.minutes=t%60,t=Math.floor(t/60),e.hours=t%24,t=Math.floor(t/24),e.days=t,e}},{key:"addToDateObj",value:function(e){e.setTime(e.getTime()+this.time)}},{key:"addInterval",value:function(t){return new e({milliseconds:this.time+t.time})}},{key:"toString",value:function(){var e="",t=this.toObj();return t.days>0&&(e+=t.days.toString()+"days "),t.hours>0&&(e+=t.hours.toString()+"hrs "),t.minutes>0&&(e+=t.hours.toString()+"mins "),t.seconds>0&&(e+=t.seconds.toString()+"secs "),e}}]),e}(),k=(Error,/\$(([1-9]\d{0,2}(,\d{3})*)|(([1-9]\d*)?\d))(\.\d\d)/),w=/^\D*([\d])/,S=new N({days:3}),E=/^[a-zA-Z ]*$/,D=/^(\d{1,3})[/](\d{1,3})$/,P=/^(\d{1,3})$/,T=/^[A-Z]*(\d{1,3})$/,U={cardName:function(e){return e?e.match(E)?void 0:new Error("Card Name can't have numbers or other characters"):new Error("Card Name is required")},id:function(e){try{L._parseId(e)}catch(t){return t}return null},quantity:function(e){if(!e)return new Error("Quantity is required");if(!e.match(/^\d*$/))return new Error("Quantity must be a number");var t=Number(e);return Number.isInteger(t)?t<1?new Error("Quantity must be greater than or equal to 1"):void 0:new Error("Quantity must be an integer number")}};function F(e,t){var a=e;Object.keys(t).length>0&&(a+="?");for(var r=0,n=Object.entries(t);r<n.length;r++){var s=Object(y.a)(n[r],2),i=s[0],c=s[1];a+=i+"=",a+=encodeURI(c)+"&"}return a=a.substring(0,a.length-1)}var L=function(){function e(t,a,r,n,i){Object(s.a)(this,e),this.cardName=t,this.id=a,this.number=r,this.quantity=i,this.secondNumber=n,this.lastUpdated=null,this.costEstimate=null,this.highValue=null,this.lowValue=null,this.artist=null,this.imageUrl=null}return Object(i.a)(e,[{key:"toString",value:function(){return this.cardName+" "+String(this.id)}},{key:"updatedSinceString",value:function(){return"Last Updated "+new N({milliseconds:(new Date).getTime()-this.lastUpdated.getTime()}).toString()+" ago"}},{key:"updateData",value:function(){return new Promise(function(e,t){var a=this;Promise.all([this._updateCardData(),this._updateCostData()]).then((function(t){a.lastUpdated=new Date,e(a)})).catch((function(e){return t(e)}))}.bind(this))}},{key:"_updateCardData",value:function(){var e=this,t=F("https://api.pokemontcg.io/v1/cards",{name:this.cardName,number:Number(this.number).toString()});return fetch(t).then((function(e){return e.text()})).then((function(e){return JSON.parse(e)})).then((function(t){if(t.cards.length>0){var a=t.cards[0];e.artist=a.artist,e.imageUrl=a.imageUrl}}))}},{key:"_updateCostData",value:function(){var e=this,t=F("https://cors-anywhere.herokuapp.com/https://mavin.io/search",{q:this.cardName+" "+this.id,bt:"sold"});return fetch(t).then((function(e){return e.text()})).then((function(e){return(new DOMParser).parseFromString(e,"text/html")})).then((function(t){var a,r=t.scripts;for(a=0;a<r.length;a++)if("application/ld+json"===r[a].type){var n=JSON.parse(r[a].textContent);if(Array.isArray(n)&&(n=n[0]),"ProductGroup"===n["@type"]){var s=n.description.match(k)[0];e.costEstimate=Number(s.substr(1,s.length)),e.lowValue=Number(n.offers.lowPrice),e.highValue=Number(n.offers.highPrice)}if("Article"===n["@type"]){var i=n.articleBody.match(w);if(i&&0===Number(i[1]))throw new Error("Zero Sold Results Found")}}}))}}],[{key:"fromObj",value:function(t){var a=Object.assign(new e,t);return a.lastUpdated=new Date(a.lastUpdated),a}},{key:"_parseId",value:function(e){if(!e)throw new Error("Card Numbers is required");var t=e.match(D),a=e.match(P),r=e.match(T),n=null,s=null;if(t){if(Number(t[1])>Number(t[2]))throw new Error("Card Numbers must be in order i.e. firstNum <= secondNum");n=t[1],s=t[2]}else if(a)n=a[1];else{if(!r)throw new Error("Card Numbers must be in the form of 'num/num' or 'num' or '<packname><num>'");n=r[1]}return[n,s]}},{key:"parseEntries",value:function(t,a,r){var n=U.cardName(t);if(n)throw n;var s=e._parseId(a),i=Object(y.a)(s,2),c=i[0],o=i[1],d=U.quantity(r);if(d)throw d;return new e(t,a,c,o,r)}}]),e}(),I=function(){function e(){Object(s.a)(this,e),this.cards=[],this.history=[],this.lastUpdated=new Date}return Object(i.a)(e,[{key:"_takeSnapshotToHistory",value:function(){var e={lastUpdated:this.lastUpdated,totalCardsCost:this.getTotalCardEstimate()};this.history.push(e)}},{key:"addCard",value:function(e){this.lastUpdated&&this._takeSnapshotToHistory(),this.lastUpdated=e.lastUpdated,this.cards.push(e)}},{key:"checkIfCardsNeedUpdate",value:function(){var e,t=new Date;for(e=0;e<this.cards.length;e++){var a=this.cards[e].lastUpdated,r=new Date(a.getTime());if(S.addToDateObj(r),t>=r)return!0}return!1}},{key:"updateCards",value:function(e){var t,a=this,r=[],n=new Date;for(t=0;t<this.cards.length;t++)if(e)r.push(this.cards[t]);else{var s=this.cards[t].lastUpdated,i=new Date(s.getTime());S.addToDateObj(i),n>=i&&r.push(this.cards[t])}if(r.length>0){this._takeSnapshotToHistory();var c=[];for(t=0;t<r.length;t++)c.push(r[t].updateData());return Promise.all(c).then((function(e){a.lastUpdated=new Date}))}return new Promise((function(e,t){return t(new Error("No Cards Updated"))}))}},{key:"getTotalCardEstimate",value:function(){var e,t,a,r=0;for(e=0;e<this.cards.length;e++)r+=this.cards[e].costEstimate;return t=r,a=2,+(Math.round(t+"e+"+a)+"e-"+a)}},{key:"getBlob",value:function(){return JSON.stringify(this)}}],[{key:"fromObj",value:function(t){var a,r=new e;for(r=Object.assign(r,t),a=0;a<r.cards.length;a++)r.cards[a]=L.fromObj(r.cards[a]);return r.lastUpdated=new Date(r.lastUpdated),r}},{key:"fromJSON",value:function(t){var a=JSON.parse(t);return e.fromObj(a)}}]),e}(),q=a(48),M=a(85),B=a(81),V=(a(70),function(e){Object(o.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(s.a)(this,a),(r=t.call(this,e)).state={forceUpdateButton:!0},r}return Object(i.a)(a,[{key:"getChartData",value:function(){var e,t={};for(e=0;e<this.props.dexProfile.history.length;e++){var a=this.props.dexProfile.history[e];t[a.lastUpdated.toString()]=a.totalCardsCost}return t[this.props.dexProfile.lastUpdated.toString()]=this.props.dexProfile.getTotalCardEstimate(),t}},{key:"getCardView",value:function(e){return v.a,Object(r.jsxs)(M.a,{style:{width:"18rem",margin:"10px"},children:[Object(r.jsx)(M.a.Img,{style:{height:"200px",width:"100%"},src:e.imageUrl}),Object(r.jsxs)(M.a.Body,{children:[Object(r.jsx)(M.a.Title,{children:e.cardName}),Object(r.jsx)(M.a.Subtitle,{className:"mb-2 text-muted",children:e.id}),Object(r.jsxs)(M.a.Text,{children:["Cost Estimate: $",e.costEstimate]})]}),Object(r.jsx)(M.a.Footer,{children:Object(r.jsx)("small",{children:e.updatedSinceString()})})]})}},{key:"getPokeCards",value:function(){var e,t=[];for(e=0;e<this.props.dexProfile.cards.length;e++){var a=this.props.dexProfile.cards[e];t.push(this.getCardView(a))}return Object(r.jsx)(B.a,{className:"m-4",children:t})}},{key:"render",value:function(){var e=this;return Object(r.jsx)(p.a,{exact:!0,path:"/profile",render:function(t){var a=t.history;return Object(r.jsxs)(O.a,{fluid:!0,className:"mt-4",children:[Object(r.jsxs)(x.a,{children:[Object(r.jsx)(v.a,{className:"btn-poke",onClick:function(){return a.push("/newcard")},children:"Manual Enter Card"}),e.props.dexProfile.cards.length>0&&Object(r.jsx)(v.a,{className:"btn-poke",onClick:function(){return function(e,t){var a=document.createElement("a"),r=new Blob([t],{type:"text/plain"});a.href=URL.createObjectURL(r),a.download=e,document.body.appendChild(a),a.click()}("profile.dex",e.props.dexProfile.getBlob())},children:"Save Dex"}),e.props.dexProfile.checkIfCardsNeedUpdate()&&Object(r.jsx)(v.a,{className:"btn-poke",onClick:function(){return e.props.dexProfile.updateCards(!1)},children:"Update Cards"}),e.state.forceUpdateButton&&e.props.dexProfile.cards.length>0&&Object(r.jsx)(v.a,{className:"btn-poke-danger",onClick:function(){e.props.dexProfile.updateCards(!0).then((function(){e.setState(Object(n.a)(Object(n.a)({},e.state),{},{forceUpdateButton:!1}))})).catch((function(t){var a={type:"warning"};a.component=Object(r.jsx)("h2",{children:t.toString()}),e.props.onError(a)}))},children:"Force Update"})]}),Object(r.jsx)(x.a,{className:"ml-2",children:Object(r.jsxs)("h2",{children:["Total cards: ",e.props.dexProfile.cards.length]})}),Object(r.jsx)(x.a,{className:"ml-2",children:Object(r.jsxs)("h2",{children:["Total price: $",e.props.dexProfile.getTotalCardEstimate()]})}),Object(r.jsx)(x.a,{children:Object(r.jsx)(q.a,{prefix:"$",xtitle:"Time",ytitle:"Money",data:e.getChartData()})}),Object(r.jsx)(x.a,{children:e.getPokeCards()})]})}})}}]),a}(u.a.Component)),_=a(83),R=a(82),$=a(55),A=function(e){Object(o.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(s.a)(this,a),(r=t.call(this,e)).state={currentCard:null},r.submitData=r.submitData.bind(Object(c.a)(r)),r}return Object(i.a)(a,[{key:"submitData",value:function(e,t){var a=this;L.parseEntries(e.cardName,e.id,e.quantity).updateData().then((function(e){a.props.addCardToDex(e),a.setState(Object(n.a)(Object(n.a)({},a.state),{},{currentCard:e})),t.resetForm()})).catch((function(e){var n="Card Data Error";t.setFieldError("cardName",n),t.setFieldError("cardNumbers",n),console.log(e);var s={type:"danger"};s.component=Object(r.jsx)("strong",{children:e.toString()}),a.props.onError(s)}))}},{key:"validateCard",value:function(e,t){for(var a={},r=0,n=Object.entries(e);r<n.length;r++){var s=Object(y.a)(n[r],2),i=s[0],c=s[1];if(U[i]){var o=U[i](c);o&&(a[i]=o.message)}}return a}},{key:"getToast",value:function(){var e=this;return this.state.currentCard?Object(r.jsxs)(_.a,{show:!!this.state.currentCard,className:"mt-3",onClose:function(){return e.setState(Object(n.a)(Object(n.a)({},e.state),{},{currentCard:null}))},delay:1e4,autohide:!0,children:[Object(r.jsxs)(_.a.Header,{children:[Object(r.jsx)("img",{style:{height:"40px",width:"20px",marginRight:"5dp"},src:this.state.currentCard.imageUrl,alt:""}),Object(r.jsx)("strong",{className:"mr-auto",children:this.state.currentCard.cardName}),Object(r.jsx)("small",{children:this.state.currentCard.lastUpdated.toLocaleString()})]}),Object(r.jsxs)(_.a.Body,{children:["Loaded ",this.state.currentCard.cardName," - ",this.state.currentCard.id," cost value of $",this.state.currentCard.costEstimate,"!"]})]}):null}},{key:"render",value:function(){var e=this;return Object(r.jsx)(p.a,{exact:!0,path:"/newcard",render:function(t){var a=t.history;return Object(r.jsxs)(O.a,{className:"mt-4",children:[Object(r.jsx)($.a,{onSubmit:e.submitData,initialValues:{cardName:"",id:"",quantity:1},validate:e.validateCard,children:function(e){var t=e.values,n=e.errors,s=e.touched,i=e.handleChange,c=(e.handleBlur,e.handleSubmit);return Object(r.jsxs)(R.a,{noValidate:!0,onSubmit:c,children:[Object(r.jsxs)(R.a.Group,{children:[Object(r.jsx)(R.a.Label,{children:"Card Name"}),Object(r.jsx)(R.a.Control,{name:"cardName",onChange:i,value:t.cardName,isValid:t.cardName&&!n.cardName,isInvalid:(t.cardName||s.cardName)&&!!n.cardName,type:"text",placeholder:"Enter Card Name"}),Object(r.jsx)(R.a.Control.Feedback,{type:"invalid",children:n.cardName})]}),Object(r.jsxs)(R.a.Group,{children:[Object(r.jsx)(R.a.Label,{children:"Card ID Numbers"}),Object(r.jsx)(R.a.Control,{name:"id",onChange:i,value:t.id,type:"text",placeholder:"Enter Card Id",isValid:t.id&&!n.id,isInvalid:(t.id||s.id)&&!!n.id}),Object(r.jsx)(R.a.Text,{className:"text-muted",children:'i.e. "141/189" or "058" or "SWSH063"'}),Object(r.jsx)(R.a.Control.Feedback,{type:"invalid",children:n.id})]}),Object(r.jsxs)(R.a.Group,{children:[Object(r.jsx)(R.a.Label,{children:"Quantity"}),Object(r.jsx)(R.a.Control,{name:"quantity",onChange:i,value:t.quantity,isValid:t.quantity&&!n.quantity,isInvalid:(t.quantity||s.quantity)&&!!n.quantity,type:"text",placeholder:"Quantity"}),Object(r.jsx)(R.a.Control.Feedback,{type:"invalid",children:n.quantity})]}),Object(r.jsx)(v.a,{className:"btn-poke",type:"submit",children:"Submit Card"}),Object(r.jsx)(v.a,{className:"btn-poke",onClick:function(){return a.push("/profile")},children:"Profile"})]})}}),e.getToast()]})}})}}]),a}(u.a.Component),J=a(45),H=a.n(J),Q=a(54),G=a(86),z=function(e){Object(o.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(s.a)(this,a),(r=t.call(this,e)).main=u.a.createRef(),r.state={showLoad:!1,loadFile:null,progress:-1},r}return Object(i.a)(a,[{key:"uploadFile",value:function(){var e=Object(Q.a)(H.a.mark((function e(t){var a,r=this;return H.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.state.loadFile&&((a=new FileReader).addEventListener("load",(function(e){var a=I.fromJSON(e.target.result);r.props.onLoadedDex(a),r.setState(Object(n.a)(Object(n.a)({},r.state),{},{loadFile:null,showLoad:!1,progress:-1})),t.push("/profile")})),a.addEventListener("progress",(function(e){var t=e.loaded/r.state.loadFile.size*100;r.setState(Object(n.a)(Object(n.a)({},r.state),{},{progress:t}))})),a.readAsText(this.state.loadFile));case 1:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getLoadFile",value:function(e){var t=this;return this.state.showLoad?Object(r.jsx)(x.a,{className:"justify-content-md-center mt-4",children:Object(r.jsxs)(_.a,{onClose:function(){t.state.showLoad&&t.setState(Object(n.a)(Object(n.a)({},t.state),{},{showLoad:!1}))},children:[Object(r.jsx)(_.a.Header,{children:Object(r.jsx)("strong",{className:"mr-auto",children:"Load Dex"})}),Object(r.jsxs)(_.a.Body,{children:[Object(r.jsx)("input",{type:"file",name:".dex file",accept:".dex",onChange:function(e){return t.setState(Object(n.a)(Object(n.a)({},t.state),{},{loadFile:e.target.files[0]}))}}),t.state.loadFile&&-1===t.state.progress?Object(r.jsx)(v.a,{className:"btn-poke",onClick:function(){return t.uploadFile(e)},children:"Accept"}):null,t.state.progress>=0?Object(r.jsx)(G.a,{variant:"success",className:"mt-2",animated:!0,now:t.state.progress}):null]})]})}):null}},{key:"render",value:function(){var e=this;return Object(r.jsx)(p.a,{path:"/",render:function(t){var a=t.history;return Object(r.jsxs)(O.a,{className:"mt-4",children:[e.getLoadFile(a),Object(r.jsx)(x.a,{className:"justify-content-center",children:Object(r.jsx)("h1",{children:"PokIndex"})}),Object(r.jsx)(x.a,{className:"justify-content-center",children:Object(r.jsx)(v.a,{className:"btn-poke",onClick:function(){return e.setState(Object(n.a)(Object(n.a)({},e.state),{},{showLoad:!0}))},children:"Load .dex file"})}),Object(r.jsx)(x.a,{className:"justify-content-center",children:Object(r.jsx)("h2",{children:"or"})}),Object(r.jsx)(x.a,{className:"justify-content-center",children:Object(r.jsx)(v.a,{className:"btn-poke",onClick:function(){e.props.onLoadedDex(new I),a.push("/profile")},children:"Create new PokIndex"})})]})}})}}]),a}(u.a.Component),Z=(a(75),function(e){Object(o.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(s.a)(this,a),(r=t.call(this,e)).state={dexProfile:null,error:null},r.addCardToDex=r.addCardToDex.bind(Object(c.a)(r)),r}return Object(i.a)(a,[{key:"addCardToDex",value:function(e){this.state.dexProfile&&e&&this.state.dexProfile.addCard(e)}},{key:"getErrorStatus",value:function(){var e=this;return this.state.error?(setTimeout((function(){return e.setState(Object(n.a)(Object(n.a)({},e.state),{},{error:null}))}),1e4),Object(r.jsx)(m.a,{show:!0,variant:this.state.error.type,children:this.state.error.component})):null}},{key:"render",value:function(){var e=this,t=function(t){e.setState(Object(n.a)(Object(n.a)({},e.state),{},{error:t}))};return Object(r.jsx)(b.a,{children:Object(r.jsx)(p.c,{children:Object(r.jsxs)("div",{children:[this.getErrorStatus(),!this.state.dexProfile&&Object(r.jsx)(z,{onError:t,onLoadedDex:function(t){return e.setState(Object(n.a)(Object(n.a)({},e.state),{},{dexProfile:t}))}}),this.state.dexProfile&&Object(r.jsxs)("div",{children:[Object(r.jsx)(g,{onError:t,addCardToDex:this.addCardToDex}),Object(r.jsx)(A,{onError:t,addCardToDex:this.addCardToDex}),Object(r.jsx)(V,{onError:t,dexProfile:this.state.dexProfile})]})]})})})}}]),a}(u.a.Component));j.a.render(Object(r.jsx)(Z,{}),document.getElementById("root"))}},[[76,1,2]]]);
//# sourceMappingURL=main.2c3bfbe3.chunk.js.map