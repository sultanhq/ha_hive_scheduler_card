/*! Hive Scheduler Card — derived from Sonoff TRVZB Scheduler Card.
MIT License

Copyright (c) 2024 abaddon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
function t(t,e,i,r){var s,o=arguments.length,n=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(o<3?s(n):o>3?s(e,i,n):s(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),s=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const n=t=>new o("string"==typeof t?t:t+"",void 0,r),a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[r+1],t[0]);return new o(i,t,r)},d=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return n(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:u,getOwnPropertySymbols:p,getPrototypeOf:g}=Object,m=globalThis,f=m.trustedTypes,y=f?f.emptyScript:"",b=m.reactiveElementPolyfillSupport,v=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?y:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},x=(t,e)=>!l(t,e),w={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:x};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,e);void 0!==r&&c(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){const{get:r,set:s}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:r,set(e){const o=r?.call(this);s?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=g(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...u(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(d(t))}else void 0!==t&&e.push(d(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,r)=>{if(i)t.adoptedStyleSheets=r.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of r){const r=document.createElement("style"),s=e.litNonce;void 0!==s&&r.setAttribute("nonce",s),r.textContent=i.cssText,t.appendChild(r)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(void 0!==r&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,r=i._$Eh.get(t);if(void 0!==r&&this._$Em!==r){const t=i.getPropertyOptions(r),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=r;const o=s.fromAttribute(e,t.type);this[r]=o??this._$Ej?.get(r)??o,this._$Em=null}}requestUpdate(t,e,i,r=!1,s){if(void 0!==t){const o=this.constructor;if(!1===r&&(s=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??x)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:s},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==s||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===r&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,r=this[e];!0!==t||this._$AL.has(e)||void 0===r||this.C(e,void 0,i,r)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[v("elementProperties")]=new Map,$[v("finalized")]=new Map,b?.({ReactiveElement:$}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k=globalThis,S=t=>t,C=k.trustedTypes,E=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,T="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,D="?"+A,M=`<${D}>`,H=document,P=()=>H.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,N="[ \t\n\f\r]",q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,I=/>/g,L=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,U=/"/g,j=/^(?:script|style|textarea|title)$/i,W=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),G=W(1),X=W(2),V=Symbol.for("lit-noChange"),Y=Symbol.for("lit-nothing"),F=new WeakMap,J=H.createTreeWalker(H,129);function Q(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}class K{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let s=0,o=0;const n=t.length-1,a=this.parts,[d,l]=((t,e)=>{const i=t.length-1,r=[];let s,o=2===e?"<svg>":3===e?"<math>":"",n=q;for(let e=0;e<i;e++){const i=t[e];let a,d,l=-1,c=0;for(;c<i.length&&(n.lastIndex=c,d=n.exec(i),null!==d);)c=n.lastIndex,n===q?"!--"===d[1]?n=z:void 0!==d[1]?n=I:void 0!==d[2]?(j.test(d[2])&&(s=RegExp("</"+d[2],"g")),n=L):void 0!==d[3]&&(n=L):n===L?">"===d[0]?(n=s??q,l=-1):void 0===d[1]?l=-2:(l=n.lastIndex-d[2].length,a=d[1],n=void 0===d[3]?L:'"'===d[3]?U:B):n===U||n===B?n=L:n===z||n===I?n=q:(n=L,s=void 0);const h=n===L&&t[e+1].startsWith("/>")?" ":"";o+=n===q?i+M:l>=0?(r.push(a),i.slice(0,l)+T+i.slice(l)+A+h):i+A+(-2===l?e:h)}return[Q(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),r]})(t,e);if(this.el=K.createElement(d,i),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=J.nextNode())&&a.length<n;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(T)){const e=l[o++],i=r.getAttribute(t).split(A),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:n[2],strings:i,ctor:"."===n[1]?rt:"?"===n[1]?st:"@"===n[1]?ot:it}),r.removeAttribute(t)}else t.startsWith(A)&&(a.push({type:6,index:s}),r.removeAttribute(t));if(j.test(r.tagName)){const t=r.textContent.split(A),e=t.length-1;if(e>0){r.textContent=C?C.emptyScript:"";for(let i=0;i<e;i++)r.append(t[i],P()),J.nextNode(),a.push({type:2,index:++s});r.append(t[e],P())}}}else if(8===r.nodeType)if(r.data===D)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=r.data.indexOf(A,t+1));)a.push({type:7,index:s}),t+=A.length-1}s++}}static createElement(t,e){const i=H.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,r){if(e===V)return e;let s=void 0!==r?i._$Co?.[r]:i._$Cl;const o=O(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),void 0===o?s=void 0:(s=new o(t),s._$AT(t,i,r)),void 0!==r?(i._$Co??=[])[r]=s:i._$Cl=s),void 0!==s&&(e=Z(t,s._$AS(t,e.values),s,r)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??H).importNode(e,!0);J.currentNode=r;let s=J.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new et(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new nt(s,this,t)),this._$AV.push(e),a=i[++n]}o!==a?.index&&(s=J.nextNode(),o++)}return J.currentNode=H,r}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=Y,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),O(t)?t===Y||null==t||""===t?(this._$AH!==Y&&this._$AR(),this._$AH=Y):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Y&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,r="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(Q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{const t=new tt(r,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new K(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const s of t)r===e.length?e.push(i=new et(this.O(P()),this.O(P()),this,this.options)):i=e[r],i._$AI(s),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,s){this.type=1,this._$AH=Y,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Y}_$AI(t,e=this,i,r){const s=this.strings;let o=!1;if(void 0===s)t=Z(this,t,e,0),o=!O(t)||t!==this._$AH&&t!==V,o&&(this._$AH=t);else{const r=t;let n,a;for(t=s[0],n=0;n<s.length-1;n++)a=Z(this,r[i+n],e,n),a===V&&(a=this._$AH[n]),o||=!O(a)||a!==this._$AH[n],a===Y?t=Y:t!==Y&&(t+=(a??"")+s[n+1]),this._$AH[n]=a}o&&!r&&this.j(t)}j(t){t===Y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class rt extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Y?void 0:t}}class st extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Y)}}class ot extends it{constructor(t,e,i,r,s){super(t,e,i,r,s),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??Y)===V)return;const i=this._$AH,r=t===Y&&i!==Y||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==Y&&(i===Y||r);r&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const at={I:et},dt=k.litHtmlPolyfillSupport;dt?.(K,et),(k.litHtmlVersions??=[]).push("3.3.3");const lt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ct=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const r=i?.renderBefore??e;let s=r._$litPart$;if(void 0===s){const t=i?.renderBefore??null;r._$litPart$=s=new et(e.insertBefore(P(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const ht=lt.litElementPolyfillSupport;ht?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ut=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:x},gt=(t=pt,e,i)=>{const{kind:r,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(void 0===o&&globalThis.litPropertyMetadata.set(s,o=new Map),"setter"===r&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===r){const{name:r}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(r,s,t,!0,i)},init(e){return void 0!==e&&this.C(r,void 0,t,e),e}}}if("setter"===r){const{name:r}=i;return function(i){const s=this[r];e.call(this,i),this.requestUpdate(r,s,t,!0,i)}}throw Error("Unsupported decorator location: "+r)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function mt(t){return(e,i)=>"object"==typeof i?gt(t,e,i):((t,e,i)=>{const r=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),r?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ft(t){return mt({...t,state:!0,attribute:!1})}const yt=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];function bt(t){const e=t.match(/^(\d{2}):(\d{2})$/);if(!e)throw new Error(`Invalid time format: ${t}. Expected HH:mm`);const i=parseInt(e[1],10),r=parseInt(e[2],10);if(i<0||i>23)throw new Error(`Invalid hours: ${i}. Must be 0-23`);if(r<0||r>59)throw new Error(`Invalid minutes: ${r}. Must be 0-59`);return{hours:i,minutes:r}}function vt(t){const{hours:e,minutes:i}=bt(t);return 60*e+i}function _t(t){try{return bt(t),!0}catch{return!1}}function xt(t){const e=[];var i;return _t(t.time)||e.push(`Invalid time format: ${t.time}. Expected HH:mm (00:00 - 23:59)`),i=t.temperature,Number.isFinite(i)&&(1===i||i>=5&&i<=32&&Number.isInteger(2*i))||e.push(`Temperature ${t.temperature}°C must be 1°C (off) or 5–32°C in 0.5°C steps`),{valid:0===e.length,errors:e}}function wt(t){const e=[],i=t?.transitions;if(!Array.isArray(i))return{valid:!1,errors:["Missing setpoints"]};if(0===i.length)return e.push("Day schedule must have at least 1 setpoint"),{valid:!1,errors:e};i.length>6&&e.push(`Too many setpoints: ${i.length}. Maximum is 6 per day`),i.forEach((t,i)=>{const r=xt(t);r.valid||r.errors.forEach(t=>{e.push(`Setpoint ${i+1}: ${t}`)})});for(let t=1;t<i.length;t++){const r=i[t-1].time,s=i[t].time;if(!_t(r)||!_t(s))continue;const{hours:o,minutes:n}=bt(r),{hours:a,minutes:d}=bt(s),l=60*o+n,c=60*a+d;c===l&&i[t].temperature!==i[t-1].temperature&&e.push(`Conflicting temperatures at ${s}`),c<l&&e.push(`Setpoints must be in chronological order: ${r} should come before ${s}`)}return{valid:0===e.length,errors:e}}let $t=0;function kt(){return`t-${Date.now()}-${++$t}`}function St(t){return t.id?t:{...t,id:kt()}}function Ct(t){if("string"!=typeof t||!t.trim())throw new Error("Schedule is empty; request a fresh receiver schedule.");const e=t.trim().split(/\s+/).map(t=>{const e=/^(\d{2}:\d{2})\/(\d+(?:\.\d{1,2})?)$/.exec(t);if(!e)throw new Error(`Malformed setpoint: ${t}. Expected HH:mm/temperature.`);return{id:kt(),time:e[1],temperature:Number(e[2])}}),i=wt({transitions:e});if(!i.valid)throw new Error(i.errors.join("; "));return{transitions:Dt(e)}}function Et(t){const e=wt(t);if(!e.valid)throw new Error(e.errors.join("; "));return Dt(t.transitions).map(t=>`${t.time}/${t.temperature}`).join(" ")}function Tt(t){return[...t].sort((t,e)=>function(t,e){const i=vt(t),r=vt(e);return i<r?-1:i>r?1:0}(t.time,e.time))}function At(t){return{transitions:t.transitions.map(t=>({id:t.id||kt(),time:t.time,temperature:t.temperature}))}}function Dt(t){const e=new Map,i=[];for(const r of t)if(e.has(r.time)){if(e.get(r.time)!==r.temperature)throw new Error(`Conflicting temperatures at ${r.time}`)}else e.set(r.time,r.temperature),i.push(St({...r}));return i}function Mt(t){const e={};for(const[i,r]of t.changes)e[`schedule_${i}`]=r;return e}const Ht=t=>"string"==typeof t&&t.trim().length>0&&t.length<=256&&!/[+/#\x00-\x1f\x7f]/.test(t);async function Pt(t,e){if(void 0!==e.mqtt_device&&""!==e.mqtt_device){if(!Ht(e.mqtt_device))throw new Error("Invalid Zigbee2MQTT friendly name override.");return e.mqtt_device}const i=async()=>{if(!t.callWS)throw new Error("MQTT discovery unavailable.");const i=(await t.callWS({type:"config/entity_registry/list"})).find(t=>t.entity_id===e.entity);if("mqtt"!==i?.platform||!i.device_id)throw new Error("Select a Zigbee2MQTT climate entity.");const r=await t.callWS({type:"mqtt/device/debug_info",device_id:i.device_id}),s=r.entities?.find(t=>t.entity_id===e.entity);let o=s?.discovery_data?.payload;"string"==typeof o&&(o=JSON.parse(o));const n=new Set;for(const t of["current_temperature_topic","curr_temp_t","temperature_state_topic","temp_stat_t","mode_state_topic","mode_stat_t","json_attributes_topic","json_attr_t"]){let e=o?.[t];if("string"!=typeof e)continue;"string"==typeof o["~"]&&(e.startsWith("~")?e=o["~"]+e.slice(1):e.endsWith("~")&&(e=e.slice(0,-1)+o["~"]));const i="zigbee2mqtt/";e.startsWith(i)&&Ht(e.slice(i.length))&&n.add(e.slice(i.length))}if(1!==n.size)throw new Error("Receiver MQTT topic missing or ambiguous.");return[...n][0]};let r;try{return await Promise.race([i(),new Promise((t,e)=>{r=setTimeout(()=>e(new Error("MQTT discovery timed out.")),5e3)})])}catch(t){throw new Error(`${t.message} Set mqtt_device in YAML if automatic discovery is unavailable.`)}finally{clearTimeout(r)}}class Ot{updateHass(t){this.hass=t}cancel(){this.controller?.abort()}async save(t,e,i,r,s){if(this.controller)return{status:"error",error:"A save is already in progress.",daysUpdated:[]};const o=new AbortController;this.controller=o,this.hass=t;const n=o.signal,a=[],d=new Set;let l,c=[],h=!1;const u=new Map;try{const o=function(t,e){const i=new Map;for(const r of yt){const s=Et(t[r]),o=Et(e[r]);s!==o&&i.set(r,o)}const r=Array.from(i.keys());return{changes:i,hasChanges:i.size>0,changedDays:r}}(r,s);if(c=o.changedDays,!o.hasChanges)return{status:"skipped"};if(!t.user?.is_admin||!t.connection)throw new Error("Sign in as a Home Assistant administrator to verify and save schedules.");const p=await this.bounded(Pt(t,e),n),g=`zigbee2mqtt/${p}`,m=async(e,i)=>{const r=t.connection.subscribeMessage(t=>{n.aborted||i(t)},{type:"mqtt/subscribe",topic:e});r.then(t=>{n.aborted&&t()},()=>{}),a.push(await this.bounded(r,n))};await m(g,t=>{if(h&&!t.retain&&t.topic===g)try{const e=JSON.parse(t.payload);for(const t of c)if(Object.prototype.hasOwnProperty.call(e,`schedule_${t}`))try{u.set(t,Et(Ct(e[`schedule_${t}`])))}catch{u.delete(t)}}catch{}}),await m("zigbee2mqtt/bridge/logging",t=>{if(!t.retain)try{const e=JSON.parse(t.payload);"error"===e.level&&"string"==typeof e.message&&(e.message.includes(`'${p}'`)||e.message.includes(`"${p}"`))&&c.some(t=>e.message.includes(`schedule_${t}`))&&(l=e.message)}catch{}}),this.assertAvailable(e,i,c),await this.bounded(t.callService("mqtt","publish",{topic:`${g}/set`,payload:JSON.stringify(Mt(o)),retain:!1}),n);const f=Date.now();let y=0;for(;Date.now()-f<3e4;){if(n.aborted)throw new Error("Save cancelled. Edits were preserved; reload receiver schedules before retrying.");if(l)throw new Error(`Zigbee2MQTT rejected the update: ${l}`);if(this.assertAvailable(e,i,c),y<3&&Date.now()-f>=1e4*y){const e=Object.fromEntries(c.filter(t=>!d.has(t)).map(t=>[`schedule_${t}`,""]));h=!0,await this.bounded(t.callService("mqtt","publish",{topic:`${g}/get`,payload:JSON.stringify(e),retain:!1}),n),y++}for(const t of c)try{const e=Et(Ct(this.hass.states[i[t]].state));u.get(t)===o.changes.get(t)&&e===o.changes.get(t)?d.add(t):d.delete(t)}catch{d.delete(t)}if(d.size===c.length)return{status:"success",daysUpdated:[...d]};await this.pause(n)}throw new Error(`Read-back timed out or differs for ${c.filter(t=>!d.has(t)).join(", ")}. Check receiver connectivity and Zigbee2MQTT logs, then retry or reload.`)}catch(t){return{status:"error",error:t instanceof Error?t.message:String(t),daysUpdated:[...d]}}finally{o.abort();for(const t of a)try{t()}catch{}this.controller===o&&(this.controller=void 0)}}assertAvailable(t,e,i){if(!this.hass?.states[t.entity]||["unknown","unavailable"].includes(this.hass.states[t.entity].state)||i.some(t=>!this.hass?.states[e[t]]||["unknown","unavailable"].includes(this.hass.states[e[t]].state)))throw new Error("Hive or a schedule entity is unavailable. Edits were preserved; reconnect before retrying.")}pause(t){return new Promise((e,i)=>{const r=()=>{clearTimeout(s),t.removeEventListener("abort",r),i(new Error("Save cancelled. Edits were preserved."))},s=setTimeout(()=>{t.removeEventListener("abort",r),e()},100);t.addEventListener("abort",r,{once:!0}),t.aborted&&r()})}bounded(t,e){return new Promise((i,r)=>{const s=()=>{clearTimeout(n),e.removeEventListener("abort",o)},o=()=>{s(),r(new Error("Save cancelled. Edits were preserved."))},n=setTimeout(()=>{s(),r(new Error("Home Assistant request timed out. Check connectivity before retrying."))},5e3);e.addEventListener("abort",o,{once:!0}),t.then(t=>{s(),i(t)},t=>{s(),r(t)}),e.aborted&&o()})}}function Rt(t){return null==t||["","unavailable","unknown","none","null","n/a"].includes(t.trim().toLowerCase())}async function Nt(t,e){const i={...e.schedule_entities},r=yt.filter(t=>!i[t]);if(r.length){if(!t.callWS)throw new Error("Entity discovery unavailable. Configure schedule_entities for all seven days.");const s=await t.callWS({type:"config/entity_registry/list"}),o=s.find(t=>t.entity_id===e.entity)?.device_id;if(!o)throw new Error("Climate device association not found. Configure schedule_entities explicitly.");for(const t of r){const e=s.filter(e=>e.device_id===o&&"mqtt"===e.platform&&e.entity_id.startsWith("text.")&&!e.disabled_by&&new RegExp(`(?:^|_)schedule_${t}(?:_[0-9]+)?(?:_zigbee2mqtt)?$`).test(e.unique_id));if(1!==e.length)throw new Error(`${t}: schedule entity missing or ambiguous. Set schedule_entities.${t}.`);i[t]=e[0].entity_id}}for(const t of yt)if(!/^text\.[a-z0-9_]+$/.test(i[t]))throw new Error(`${t}: expected a text entity ID.`);if(7!==new Set(Object.values(i)).size)throw new Error("Each day must use a different schedule entity.");return i}const qt=/[+#/\x00-\x1f\x7f]/;function zt(t){if("string"!=typeof t||!function(t){return!(null==t||0===t.trim().length||t.length>256||qt.test(t))}(t))throw new Error("mqtt_device must be a non-empty friendly name without /, +, # or control characters.")}const It=[[15,46,184,92],[17,240,190,40],[20,239,83,80],[25,255,24,24]];function Lt(t){const e=Math.max(1,Math.min(32,t));if(e<10)return"rgb(0, 150, 255)";if(e<=15)return"rgb(46, 184, 92)";if(e>25)return"rgb(255, 0, 0)";const i=It.findIndex(t=>e<=t[0]),r=It[i-1],s=It[i],o=(e-r[0])/(s[0]-r[0]);return`rgb(${[1,2,3].map(t=>Math.round(r[t]+(s[t]-r[t])*o)).join(", ")})`}const Bt=`linear-gradient(to right, ${[5,9.5,10,15,17,20,25,25.5,32].map(t=>`${Lt(t)} ${(t-5)/27*100}%`).join(", ")})`,Ut=a`
  :host {
    display: block;
  }

  /* Card Container */
  ha-card {
    display: block;
    box-sizing: border-box;
    padding: 16px;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--card-background-color);
    box-shadow: var(--ha-card-box-shadow, none);
  }

  /* Card Header */
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--divider-color);
  }

  .card-title {
    font-size: 18px;
    font-weight: 500;
    color: var(--primary-text-color);
    margin: 0;
    flex: 1;
  }

  .card-actions {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  /* View Mode Toggle */
  .view-toggle {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: var(--primary-background-color, #f5f5f5);
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .view-toggle-button {
    padding: 8px 16px;
    border: none;
    background: transparent;
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
  }

  .view-toggle-button:hover {
    background: var(--card-background-color);
  }

  .view-toggle-button.active {
    background: var(--primary-color);
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* Week View Grid - Compact & Responsive */
  .week-view {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 12px;
  }

  .day-column {
    display: flex;
    flex-direction: column;
    min-height: 150px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    overflow: hidden;
    background: var(--card-background-color);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .day-column:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  .day-column.active {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color);
  }

  .day-header {
    padding: 6px 4px;
    background: var(--primary-background-color, #f5f5f5);
    text-align: center;
    font-weight: 600;
    font-size: 11px;
    color: var(--primary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .day-schedule {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 3px;
    gap: 2px;
  }

  .transition-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 6px;
    border-radius: 3px;
    font-size: 11px;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease;
  }

  .transition-block:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }

  .transition-time {
    font-weight: 600;
    font-size: 10px;
  }

  .transition-temp {
    font-weight: 500;
    font-size: 10px;
  }

  /* List View Accordion */
  .list-view {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }

  .day-accordion {
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    overflow: hidden;
    background: var(--card-background-color);
  }

  .day-accordion-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    background: var(--primary-background-color, #f5f5f5);
    transition: background 0.2s ease;
  }

  .day-accordion-header:hover {
    background: var(--secondary-background-color, #e8e8e8);
  }

  .day-accordion-header.expanded {
    background: var(--primary-color);
    color: white;
  }

  .day-name {
    font-weight: 600;
    font-size: 14px;
    text-transform: capitalize;
  }

  .day-summary {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-left: 8px;
  }

  .day-accordion-header.expanded .day-summary {
    color: rgba(255, 255, 255, 0.8);
  }

  .accordion-icon {
    transition: transform 0.2s ease;
  }

  .accordion-icon.expanded {
    transform: rotate(180deg);
  }

  .day-accordion-content {
    padding: 16px;
    background: var(--card-background-color);
  }

  .transitions-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Transition Editor */
  .transition-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--primary-background-color, #f5f5f5);
    border-radius: 8px;
    border: 1px solid var(--divider-color);
  }

  .transition-item.invalid {
    border-color: var(--error-color);
    background: rgba(var(--error-color), 0.05);
  }

  .transition-index {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .transition-fields {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .transition-actions {
    display: flex;
    gap: 4px;
  }

  /* Form Inputs */
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .input-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .time-input {
    padding: 8px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    font-size: 14px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font-family: monospace;
    width: 100px;
    transition: all 0.2s ease;
  }

  .time-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-color), 0.2);
  }

  .time-input:invalid {
    border-color: var(--error-color);
  }

  .temperature-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .temperature-slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: ${n(Bt)};
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
  }

  .temperature-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--primary-color);
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
  }

  .temperature-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }

  .temperature-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--primary-color);
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
  }

  .temperature-slider::-moz-range-thumb:hover {
    transform: scale(1.1);
  }

  .temperature-value {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .temperature-display {
    padding: 4px 12px;
    border-radius: 4px;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    min-width: 60px;
    text-align: center;
  }

  /* Buttons */
  .button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button-primary {
    background: var(--primary-color);
    color: white;
  }

  .button-primary:hover:not(:disabled) {
    opacity: 0.9;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .button-secondary {
    background: var(--secondary-background-color, #e8e8e8);
    color: var(--primary-text-color);
  }

  .button-secondary:hover:not(:disabled) {
    background: var(--divider-color);
  }

  .button-success {
    background: var(--success-color, #4caf50);
    color: white;
  }

  .button-success:hover:not(:disabled) {
    opacity: 0.9;
  }

  .button-error {
    background: var(--error-color);
    color: white;
  }

  .button-error:hover:not(:disabled) {
    opacity: 0.9;
  }

  .button-icon {
    padding: 6px;
    border-radius: 50%;
    background: transparent;
    border: 1px solid var(--divider-color);
    color: var(--secondary-text-color);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
  }

  .button-icon:hover:not(:disabled) {
    background: var(--primary-background-color, #f5f5f5);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  .button-icon.add {
    border-color: var(--success-color, #4caf50);
    color: var(--success-color, #4caf50);
  }

  .button-icon.add:hover:not(:disabled) {
    background: var(--success-color, #4caf50);
    color: white;
  }

  .button-icon.remove {
    border-color: var(--error-color);
    color: var(--error-color);
  }

  .button-icon.remove:hover:not(:disabled) {
    background: var(--error-color);
    color: white;
  }

  /* Save Button with Loading State */
  .save-button {
    padding: 8px 16px;
    font-size: 14px;
    position: relative;
    white-space: nowrap;
  }

  .save-button.loading {
    pointer-events: none;
  }

  .save-button.loading::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    top: 50%;
    right: 12px;
    margin-top: -6px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Messages */
  .message {
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 14px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .message-error {
    background: rgba(var(--error-color), 0.1);
    color: var(--error-color);
    border: 1px solid var(--error-color);
  }

  .message-warning {
    background: rgba(255, 152, 0, 0.1);
    color: rgb(255, 152, 0);
    border: 1px solid rgb(255, 152, 0);
  }

  .message-success {
    background: rgba(var(--success-color, 76, 175, 80), 0.1);
    color: var(--success-color, #4caf50);
    border: 1px solid var(--success-color, #4caf50);
  }

  .message-info {
    background: rgba(var(--primary-color), 0.1);
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
  }

  .validation-error {
    font-size: 12px;
    color: var(--error-color);
    margin-top: 4px;
  }

  /* Modal/Dialog Overlay */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal {
    background: var(--card-background-color);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow: auto;
    animation: slideUp 0.3s ease;
    box-sizing: border-box;
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--divider-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-text-color);
    margin: 0;
  }

  .modal-content {
    padding: 20px;
  }

  .modal-footer {
    padding: 16px 20px;
    border-top: 1px solid var(--divider-color);
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  /* Copy Schedule Dialog */
  .copy-dialog-days {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
    margin: 16px 0;
  }

  .day-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .day-checkbox:hover {
    background: var(--primary-background-color, #f5f5f5);
  }

  .day-checkbox.checked {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }

  .day-checkbox input[type="checkbox"] {
    cursor: pointer;
  }

  .day-checkbox-label {
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    text-transform: capitalize;
  }

  /* Loading State */
  .loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--divider-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--secondary-text-color);
  }

  .empty-state-icon {
    font-size: 48px;
    opacity: 0.3;
    margin-bottom: 16px;
  }

  .empty-state-text {
    font-size: 14px;
  }

  /* Responsive Design */
  /* Tablet breakpoint */
  @media (max-width: 768px) {
    ha-card {
      padding: 8px;
    }

    .week-view {
      grid-template-columns: repeat(4, 1fr);
      gap: 3px;
    }

    .day-column {
      min-height: 130px;
    }

    .day-header {
      font-size: 9px;
      padding: 4px 2px;
    }

    .transition-block {
      font-size: 10px;
      padding: 3px 4px;
    }

    .transition-time,
    .transition-temp {
      font-size: 9px;
    }

    .transition-fields {
      flex-direction: column;
      align-items: stretch;
    }

    .time-input {
      width: 100%;
    }

    .modal {
      width: 95%;
      max-height: 95vh;
      margin: 10px;
    }

    .modal-header {
      padding: 12px 16px;
    }

    .modal-content {
      padding: 12px;
    }

    .copy-dialog-days {
      grid-template-columns: 1fr;
    }
  }

  /* Mobile breakpoint */
  @media (max-width: 480px) {
    ha-card {
      padding: 6px;
    }

    .week-view {
      grid-template-columns: repeat(3, 1fr);
      gap: 2px;
    }

    .card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .view-toggle {
      width: 100%;
    }

    .view-toggle-button {
      flex: 1;
      text-align: center;
    }

    .day-column {
      min-height: 100px;
    }

    .day-header {
      font-size: 8px;
      padding: 3px 2px;
      letter-spacing: 0px;
    }

    .transition-block {
      font-size: 9px;
      padding: 2px 3px;
    }

    .transition-time,
    .transition-temp {
      font-size: 8px;
    }

    .transition-item {
      flex-direction: column;
      align-items: stretch;
    }

    .transition-actions {
      width: 100%;
      justify-content: flex-end;
    }

    .modal {
      width: calc(100% - 16px);
      max-height: calc(100vh - 32px);
      margin: 8px;
      border-radius: 8px;
    }

    .modal-header {
      padding: 10px 12px;
    }

    .modal-title {
      font-size: 16px;
    }

    .modal-content {
      padding: 10px;
    }
  }
`,jt=a`
  ${Ut}

  .editor-container {
    padding: 16px;
  }

  .editor-row {
    margin-bottom: 16px;
  }

  .editor-row:last-child {
    margin-bottom: 0;
  }

  .editor-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-text-color);
    margin-bottom: 8px;
  }

  .editor-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    font-size: 14px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    box-sizing: border-box;
    transition: all 0.2s ease;
  }

  .editor-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-color), 0.2);
  }

  .editor-select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    font-size: 14px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    cursor: pointer;
    box-sizing: border-box;
    transition: all 0.2s ease;
  }

  .editor-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-color), 0.2);
  }

  .editor-description {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-top: 4px;
    line-height: 1.4;
  }

  .editor-error {
    color: var(--error-color);
    font-size: 12px;
    margin-top: 4px;
  }

  .editor-toggle {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .editor-toggle input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  ha-entity-picker,
  ha-selector {
    width: 100%;
  }
`;let Wt=class extends ct{constructor(){super(...arguments),this.disabled=!1,this.dayOrder=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],this.dayAbbreviations={sunday:"Sun",monday:"Mon",tuesday:"Tue",wednesday:"Wed",thursday:"Thu",friday:"Fri",saturday:"Sat"}}handleDayClick(t){this.disabled||this.dispatchEvent(new CustomEvent("day-selected",{detail:{day:t},bubbles:!0,composed:!0}))}renderDayColumn(t){const e=this.schedule?.[t],i=e?.transitions||[],r=i.length>0;return G`
      <div
        class="day-column"
        @click=${()=>this.handleDayClick(t)}
        role="button"
        tabindex=${this.disabled?"-1":"0"}
        aria-label="Edit ${t} schedule"
        @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||this.disabled||(e.preventDefault(),this.handleDayClick(t))}}
      >
        <div class="day-header">
          ${this.dayAbbreviations[t]}
        </div>
        <div class="day-schedule">
          ${r?i.map(t=>this.renderTransitionBlock(t.time,t.temperature)):this.renderEmptyDay()}
        </div>
      </div>
    `}renderTransitionBlock(t,e){const i=Lt(e);return G`
      <div
        class="transition-block"
        style="background-color: ${i}"
        title="${t} - ${e}°C"
      >
        <span class="transition-time">${t}</span>
        <span class="transition-temp">${e}°C</span>
      </div>
    `}renderEmptyDay(){return G`
      <div class="transition-block" style="background-color: var(--divider-color); color: var(--secondary-text-color);">
        <span>No schedule</span>
      </div>
    `}renderEmptyState(){return G`
      <div class="empty-placeholder">
        <div class="empty-icon">📅</div>
        <div class="empty-text">No Schedule Available</div>
        <div class="empty-subtext">Click on a day to create a schedule</div>
      </div>
    `}render(){return this.schedule&&this.dayOrder.some(t=>this.schedule[t]?.transitions?.length>0)?G`
      <div class="week-container">
        <div class="week-view">
          ${this.dayOrder.map(t=>this.renderDayColumn(t))}
        </div>
      </div>
    `:this.renderEmptyState()}};Wt.styles=[Ut,a`
      :host {
        display: block;
        container-type: inline-size;
      }

      @container (max-width: 600px) {
        .week-view { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      }

      @container (min-width: 601px) and (max-width: 800px) {
        .week-view { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      }

      .week-container {
        width: 100%;
      }

      .empty-placeholder {
        text-align: center;
        padding: 60px 20px;
        color: var(--secondary-text-color);
      }

      .empty-icon {
        font-size: 64px;
        opacity: 0.2;
        margin-bottom: 16px;
      }

      .empty-text {
        font-size: 16px;
        font-weight: 500;
      }

      .empty-subtext {
        font-size: 14px;
        margin-top: 8px;
        opacity: 0.7;
      }
    `],t([mt({type:Object})],Wt.prototype,"schedule",void 0),t([mt({type:Boolean})],Wt.prototype,"disabled",void 0),Wt=t([ut("hive-schedule-week-view")],Wt);let Gt=class extends ct{constructor(){super(...arguments),this.schedule=null,this.disabled=!1,this.selectedDay="monday",this.draggingPoint=null,this.dragStartX=0,this.dragStartY=0,this.isDragging=!1,this.DRAG_THRESHOLD=5,this.dayOrder=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],this.CHART_PADDING={top:20,right:20,bottom:40,left:50},this.TEMP_PADDING=5,this.TEMP_ABSOLUTE_MIN=1,this.TEMP_ABSOLUTE_MAX=32,this.HOUR_MIN=0,this.HOUR_MAX=24,this.VIEWBOX_WIDTH=800,this.VIEWBOX_HEIGHT=350,this.handleMouseMove=t=>{if(null===this.draggingPoint||this.disabled)return;if(!this.isDragging){const e=t.clientX-this.dragStartX,i=t.clientY-this.dragStartY;if(Math.sqrt(e*e+i*i)<this.DRAG_THRESHOLD)return;this.isDragging=!0}const e=this.renderRoot.querySelector(".chart-svg");if(!e)return;const i=this.screenToSVGCoords(e,t.clientX,t.clientY),r=this.xToHour(i.x,this.VIEWBOX_WIDTH),s=this.yToTemp(i.y,this.VIEWBOX_HEIGHT),o=this.getCurrentDaySchedule();if(!o)return;const n=[...o.transitions],a=this.hoursToTime(Math.round(60*r)/60);n[this.draggingPoint]={...n[this.draggingPoint],time:a,temperature:s},this.dispatchTransitionUpdate(n,!1)},this.handleMouseUp=()=>{if(null!==this.draggingPoint&&this.isDragging){const t=this.getCurrentDaySchedule();t&&this.dispatchTransitionUpdate(t.transitions,!0)}this.draggingPoint=null,this.isDragging=!1,document.body.style.cursor="",document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)},this.handleTouchMove=t=>{if(null===this.draggingPoint||this.disabled)return;t.preventDefault();const e=t.touches[0];if(!this.isDragging){const t=e.clientX-this.dragStartX,i=e.clientY-this.dragStartY;if(Math.sqrt(t*t+i*i)<this.DRAG_THRESHOLD)return;this.isDragging=!0}const i=this.renderRoot.querySelector(".chart-svg");if(!i)return;const r=this.screenToSVGCoords(i,e.clientX,e.clientY),s=this.xToHour(r.x,this.VIEWBOX_WIDTH),o=this.yToTemp(r.y,this.VIEWBOX_HEIGHT),n=this.getCurrentDaySchedule();if(!n)return;const a=[...n.transitions],d=this.hoursToTime(Math.round(60*s)/60);a[this.draggingPoint]={...a[this.draggingPoint],time:d,temperature:o},this.dispatchTransitionUpdate(a,!1)},this.handleTouchEnd=()=>{if(null!==this.draggingPoint&&this.isDragging){const t=this.getCurrentDaySchedule();t&&this.dispatchTransitionUpdate(t.transitions,!0)}this.draggingPoint=null,this.isDragging=!1,document.removeEventListener("touchmove",this.handleTouchMove),document.removeEventListener("touchend",this.handleTouchEnd),document.removeEventListener("touchcancel",this.handleTouchEnd)},this.boundSvgMouseDown=null,this.boundSvgTouchStart=null,this.boundSvgDblClick=null}getTempRange(){const t=this.getCurrentDaySchedule();if(!t||0===t.transitions.length)return{min:15,max:25};const e=t.transitions.map(t=>t.temperature),i=this.getCarryOver();i&&e.push(i.temperature);const r=Math.min(...e),s=Math.max(...e),o=Math.max(this.TEMP_ABSOLUTE_MIN,Math.floor(r-this.TEMP_PADDING)),n=Math.min(this.TEMP_ABSOLUTE_MAX,Math.ceil(s+this.TEMP_PADDING));if(n-o<10){const t=(o+n)/2;return{min:Math.max(this.TEMP_ABSOLUTE_MIN,Math.floor(t-5)),max:Math.min(this.TEMP_ABSOLUTE_MAX,Math.ceil(t+5))}}return{min:o,max:n}}selectDay(t){this.disabled||(this.selectedDay=t)}getCurrentDaySchedule(){return this.schedule&&this.schedule[this.selectedDay]||null}getCarryOver(){const t=this.getCurrentDaySchedule()?.transitions[0];if(!t||"00:00"===t.time)return null;const e=yt[(yt.indexOf(this.selectedDay)+6)%7],i=this.schedule?.[e]?.transitions.slice(-1)[0];return i?{day:e,temperature:i.temperature,until:t.time}:null}hourToX(t,e){const i=e-this.CHART_PADDING.left-this.CHART_PADDING.right;return this.CHART_PADDING.left+t/24*i}tempToY(t,e){const{min:i,max:r}=this.getTempRange(),s=e-this.CHART_PADDING.top-this.CHART_PADDING.bottom,o=(t-i)/(r-i);return this.CHART_PADDING.top+s*(1-o)}xToHour(t,e){const i=e-this.CHART_PADDING.left-this.CHART_PADDING.right,r=t-this.CHART_PADDING.left;return Math.max(0,Math.min(24,r/i*24))}yToTemp(t,e){const{min:i,max:r}=this.getTempRange(),s=e-this.CHART_PADDING.top-this.CHART_PADDING.bottom,o=i+(1-(t-this.CHART_PADDING.top)/s)*(r-i),n=Math.round(2*o)/2;return n<3?1:Math.max(5,Math.min(32,n))}timeToHours(t){const[e,i]=t.split(":").map(Number);return e+i/60}hoursToTime(t){const e=Math.max(0,Math.min(1439,Math.round(60*t)));return`${String(Math.floor(e/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`}handlePointMouseDown(t,e){this.disabled||(e.preventDefault(),e.stopPropagation(),this.draggingPoint=t,this.dragStartX=e.clientX,this.dragStartY=e.clientY,this.isDragging=!1,document.body.style.cursor="grabbing",document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp))}handlePointTouchStart(t,e){if(this.disabled)return;e.preventDefault(),e.stopPropagation();const i=e.touches[0];this.draggingPoint=t,this.dragStartX=i.clientX,this.dragStartY=i.clientY,this.isDragging=!1,document.addEventListener("touchmove",this.handleTouchMove,{passive:!1}),document.addEventListener("touchend",this.handleTouchEnd),document.addEventListener("touchcancel",this.handleTouchEnd)}screenToSVGCoords(t,e,i){const r=t.createSVGPoint();r.x=e,r.y=i;const s=t.getScreenCTM();if(s){const t=r.matrixTransform(s.inverse());return{x:t.x,y:t.y}}const o=t.getBoundingClientRect();return{x:(e-o.left)/o.width*this.VIEWBOX_WIDTH,y:(i-o.top)/o.height*this.VIEWBOX_HEIGHT}}dispatchTransitionUpdate(t,e){const i=Tt(t);this.dispatchEvent(new CustomEvent("schedule-changed",{detail:{day:this.selectedDay,schedule:{transitions:i},save:e},bubbles:!0,composed:!0}))}addTransition(){if(this.disabled)return;const t=this.getCurrentDaySchedule();if(!t)return;const e=[...t.transitions];if(e.length>=6)return;let i="12:00",r=20;if(e.length>1){const t=Tt(e);let s=0,o=0;for(let e=0;e<t.length-1;e++){const i=this.timeToHours(t[e].time),r=this.timeToHours(t[e+1].time)-i;r>s&&(s=r,o=e)}const n=(this.timeToHours(t[o].time)+this.timeToHours(t[o+1].time))/2;i=this.hoursToTime(n),r=t[o].temperature}const s={time:i,temperature:r};e.push(s),this.dispatchTransitionUpdate(e,!0)}formatDayName(t){return t.charAt(0).toUpperCase()+t.slice(1).substring(0,2)}renderDaySelector(){return G`
      <div class="day-selector">
        ${this.dayOrder.map(t=>G`
            <button
              class="day-button ${this.selectedDay===t?"active":""}"
              @click="${()=>this.selectDay(t)}"
              ?disabled="${this.disabled}"
            >
              ${this.formatDayName(t)}
            </button>
          `)}
      </div>
    `}renderGridLines(t,e){const i=[],{min:r,max:s}=this.getTempRange(),o=5*Math.ceil(r/5),n=5*Math.floor(s/5);for(let r=o;r<=n;r+=5){const s=this.tempToY(r,e);i.push(X`
        <line
          class="grid-line"
          x1="${this.CHART_PADDING.left}"
          y1="${s}"
          x2="${t-this.CHART_PADDING.right}"
          y2="${s}"
        />
      `)}for(let r=0;r<=24;r+=1){const s=this.hourToX(r,t);i.push(X`
        <line
          class="grid-line"
          x1="${s}"
          y1="${this.CHART_PADDING.top}"
          x2="${s}"
          y2="${e-this.CHART_PADDING.bottom}"
        />
      `)}return i}renderAxes(t,e){const i=[],r=e-this.CHART_PADDING.bottom;i.push(X`
      <line
        class="axis-line"
        x1="${this.CHART_PADDING.left}"
        y1="${r}"
        x2="${t-this.CHART_PADDING.right}"
        y2="${r}"
      />
    `);for(let r=0;r<=24;r+=1){const s=this.hourToX(r,t);i.push(X`
        <text
          class="axis-label"
          x="${s}"
          y="${e-this.CHART_PADDING.bottom+15}"
          text-anchor="middle"
        >
          ${r}
        </text>
      `)}i.push(X`
      <line
        class="axis-line"
        x1="${this.CHART_PADDING.left}"
        y1="${this.CHART_PADDING.top}"
        x2="${this.CHART_PADDING.left}"
        y2="${e-this.CHART_PADDING.bottom}"
      />
    `);const{min:s,max:o}=this.getTempRange(),n=5*Math.ceil(s/5),a=5*Math.floor(o/5);for(let t=n;t<=a;t+=5){const r=this.tempToY(t,e);i.push(X`
        <text
          class="axis-label"
          x="${this.CHART_PADDING.left-10}"
          y="${r+4}"
          text-anchor="end"
        >
          ${t}°C
        </text>
      `)}return i}renderTemperatureLine(t,e,i){if(0===t.length)return null;const r=this.getCarryOver(),s=r?`M ${this.hourToX(0,e)},${this.tempToY(r.temperature,i)} L ${this.hourToX(this.timeToHours(r.until),e)},${this.tempToY(r.temperature,i)} L ${this.hourToX(this.timeToHours(r.until),e)},${this.tempToY(t[0].temperature,i)}`:"",o=r?`00:00–${r.until}: ${1===r.temperature?"Heating off (1°C)":`${r.temperature}°C`} · carried over from ${r.day.charAt(0).toUpperCase()+r.day.slice(1)}. Display only; not a stored setpoint.`:"",n=r?X`
          <path class="inferred-line" stroke=${Lt(r.temperature)}
            stroke-width="1.25" stroke-dasharray="4 4" vector-effect="non-scaling-stroke" fill="none" d=${s}>
            <title>${o}</title>
          </path>
          <path class="inferred-hover-target" stroke="transparent" stroke-width="14"
            vector-effect="non-scaling-stroke" pointer-events="stroke" fill="none" d=${s}>
            <title>${o}</title>
          </path>
          <circle class="inferred-start" cx=${this.hourToX(0,e)} cy=${this.tempToY(r.temperature,i)}
            r="5" fill="var(--card-background-color, #ffffff)" stroke=${Lt(r.temperature)}
            stroke-width="2" vector-effect="non-scaling-stroke">
            <title>${o}</title>
          </circle>
        `:null,a=t.map((r,s)=>{const o=this.hourToX(this.timeToHours(r.time),e),n=this.tempToY(r.temperature,i),a=s>0?this.tempToY(t[s-1].temperature,i):n,d=this.hourToX(s+1<t.length?this.timeToHours(t[s+1].time):24,e);return X`<path class="temperature-line" stroke=${Lt(r.temperature)}
        d=${`M ${o},${a} L ${o},${n} L ${d},${n}`} />`});return X`
      ${n}
      ${a}
    `}renderTemperaturePoints(t,e,i){return t.map((t,r)=>{const s=this.timeToHours(t.time),o=this.hourToX(s,e),n=this.tempToY(t.temperature,i),a=Lt(t.temperature),d=this.draggingPoint===r,l=o+64>e-this.CHART_PADDING.right,c=o+(l?-16:16),h=l?"end":"start",u=n+28>i-this.CHART_PADDING.bottom;return X`
        <g
          class="point-group"
          data-point-index="${r}"
          style="cursor: grab;"
        >
          <circle
            class="temperature-point ${d?"dragging":""}"
            cx="${o}"
            cy="${n}"
            r="${d?8:6}"
            fill="${a}"
            stroke="white"
            stroke-width="${d?4:2}"
          />
          <text
            class="point-label temperature-label"
            x="${c}"
            y="${n-(u?30:12)}"
            text-anchor=${h}
          >
            ${t.temperature}°C
          </text>
          <text
            class="point-label time-label"
            x="${c}"
            y="${n+(u?-12:20)}"
            text-anchor=${h}
            fill="var(--secondary-text-color, #666666)"
          >
            ${t.time}
          </text>
        </g>
      `})}renderChart(){const t=this.getCurrentDaySchedule();if(!t)return G`
        <div class="chart-wrapper">
          <div style="text-align: center; padding: 40px; color: var(--secondary-text-color);">
            No schedule data available for ${this.selectedDay}
          </div>
        </div>
      `;const e=t.transitions;return G`
      <div class="chart-wrapper">
        <svg
          class="chart-svg"
          viewBox="0 0 ${this.VIEWBOX_WIDTH} ${this.VIEWBOX_HEIGHT}"
          preserveAspectRatio="xMidYMid meet"
        >
          ${this.renderGridLines(this.VIEWBOX_WIDTH,this.VIEWBOX_HEIGHT)}
          ${this.renderAxes(this.VIEWBOX_WIDTH,this.VIEWBOX_HEIGHT)}
          ${this.renderTemperatureLine(e,this.VIEWBOX_WIDTH,this.VIEWBOX_HEIGHT)}
          ${this.renderTemperaturePoints(e,this.VIEWBOX_WIDTH,this.VIEWBOX_HEIGHT)}
        </svg>
      </div>
    `}renderActionButtons(){const t=this.getCurrentDaySchedule(),e=t&&t.transitions.length<6;return G`
      <div class="action-buttons-container">
        <button
          class="action-button"
          @click="${this.addTransition}"
          ?disabled="${!e||this.disabled}"
          title="${e?"Add a time and temperature":"Maximum 6 setpoints per day"}"
        >
          + Add setpoint
        </button>
        <button
          class="action-button secondary"
          @click="${this.copyToOtherDays}"
          ?disabled="${this.disabled}"
          title="Copy this day's schedule to other days"
        >
          Copy to Other Days
        </button>
      </div>
    `}copyToOtherDays(){this.disabled||this.dispatchEvent(new CustomEvent("copy-requested",{detail:{day:this.selectedDay},bubbles:!0,composed:!0}))}render(){return this.schedule?G`
      <div class="graph-container">
        ${this.renderDaySelector()}
        ${this.renderChart()}
        ${this.renderActionButtons()}
      </div>
    `:G`
        <div class="empty-state">
          <div class="empty-state-text">No schedule data available</div>
        </div>
      `}updated(){const t=this.renderRoot.querySelector(".chart-svg");t&&(this.boundSvgMouseDown||(this.boundSvgMouseDown=this.handleSvgMouseDown.bind(this)),this.boundSvgTouchStart||(this.boundSvgTouchStart=this.handleSvgTouchStart.bind(this)),this.boundSvgDblClick||(this.boundSvgDblClick=this.handleSvgDblClick.bind(this)),t.hasAttribute("data-listener-attached")||(t.addEventListener("mousedown",this.boundSvgMouseDown),t.addEventListener("touchstart",this.boundSvgTouchStart,{passive:!1}),t.addEventListener("dblclick",this.boundSvgDblClick),t.setAttribute("data-listener-attached","true")))}handleSvgMouseDown(t){const e=t,i=e.target.closest(".point-group");if(i){const t=i.getAttribute("data-point-index");if(null!==t){const i=parseInt(t,10);this.handlePointMouseDown(i,e)}}}handleSvgTouchStart(t){const e=t,i=e.touches[0];let r=e.target;if(!(r&&r instanceof Element)){const t=document.elementFromPoint(i.clientX,i.clientY);if(!t)return;r=t}const s=r.closest(".point-group");if(s){const t=s.getAttribute("data-point-index");if(null!==t){const i=parseInt(t,10);this.handlePointTouchStart(i,e)}}}handleSvgDblClick(t){if(this.disabled)return;const e=t.target.closest(".point-group");if(e){const t=e.getAttribute("data-point-index");if(null!==t){const e=parseInt(t,10);this.removeTransitionAtIndex(e)}}}removeTransitionAtIndex(t){const e=this.getCurrentDaySchedule();if(!e)return;if(e.transitions.length<=1)return;const i=e.transitions.filter((e,i)=>i!==t);this.dispatchTransitionUpdate(i,!0)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp),document.removeEventListener("touchmove",this.handleTouchMove),document.removeEventListener("touchend",this.handleTouchEnd),document.removeEventListener("touchcancel",this.handleTouchEnd)}};Gt.styles=[Ut,a`
      :host {
        display: block;
      }

      .graph-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      /* Day selector buttons */
      .day-selector {
        display: flex;
        gap: 6px;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding: 8px 0;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .day-selector::-webkit-scrollbar {
        display: none;
      }

      .day-button {
        padding: 8px 16px;
        border: 1px solid var(--divider-color, #dddddd);
        background: var(--card-background-color, #ffffff);
        color: var(--primary-text-color, #333333);
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 60px;
        flex-shrink: 0;
      }

      .day-button:hover:not(:disabled):not(.active) {
        background: var(--secondary-background-color, #f0f0f0);
        border-color: var(--primary-color, #03a9f4);
      }

      .day-button.active {
        background: var(--primary-color, #03a9f4);
        color: white;
        border-color: var(--primary-color, #03a9f4);
        font-weight: 600;
      }

      .day-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Chart container */
      .chart-wrapper {
        position: relative;
        background: var(--card-background-color, #ffffff);
        border: 1px solid var(--divider-color, #dddddd);
        border-radius: 8px;
        padding: 20px;
        min-height: 160px;
      }

      .chart-svg {
        width: 100%;
        height: auto;
        aspect-ratio: 1000 / 400;
        user-select: none;
        touch-action: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
      }

      /* Chart elements */
      .grid-line {
        stroke: var(--divider-color, #dddddd);
        stroke-width: 1;
        stroke-dasharray: 3, 3;
        opacity: 0.5;
      }

      .axis-line {
        stroke: var(--secondary-text-color, #666666);
        stroke-width: 2;
      }

      .axis-label {
        fill: var(--secondary-text-color, #666666);
        font-size: 9px;
        font-family: var(--paper-font-body1_-_font-family, Arial, sans-serif);
      }

      .temperature-line {
        fill: none;
        stroke-width: 2;
        stroke-linejoin: round;
      }

      .point-group {
        cursor: grab;
        pointer-events: auto;
        -webkit-tap-highlight-color: transparent;
      }

      .point-group:active {
        cursor: grabbing;
      }

      .temperature-point {
        transition: r 0.2s ease, stroke-width 0.2s ease;
        pointer-events: auto;
      }

      .point-group:hover .temperature-point {
        stroke-width: 3;
      }

      .temperature-point.dragging {
        stroke-width: 4;
      }

      .point-label {
        fill: var(--primary-text-color, #333333);
        font-size: 10px;
        font-weight: 600;
        paint-order: stroke fill;
        stroke: var(--card-background-color, #ffffff);
        stroke-width: 4px;
        stroke-linejoin: round;
        pointer-events: none;
        font-family: var(--paper-font-body1_-_font-family, Arial, sans-serif);
      }

      /* Action buttons container */
      .action-buttons-container {
        display: flex;
        justify-content: center;
        gap: 12px;
        padding-top: 8px;
      }

      .action-button {
        padding: 10px 20px;
        background: var(--primary-color, #03a9f4);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .action-button:hover:not(:disabled) {
        background: var(--dark-primary-color, #0288d1);
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .action-button:active:not(:disabled) {
        transform: translateY(0);
      }

      .action-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .action-button.secondary {
        background: var(--secondary-background-color, #f0f0f0);
        color: var(--primary-text-color, #333333);
        border: 1px solid var(--divider-color, #dddddd);
      }

      .action-button.secondary:hover:not(:disabled) {
        background: var(--divider-color, #dddddd);
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .day-button {
          padding: 6px 12px;
          font-size: 12px;
          min-width: 50px;
        }

        .chart-wrapper {
          padding: 12px;
          min-height: 160px;
        }

        .chart-svg {
          height: auto;
        }
      }

      @media (max-width: 480px) {
        .day-selector {
          gap: 4px;
          justify-content: flex-start;
          padding: 8px 4px;
        }

        .day-button {
          padding: 6px 8px;
          font-size: 11px;
          min-width: 40px;
        }

        .chart-wrapper {
          padding: 8px;
          min-height: 160px;
        }

        .chart-svg {
          height: auto;
        }
      }
    `],t([mt({type:Object})],Gt.prototype,"schedule",void 0),t([mt({type:Boolean})],Gt.prototype,"disabled",void 0),t([ft()],Gt.prototype,"selectedDay",void 0),t([ft()],Gt.prototype,"draggingPoint",void 0),t([ft()],Gt.prototype,"dragStartX",void 0),t([ft()],Gt.prototype,"dragStartY",void 0),t([ft()],Gt.prototype,"isDragging",void 0),Gt=t([ut("hive-schedule-graph-view")],Gt);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xt=2;let Vt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:Yt}=at,Ft=t=>t,Jt=()=>document.createComment(""),Qt=(t,e,i)=>{const r=t._$AA.parentNode,s=void 0===e?t._$AB:e._$AA;if(void 0===i){const e=r.insertBefore(Jt(),s),o=r.insertBefore(Jt(),s);i=new Yt(e,o,t,t.options)}else{const e=i._$AB.nextSibling,o=i._$AM,n=o!==t;if(n){let e;i._$AQ?.(t),i._$AM=t,void 0!==i._$AP&&(e=t._$AU)!==o._$AU&&i._$AP(e)}if(e!==s||n){let t=i._$AA;for(;t!==e;){const e=Ft(t).nextSibling;Ft(r).insertBefore(t,s),t=e}}}return i},Kt=(t,e,i=t)=>(t._$AI(e,i),t),Zt={},te=(t,e=Zt)=>t._$AH=e,ee=t=>{t._$AR(),t._$AA.remove()},ie=(t,e,i)=>{const r=new Map;for(let s=e;s<=i;s++)r.set(t[s],s);return r},re=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends Vt{constructor(t){if(super(t),t.type!==Xt)throw Error("repeat() can only be used in text expressions")}dt(t,e,i){let r;void 0===i?i=e:void 0!==e&&(r=e);const s=[],o=[];let n=0;for(const e of t)s[n]=r?r(e,n):n,o[n]=i(e,n),n++;return{values:o,keys:s}}render(t,e,i){return this.dt(t,e,i).values}update(t,[e,i,r]){const s=(t=>t._$AH)(t),{values:o,keys:n}=this.dt(e,i,r);if(!Array.isArray(s))return this.ut=n,o;const a=this.ut??=[],d=[];let l,c,h=0,u=s.length-1,p=0,g=o.length-1;for(;h<=u&&p<=g;)if(null===s[h])h++;else if(null===s[u])u--;else if(a[h]===n[p])d[p]=Kt(s[h],o[p]),h++,p++;else if(a[u]===n[g])d[g]=Kt(s[u],o[g]),u--,g--;else if(a[h]===n[g])d[g]=Kt(s[h],o[g]),Qt(t,d[g+1],s[h]),h++,g--;else if(a[u]===n[p])d[p]=Kt(s[u],o[p]),Qt(t,s[h],s[u]),u--,p++;else if(void 0===l&&(l=ie(n,p,g),c=ie(a,h,u)),l.has(a[h]))if(l.has(a[u])){const e=c.get(n[p]),i=void 0!==e?s[e]:null;if(null===i){const e=Qt(t,s[h]);Kt(e,o[p]),d[p]=e}else d[p]=Kt(i,o[p]),Qt(t,s[h],i),s[e]=null;p++}else ee(s[u]),u--;else ee(s[h]),h++;for(;p<=g;){const e=Qt(t,d[g+1]);Kt(e,o[p]),d[p++]=e}for(;h<=u;){const t=s[h++];null!==t&&ee(t)}return this.ut=n,te(t,d),V}});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let se=class extends ct{constructor(){super(...arguments),this.transition={time:"00:00",temperature:20},this.index=0,this.canDelete=!0,this.disabled=!1,this._validationError=null}_getHour(){return this._getTime().split(":")[0]||"00"}_getMinute(){return this._getTime().split(":")[1]||"00"}_handleHourChange(t){const e=`${t.target.value}:${this._getMinute()}`;this._updateTime(e)}_handleMinuteChange(t){const e=t.target.value,i=`${this._getHour()}:${e}`;this._updateTime(i)}_updateTime(t){if(t===this.transition.time)return;this._validationError=null;const e={...this.transition,time:t};this._dispatchTransitionChanged(e)}_handleTemperatureChange(t){const e=t.target,i=parseFloat(e.value),r=this._clampTemperature(i),s={...this.transition,temperature:r};this._dispatchTransitionChanged(s)}_handleDelete(){this.dispatchEvent(new CustomEvent("transition-deleted",{detail:{index:this.index,id:this.transition.id},bubbles:!0,composed:!0}))}_dispatchTransitionChanged(t){this.dispatchEvent(new CustomEvent("transition-changed",{detail:{index:this.index,id:this.transition.id,transition:t},bubbles:!0,composed:!0}))}_clampTemperature(t){let e=Math.max(5,Math.min(32,t));return e=Math.round(2*e)/2,e}_getTemperatureColor(){return Lt(this.transition?.temperature??20)}_getTime(){return this.transition?.time??"00:00"}_getTemperature(){return this.transition?.temperature??20}render(){if(!this.transition)return G`<div class="transition-editor">Loading...</div>`;const t=this.disabled,e=null!==this._validationError;return G`
      <div
        class="transition-editor ${this.disabled?"disabled":""} ${e?"has-error":""}"
      >
        <div class="transition-number">${this.index+1}</div>

        <div class="transition-content">
          <!-- Time Input -->
          <div class="time-field">
            <label class="field-label">Time</label>
            <div class="time-picker">
              <select
                class="time-select ${e?"error":""}"
                .value=${this._getHour()}
                @change=${this._handleHourChange}
                ?disabled=${t}
                title="Select hour"
              >
                ${Array.from({length:24},(t,e)=>e.toString().padStart(2,"0")).map(t=>G`<option value=${t} ?selected=${t===this._getHour()}>${t}</option>`)}
              </select>
              <span class="time-separator">:</span>
              <select
                class="time-select ${e?"error":""}"
                .value=${this._getMinute()}
                @change=${this._handleMinuteChange}
                ?disabled=${t}
                title="Select minutes"
              >
                ${Array.from({length:60},(t,e)=>String(e).padStart(2,"0")).map(t=>G`<option value=${t} ?selected=${t===this._getMinute()}>${t}</option>`)}
              </select>
            </div>
            ${e?G`<div class="error-message">${this._validationError}</div>`:""}

          </div>

          <!-- Temperature Slider -->
          <div class="temperature-field">
            <label class="field-label">Temperature</label>
            <select aria-label="Heating mode" .value=${1===this.transition.temperature?"off":"heat"}
              ?disabled=${this.disabled}
              @change=${t=>this._dispatchTransitionChanged({...this.transition,temperature:"off"===t.target.value?1:20})}>
              <option value="heat" ?selected=${1!==this.transition.temperature}>Heating</option>
              <option value="off" ?selected=${1===this.transition.temperature}>Heating off (1°C)</option>
            </select>
            <div class="temperature-control">
              <input
                type="range"
                class="temperature-slider"
                style="--temperature-color: ${this._getTemperatureColor()}"
                min="5"
                max="32"
                step="0.5"
                .value=${this._getTemperature().toString()}
                @input=${this._handleTemperatureChange}
                ?disabled=${this.disabled||1===this.transition.temperature}
                title="Adjust heating temperature (5–32°C)"
              />
              <div
                class="temperature-display"
                style="background-color: ${this._getTemperatureColor()}"
              >
                ${this._getTemperature().toFixed(1)}°C
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        ${this.canDelete&&!this.disabled?G`
              <div class="transition-actions">
                <button
                  class="button-icon remove"
                  @click=${this._handleDelete}
                  title="Delete setpoint"
                  aria-label="Delete setpoint ${this.index+1}"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            `:""}
      </div>
    `}};se.styles=[Ut,a`
      :host {
        display: block;
      }

      .transition-editor {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--primary-background-color, #f5f5f5);
        border-radius: 8px;
        border: 1px solid var(--divider-color);
      }

      .transition-editor.disabled {
        opacity: 0.6;
        pointer-events: none;
      }

      .transition-editor.has-error {
        border-color: var(--error-color);
        background: rgba(244, 67, 54, 0.05);
      }

      .transition-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        font-size: 13px;
        font-weight: 600;
        flex-shrink: 0;
      }

      .transition-content {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        flex-wrap: wrap;
      }

      .time-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 120px;
      }

      .temperature-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
        min-width: 200px;
      }

      .field-label {
        font-size: 11px;
        font-weight: 600;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .time-picker {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .time-select {
        padding: 8px 4px;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        font-size: 14px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-family: monospace;
        transition: all 0.2s ease;
        cursor: pointer;
        min-width: 50px;
        text-align: center;
        -webkit-appearance: none;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 6px center;
        padding-right: 20px;
      }

      .time-select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(3, 169, 244, 0.2);
      }

      .time-select:disabled {
        cursor: not-allowed;
        background-color: var(--card-background-color);
        color: var(--primary-text-color);
        opacity: 0.7;
        background-image: none;
      }

      .time-select.error {
        border-color: var(--error-color);
      }

      .time-separator {
        font-size: 16px;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .temperature-control {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .temperature-slider {
        flex: 1;
        min-width: 100px;
        width: 100%;
        height: 8px;
        border-radius: 4px;
        outline: none;
        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;
      }

      .temperature-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: white;
        border: 3px solid var(--temperature-color, var(--primary-color));
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease;
      }

      .temperature-slider::-webkit-slider-thumb:hover {
        transform: scale(1.15);
      }

      .temperature-slider::-webkit-slider-thumb:active {
        transform: scale(1.25);
      }

      .temperature-slider::-moz-range-thumb {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: white;
        border: 3px solid var(--temperature-color, var(--primary-color));
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease;
      }

      .temperature-slider::-moz-range-thumb:hover {
        transform: scale(1.15);
      }

      .temperature-slider::-moz-range-thumb:active {
        transform: scale(1.25);
      }

      .temperature-display {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px 14px;
        border-radius: 6px;
        color: white;
        font-size: 15px;
        font-weight: 700;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        min-width: 70px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .transition-actions {
        display: flex;
        gap: 4px;
        flex-shrink: 0;
      }

      .error-message {
        font-size: 11px;
        color: var(--error-color);
        margin-top: 2px;
      }

      /* Responsive adjustments */
      @media (max-width: 600px) {
        .transition-editor {
          flex-direction: column;
          align-items: stretch;
          gap: 8px;
          padding: 10px;
        }

        .transition-number {
          align-self: flex-start;
        }

        .transition-content {
          flex-direction: column;
          align-items: stretch;
          width: 100%;
        }

        .time-field {
          width: 100%;
          min-width: auto;
        }

        .temperature-field {
          width: 100%;
          min-width: auto;
        }

        .temperature-control {
          flex-direction: column;
          align-items: stretch;
          gap: 8px;
        }

        .temperature-slider {
          width: 100%;
          min-width: unset;
          height: 12px;
        }

        .temperature-slider::-webkit-slider-thumb {
          width: 28px;
          height: 28px;
        }

        .temperature-slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
        }

        .temperature-display {
          align-self: center;
          min-width: 80px;
        }

        .transition-actions {
          align-self: flex-end;
          margin-top: 4px;
        }
      }
    `],t([mt({type:Object})],se.prototype,"transition",void 0),t([mt({type:Number})],se.prototype,"index",void 0),t([mt({type:Boolean})],se.prototype,"canDelete",void 0),t([mt({type:Boolean})],se.prototype,"disabled",void 0),t([ft()],se.prototype,"_validationError",void 0),se=t([ut("hive-transition-editor")],se);let oe=class extends ct{constructor(){super(...arguments),this.day="monday",this.schedule={transitions:[]},this.open=!1,this._workingSchedule={transitions:[]},this._errors=[]}updated(t){t.has("schedule")&&this.open&&(this._workingSchedule=At(this.schedule),this._errors=[]),t.has("open")&&this.open&&(this._workingSchedule=At(this.schedule),this._errors=[])}_addTransition(){const t=[...this._workingSchedule.transitions];if(t.length>=6)return;let e="12:00",i=20;if(t.length>0){const r=t[t.length-1];i=r.temperature;try{const t=r.time.match(/^(\d{2}):(\d{2})$/);if(t){const i=parseInt(t[1],10),r=parseInt(t[2],10);let s=i+1;s>23&&(s=23),e=`${s.toString().padStart(2,"0")}:${r.toString().padStart(2,"0")}`}}catch(t){console.warn("Error calculating next time:",t)}}const r={id:kt(),time:e,temperature:i};this._workingSchedule={transitions:[...t,r]},this._autoSave()}_updateTransitionById(t,e){if(!t)return;const i=this._workingSchedule.transitions.map(i=>i.id===t?{...e,id:t}:i);this._workingSchedule={transitions:i},this._autoSave()}_deleteTransitionById(t){if(!t||this._workingSchedule.transitions.length<=1)return;const e=this._workingSchedule.transitions.filter(e=>e.id!==t);this._workingSchedule={transitions:e},this._autoSave()}_validate(){const t=wt(this._workingSchedule);return this._errors=t.errors,t.valid}_autoSave(){const t=wt(this._workingSchedule);this._errors=t.errors,this.dispatchEvent(new CustomEvent("schedule-changed",{detail:{day:this.day,schedule:this._workingSchedule},bubbles:!0,composed:!0}))}_close(){this.dispatchEvent(new CustomEvent("editor-closed",{bubbles:!0,composed:!0}))}_requestCopy(){this.dispatchEvent(new CustomEvent("copy-requested",{detail:{day:this.day,schedule:this._workingSchedule},bubbles:!0,composed:!0}))}_handleOverlayClick(t){t.target===t.currentTarget&&this._close()}_handleTransitionChange(t){const{id:e,transition:i}=t.detail;this._updateTransitionById(e,i)}_handleTransitionDelete(t){const{id:e}=t.detail;this._deleteTransitionById(e)}_getDayDisplayName(){return this.day.charAt(0).toUpperCase()+this.day.slice(1)}render(){if(!this.open)return G``;const t=this._workingSchedule.transitions.length<6,e=this._errors.length>0;return G`
      <div class="modal-overlay" @click=${this._handleOverlayClick}>
        <div class="modal">
          <!-- Modal Header -->
          <div class="modal-header">
            <h2 class="modal-title">${this._getDayDisplayName()} Schedule</h2>
            <button
              class="button-icon close"
              @click=${this._close}
              title="Close editor"
              aria-label="Close editor"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="modal-content">
            <div class="editor-content">
              <!-- Validation Errors -->
              ${e?G`
                <div class="message message-error">
                  <strong>Validation Errors:</strong>
                  <ul class="error-list">
                    ${this._errors.map(t=>G`<li>${t}</li>`)}
                  </ul>
                </div>
              `:""}

              <!-- Transitions List -->
              <div class="transitions-container">
                <div class="transitions-list">
                  ${re(this._workingSchedule.transitions,t=>t.id,(t,e)=>G`
                      <hive-transition-editor
                        .index=${e}
                        .transition=${t}
                        .canDelete=${this._workingSchedule.transitions.length>1}
                        @transition-changed=${this._handleTransitionChange}
                        @transition-deleted=${this._handleTransitionDelete}
                      ></hive-transition-editor>
                    `)}
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="button-row">
                <button
                  class="button button-primary"
                  ?disabled=${!t}
                  @click=${this._addTransition}
                  title=${t?"Add a time and temperature":"Maximum 6 setpoints per day"}
                >
                  + Add setpoint
                </button>
                <button
                  class="button button-secondary"
                  @click=${this._requestCopy}
                >
                  Copy to Other Days...
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}};oe.styles=[Ut,a`
      :host {
        display: contents;
      }

      .editor-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .transitions-container {
        max-height: 400px;
        overflow-y: auto;
        padding-right: 8px;
      }

      .transitions-container::-webkit-scrollbar {
        width: 8px;
      }

      .transitions-container::-webkit-scrollbar-track {
        background: var(--primary-background-color, #f5f5f5);
        border-radius: 4px;
      }

      .transitions-container::-webkit-scrollbar-thumb {
        background: var(--divider-color);
        border-radius: 4px;
      }

      .transitions-container::-webkit-scrollbar-thumb:hover {
        background: var(--secondary-text-color);
      }

      .transitions-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .error-list {
        margin: 0;
        padding-left: 20px;
      }

      .error-list li {
        margin: 4px 0;
      }

      .button-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        padding-top: 8px;
      }

      .button-row .button {
        flex: 1;
        min-width: 120px;
        justify-content: center;
      }

      /* Mobile responsiveness */
      @media (max-width: 600px) {
        .transitions-container {
          max-height: 60vh;
          padding-right: 4px;
        }

        .transitions-list {
          gap: 8px;
        }

        .button-row {
          flex-direction: column;
        }

        .button-row .button {
          min-width: unset;
          width: 100%;
        }
      }
    `],t([mt({type:String})],oe.prototype,"day",void 0),t([mt({type:Object})],oe.prototype,"schedule",void 0),t([mt({type:Boolean})],oe.prototype,"open",void 0),t([ft()],oe.prototype,"_workingSchedule",void 0),t([ft()],oe.prototype,"_errors",void 0),oe=t([ut("hive-day-schedule-editor")],oe);let ne=class extends ct{constructor(){super(...arguments),this.sourceDay="monday",this.open=!1,this.selectedDays=new Set,this.ALL_DAYS=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"],this.WEEKDAYS=["monday","tuesday","wednesday","thursday","friday"],this.WEEKEND=["saturday","sunday"]}_toggleDay(t){const e=new Set(this.selectedDays);e.has(t)?e.delete(t):e.add(t),this.selectedDays=e}_selectWeekdays(){const t=new Set;this.WEEKDAYS.forEach(e=>{e!==this.sourceDay&&t.add(e)}),this.selectedDays=t}_selectWeekend(){const t=new Set;this.WEEKEND.forEach(e=>{e!==this.sourceDay&&t.add(e)}),this.selectedDays=t}_selectAll(){const t=new Set;this.ALL_DAYS.forEach(e=>{e!==this.sourceDay&&t.add(e)}),this.selectedDays=t}_clearSelection(){this.selectedDays=new Set}_handleCopy(){if(0===this.selectedDays.size)return;const t=new CustomEvent("copy-confirmed",{detail:{sourceDay:this.sourceDay,targetDays:Array.from(this.selectedDays)},bubbles:!0,composed:!0});this.dispatchEvent(t),this._clearSelection()}_handleClose(){const t=new CustomEvent("dialog-closed",{bubbles:!0,composed:!0});this.dispatchEvent(t),this._clearSelection()}_handleOverlayClick(t){t.target===t.currentTarget&&this._handleClose()}_handleCheckboxChange(t,e){e.stopPropagation(),this._toggleDay(t)}_capitalize(t){return t.charAt(0).toUpperCase()+t.slice(1)}render(){if(!this.open)return G``;const t=this.ALL_DAYS.filter(t=>t!==this.sourceDay);return G`
      <div class="modal-overlay" @click=${this._handleOverlayClick}>
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title">Copy ${this._capitalize(this.sourceDay)} schedule to...</h2>
          </div>

          <div class="modal-content">
            <!-- Quick select buttons -->
            <div class="quick-select-buttons">
              <button
                class="quick-select-button"
                @click=${this._selectWeekdays}
                title="Select Monday through Friday"
              >
                Weekdays
              </button>
              <button
                class="quick-select-button"
                @click=${this._selectWeekend}
                title="Select Saturday and Sunday"
              >
                Weekend
              </button>
              <button
                class="quick-select-button"
                @click=${this._selectAll}
                title="Select all days except ${this._capitalize(this.sourceDay)}"
              >
                All
              </button>
              <button
                class="quick-select-button"
                @click=${this._clearSelection}
                title="Clear all selections"
              >
                Clear
              </button>
            </div>

            <!-- Day checkboxes -->
            <div class="copy-dialog-days">
              ${t.map(t=>G`
                  <label
                    class="day-checkbox ${this.selectedDays.has(t)?"checked":""}"
                    @click=${()=>this._toggleDay(t)}
                  >
                    <input
                      type="checkbox"
                      .checked=${this.selectedDays.has(t)}
                      @change=${e=>this._handleCheckboxChange(t,e)}
                      @click=${t=>t.stopPropagation()}
                    />
                    <span class="day-checkbox-label">${this._capitalize(t)}</span>
                  </label>
                `)}
            </div>
          </div>

          <div class="modal-footer">
            <button class="button button-secondary" @click=${this._handleClose}>
              Cancel
            </button>
            <button
              class="button button-primary"
              @click=${this._handleCopy}
              ?disabled=${0===this.selectedDays.size}
            >
              Copy to ${this.selectedDays.size} ${1===this.selectedDays.size?"day":"days"}
            </button>
          </div>
        </div>
      </div>
    `}};ne.styles=[Ut,a`
      :host {
        display: block;
      }

      .quick-select-buttons {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }

      .quick-select-button {
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        flex: 1;
        min-width: 80px;
        text-align: center;
      }

      .quick-select-button:hover {
        background: var(--primary-background-color, #f5f5f5);
        border-color: var(--primary-color);
      }

      .quick-select-button:active {
        transform: scale(0.98);
      }

      .copy-dialog-days {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
      }

      .day-checkbox {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border: 2px solid var(--divider-color);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
      }

      .day-checkbox:hover {
        background: var(--primary-background-color, #f5f5f5);
        border-color: var(--primary-color);
      }

      .day-checkbox.checked {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .day-checkbox input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
        margin: 0;
        flex-shrink: 0;
      }

      .day-checkbox-label {
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        text-transform: capitalize;
        flex: 1;
      }

      .modal-footer {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .modal-footer .button {
        min-width: 100px;
      }
    `],t([mt({type:String})],ne.prototype,"sourceDay",void 0),t([mt({type:Boolean})],ne.prototype,"open",void 0),t([ft()],ne.prototype,"selectedDays",void 0),ne=t([ut("hive-copy-schedule-dialog")],ne);let ae=class extends ct{constructor(){super(...arguments),this._schedule=null,this._originalSchedule=null,this._viewMode="week",this._editingDay=null,this._showCopyDialog=!1,this._copySourceDay=null,this._saving=!1,this._error=null,this._hasUnsavedChanges=!1,this._loadError=null,this._message=null,this._conflicts=[],this._entities=null,this._resolving=!1,this._generation=0,this._receiverSignature="",this._coordinator=new Ot}static getConfigElement(){return document.createElement("hive-scheduler-card-editor")}static getStubConfig(){return{entity:""}}_sameDay(t,e){try{return Et(t)===Et(e)}catch{return JSON.stringify(t.transitions.map(({time:t,temperature:e})=>({time:t,temperature:e})))===JSON.stringify(e.transitions.map(({time:t,temperature:e})=>({time:t,temperature:e})))}}_updateDirty(){this._hasUnsavedChanges=!!this._schedule&&!!this._originalSchedule&&yt.some(t=>!this._sameDay(this._schedule[t],this._originalSchedule[t]))}_deepCopySchedule(t){const e={};for(const i of yt)e[i]={transitions:t[i].transitions.map(t=>({...t}))};return e}setConfig(t){if(!t.entity||!/^climate\.[a-z0-9_]+$/.test(t.entity))throw new Error("You must specify a climate entity");if(t.mqtt_device&&zt(t.mqtt_device),t.view_mode&&!["week","graph"].includes(t.view_mode))throw new Error("view_mode must be week or graph");this._generation++,this._coordinator.cancel(),this._entities=null,this._receiverSignature="",this._resolving=!1,this._schedule=this._originalSchedule=null,this._conflicts=[],this._error=this._loadError=this._message=null,this._saving=this._hasUnsavedChanges=!1,this._editingDay=null,this._showCopyDialog=!1,this.config={...t,schedule_entities:{...t.schedule_entities},view_mode:t.view_mode||"week"},this._viewMode=this.config.view_mode}getCardSize(){return 4}connectedCallback(){super.connectedCallback(),this.requestUpdate("hass")}disconnectedCallback(){super.disconnectedCallback(),this._generation++,this._resolving=!1,this._coordinator.cancel(),this._saving&&(this._error="Save interrupted. Edits were preserved; refresh receiver schedules before retrying."),this._saving=!1}updated(t){if(super.updated(t),!this.hass||!this.config||!t.has("hass")&&!t.has("config"))return;const e={...this.hass.states};for(const[t,i]of Object.entries(this._latestHass?.states||{})){const r=e[t];r?.last_updated&&i.last_updated&&r.last_updated<i.last_updated&&(e[t]=i)}this._latestHass={...this.hass,states:e},this._coordinator.updateHass(this._latestHass),this._saving||this._loadSchedule()}async _loadSchedule(){if(!this.hass||!this.config||this._resolving)return;const t=this._generation;try{if(!this.hass.states[this.config.entity])throw new Error(`Climate entity not found: ${this.config.entity}`);if(!this._entities){let e;this._resolving=!0;try{const i=await Promise.race([Nt(this.hass,this.config),new Promise((t,i)=>{e=setTimeout(()=>i(new Error("Entity discovery timed out. Configure schedule_entities explicitly.")),5e3)})]);if(t!==this._generation)return;this._entities=i}finally{clearTimeout(e),t===this._generation&&(this._resolving=!1)}}const e=this._latestHass||this.hass;if(!e.states[this.config.entity])throw new Error(`Climate entity not found: ${this.config.entity}`);const i=JSON.stringify([e.states[this.config.entity]?.state,...yt.map(t=>e.states[this._entities[t]]?.state)]);if(i===this._receiverSignature&&this._schedule&&this._originalSchedule&&!this._loadError)return;const r=function(t,e){const i={},r=[];for(const s of yt)try{const r=t.states[e[s]]?.state;if(Rt(r))throw new Error(`Entity ${e[s]} is missing or unavailable`);i[s]=Ct(r)}catch(t){r.push(`${s}: ${t instanceof Error?t.message:t}`)}if(r.length)throw new Error(r.join("; "));return i}(e,this._entities);if(this._receiverSignature=i,this._schedule&&this._originalSchedule){const t=this._deepCopySchedule(this._schedule),e=this._deepCopySchedule(this._originalSchedule);for(const i of yt)this._sameDay(t[i],e[i])?(t[i]=r[i],e[i]=r[i]):this._sameDay(r[i],e[i])||this._conflicts.includes(i)||(this._conflicts=[...this._conflicts,i]);this._schedule=t,this._originalSchedule=e}else this._schedule=this._deepCopySchedule(r),this._originalSchedule=this._deepCopySchedule(r);this._loadError=null,this._updateDirty()}catch(e){t===this._generation&&(this._loadError=e instanceof Error?e.message:String(e))}}async _reloadSchedule(){if(this._saving)return;const t=this._generation;if(this._schedule=this._originalSchedule=null,this._conflicts=[],this._error=this._message=null,this._hasUnsavedChanges=!1,await this._loadSchedule(),t===this._generation&&this.isConnected)try{const e=await Pt(this.hass,this.config);if(t!==this._generation||!this.isConnected)return;await this.hass.callService("mqtt","publish",{topic:`zigbee2mqtt/${e}/get`,payload:JSON.stringify(Object.fromEntries(yt.map(t=>[`schedule_${t}`,""]))),retain:!1})}catch(e){t===this._generation&&(this._error=`Could not request receiver schedules: ${e instanceof Error?e.message:String(e)}`)}}_handleDaySelected(t){this._saving||(this._editingDay=t.detail.day)}_handleScheduleChanged(t){this._schedule&&!this._saving&&(this._schedule={...this._schedule,[t.detail.day]:t.detail.schedule},this._message=null,this._updateDirty())}_handleCopyRequested(t){this._saving||(this._copySourceDay=t.detail.day,this._showCopyDialog=!0)}_handleCopyConfirmed(t){if(!this._schedule||!this._copySourceDay||this._saving)return;const e=this._schedule[this._copySourceDay],i={...this._schedule};for(const r of t.detail.targetDays)i[r]={transitions:e.transitions.map(t=>({time:t.time,temperature:t.temperature}))};this._schedule=i,this._message=null,this._updateDirty(),this._handleDialogClosed()}_handleEditorClosed(){this._editingDay=null}_handleDialogClosed(){this._showCopyDialog=!1,this._copySourceDay=null}async _saveSchedule(){if(this._saving||!this._schedule||!this._originalSchedule||!this._entities)return;if(this._conflicts.length||this._loadError)return void(this._error="Resolve receiver errors or reload conflicting schedules before saving.");const t=function(t){const e=[];return["sunday","monday","tuesday","wednesday","thursday","friday","saturday"].forEach(i=>{const r=wt(t[i]);r.valid||r.errors.forEach(t=>{e.push(`${i.charAt(0).toUpperCase()+i.slice(1)}: ${t}`)})}),{valid:0===e.length,errors:e}}(this._schedule);if(!t.valid)return void(this._error=t.errors.join("; "));const e=this._generation,i=this._deepCopySchedule(this._schedule);this._saving=!0,this._editingDay=null,this._showCopyDialog=!1,this._error=this._message=null;try{const t=await this._coordinator.save(this._latestHass||this.hass,this.config,this._entities,this._originalSchedule,i);if(e!==this._generation)return;if("skipped"!==t.status){const e=this._deepCopySchedule(this._originalSchedule);for(const r of t.daysUpdated)e[r]=At(i[r]);this._originalSchedule=e}"error"===t.status?this._error=t.error:this._message="success"===t.status?"Saved and verified with Hive receiver.":"No schedule changes to save.",this._updateDirty()}finally{e===this._generation&&(this._saving=!1,await this._loadSchedule())}}_toggleViewMode(){this._viewMode="week"===this._viewMode?"graph":"week"}_renderScheduleView(){return this._schedule?"week"===this._viewMode?G`
        <hive-schedule-week-view
          .schedule=${this._schedule}
          .disabled=${this._saving}
          @day-selected=${this._handleDaySelected}
        ></hive-schedule-week-view>
      `:G`
      <hive-schedule-graph-view
        .schedule=${this._schedule}
        .disabled=${this._saving}
        @schedule-changed=${this._handleScheduleChanged}
        @copy-requested=${this._handleCopyRequested}
      ></hive-schedule-graph-view>
    `:this._loadError?G``:G`<div class="loading-spinner"><div class="spinner"></div></div>`}render(){if(!this.config)return G`<ha-card>
        <div class="message message-error">
          Configuration required
        </div>
      </ha-card>`;const t=this.hass?function(t,e){const i=t.states[e];return i?{name:i.attributes.friendly_name||e,available:"unavailable"!==i.state,currentTemp:i.attributes.current_temperature,targetTemp:i.attributes.temperature||i.attributes.target_temperature}:(console.warn(`Entity not found: ${e}`),null)}(this.hass,this.config.entity):null,e=this.config.name||t?.name||this.config.entity;return G`
      <ha-card>
        <div class="card-header">
          <span class="card-title">${e}</span>
          <div class="card-actions">
            <button class="button" ?disabled=${this._saving} @click=${this._reloadSchedule}>${this._hasUnsavedChanges?"Discard edits and reload":"Refresh"}</button>
            <button
              class="button button-icon"
              @click=${this._toggleViewMode}
              title="Toggle view mode"
            >
              ${"week"===this._viewMode?"📅":"📊"}
            </button>
            <button
              class="button button-primary save-button ${this._saving?"loading":""}"
              @click=${this._saveSchedule}
              ?disabled=${!this._hasUnsavedChanges||this._saving||!this._originalSchedule||!!this._loadError||this._conflicts.length>0||!this.hass?.user?.is_admin}
            >
              ${this._saving?"Verifying...":"Save"}
            </button>
          </div>
        </div>

        <div class="card-content">
          ${this._error?G`<div class="message message-error">${this._error}</div>`:""}

          ${this._loadError?G`<div class="message message-error">${this._loadError}</div>`:""}
          ${this._conflicts.length?G`<div class="message message-error">Receiver changed ${this._conflicts.join(", ")} while you were editing. Your edits are preserved. Reload before saving.</div>`:""}
          ${this.hass?.user?.is_admin?"":G`<div class="message">Sign in as an administrator to verify and save schedules.</div>`}
          ${this._message?G`<div class="message" role="status">${this._message}</div>`:""}
          ${this._renderScheduleView()}
        </div>
      </ha-card>

      ${this._schedule&&this._editingDay?G`
            <hive-day-schedule-editor
              .day=${this._editingDay}
              .schedule=${this._schedule[this._editingDay]}
              .open=${!0}
              @schedule-changed=${this._handleScheduleChanged}
              @copy-requested=${this._handleCopyRequested}
              @editor-closed=${this._handleEditorClosed}
            ></hive-day-schedule-editor>
          `:""}

      ${this._showCopyDialog&&this._copySourceDay?G`
            <hive-copy-schedule-dialog
              .sourceDay=${this._copySourceDay}
              .open=${!0}
              @copy-confirmed=${this._handleCopyConfirmed}
              @dialog-closed=${this._handleDialogClosed}
            ></hive-copy-schedule-dialog>
          `:""}
    `}};ae.styles=Ut,t([mt({attribute:!1})],ae.prototype,"hass",void 0),t([ft()],ae.prototype,"config",void 0),t([ft()],ae.prototype,"_schedule",void 0),t([ft()],ae.prototype,"_originalSchedule",void 0),t([ft()],ae.prototype,"_viewMode",void 0),t([ft()],ae.prototype,"_editingDay",void 0),t([ft()],ae.prototype,"_showCopyDialog",void 0),t([ft()],ae.prototype,"_copySourceDay",void 0),t([ft()],ae.prototype,"_saving",void 0),t([ft()],ae.prototype,"_error",void 0),t([ft()],ae.prototype,"_hasUnsavedChanges",void 0),t([ft()],ae.prototype,"_loadError",void 0),t([ft()],ae.prototype,"_message",void 0),t([ft()],ae.prototype,"_conflicts",void 0),ae=t([ut("hive-scheduler-card")],ae);let de=class extends ct{constructor(){super(...arguments),this._entityPickerAvailable=!0,this._climateDomains=["climate"]}setConfig(t){this._config={...t,type:"custom:hive-scheduler-card"}}_configChanged(){const t=new CustomEvent("config-changed",{bubbles:!0,composed:!0,detail:{config:this._config}});this.dispatchEvent(t)}_entityChanged(t){t.stopPropagation();const e=t.target,i=t.detail?.value??e.value;"string"==typeof i&&i!==this._config.entity&&(this._config={...this._config,entity:i},delete this._config.mqtt_device,this._configChanged())}_nameChanged(t){const e=t.target.value;e!==this._config.name&&(this._config={...this._config,name:e||void 0},this._configChanged())}_viewModeChanged(t){const e=t.target.value;e!==this._config.view_mode&&(this._config={...this._config,view_mode:e},this._configChanged())}_scheduleEntityChanged(t,e){const i={...this._config.schedule_entities},r=e.target.value;r?i[t]=r:delete i[t],this._config={...this._config,schedule_entities:i},this._configChanged()}_entitySelectChanged(t){t.target,this._entityChanged(t)}_getClimateEntities(){return this.hass?Object.keys(this.hass.states).filter(t=>t.startsWith("climate.")).map(t=>{const e=this.hass.states[t].attributes.friendly_name;return{id:t,name:"string"==typeof e?e:t}}).sort((t,e)=>t.name.localeCompare(e.name)):[]}_renderEntityPicker(){if(this._entityPickerAvailable)return G`
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.entity}
          .includeDomains=${this._climateDomains}
          @value-changed=${this._entityChanged}
          allow-custom-entity
        ></ha-entity-picker>
      `;const t=this._getClimateEntities();return 0===t.length?G`
        <input
          type="text"
          class="editor-input"
          .value=${this._config.entity||""}
          @input=${this._entityChanged}
          placeholder="climate.your_hive"
        />
        <div class="editor-description">
          No climate entities found. Enter the entity ID manually.
        </div>
      `:G`
      <select
        class="editor-select"
        .value=${this._config.entity||""}
        @change=${this._entitySelectChanged}
      >
        <option value="">Select an entity...</option>
        ${t.map(t=>G`
            <option value=${t.id} ?selected=${t.id===this._config.entity}>
              ${t.name}
            </option>
          `)}
      </select>
    `}firstUpdated(){customElements.get("ha-entity-picker")||(this._entityPickerAvailable=!1)}render(){return this.hass&&this._config?G`
      <div class="editor-container">
        <!-- Entity Picker -->
        <div class="editor-row">
          <label class="editor-label">
            Entity
          </label>
          ${this._renderEntityPicker()}
          <div class="editor-description">
            Select the Hive SLR1c climate entity. The Zigbee2MQTT receiver is discovered automatically.
          </div>
        </div>

        <!-- Name Input -->
        <div class="editor-row">
          <label class="editor-label">
            Name (optional)
          </label>
          <input
            type="text"
            class="editor-input"
            .value=${this._config.name||""}
            @input=${this._nameChanged}
            placeholder="Living Room Heating"
          />
          <div class="editor-description">
            Override the card title. Leave empty to use the entity name.
          </div>
        </div>

        <!-- View Mode Selector -->
        <div class="editor-row">
          <label class="editor-label">
            Default View Mode
          </label>
          <select
            class="editor-select"
            .value=${this._config.view_mode||"week"}
            @change=${this._viewModeChanged}
          >
            <option value="week">Week View</option>
            <option value="graph">Graph View</option>
          </select>
          <div class="editor-description">
            Choose the default view when the card loads. Week view shows a calendar grid,
            graph view shows an interactive temperature chart.
          </div>
        </div>

        <details>
          <summary>Schedule entity overrides (optional)</summary>
          <div class="editor-description">Automatically discovered on the climate device. Set overrides for renamed or ambiguous entities.</div>
          ${yt.map(t=>G`<div class="editor-row">
            <label class="editor-label">${t}</label>
            <input class="editor-input" .value=${this._config.schedule_entities?.[t]||""}
              @input=${e=>this._scheduleEntityChanged(t,e)} placeholder=${`text.hive_schedule_${t}`} />
          </div>`)}
        </details>
      </div>
    `:G``}};de.styles=jt,t([mt({attribute:!1})],de.prototype,"hass",void 0),t([ft()],de.prototype,"_config",void 0),t([ft()],de.prototype,"_entityPickerAvailable",void 0),de=t([ut("hive-scheduler-card-editor")],de),window.customCards=window.customCards||[],window.customCards.push({type:"hive-scheduler-card",name:"Hive Scheduler Card",description:"Manage weekly heating schedules for Hive SLR1c thermostats",preview:!1,documentationURL:"https://github.com/sultanhq/ha_hive_scheduler_card"}),function(){if(customElements.get("hive-boost-card"))return;const t="zigbee2mqtt",e=t=>1===t?"1 minute":`${t} minutes`,i=t=>Number.isFinite(t)&&t>=5&&t<=32&&Math.round(2*t)===2*t,r=t=>Number.isInteger(t)&&t>=15&&t<=360,s=t=>{if("number"!=typeof t&&("string"!=typeof t||!t.trim()))return null;const e=Number(t);return Number.isFinite(e)?e:null},o=t=>!0===t||1===t||"true"===t||"1"===t;class n extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._config=null,this._hass=null,this._temp=21,this._roomTemp=null,this._lastClimateTemp=null,this._temperatureEdited=!1,this._duration=60,this._data=null,this._confirm=!1,this._status="",this._error="",this._working=!1,this._pending=null,this._unsub=null,this._subscribing=!1,this._subKey="",this._generation=0,this._timeout=null,this._refreshTimer=null}set hass(t){this._hass=t,this._syncClimateTemperature(),this._ensureSubscription(),this._render()}get hass(){return this._hass}setConfig(t){if(!(t=>"string"==typeof t&&/^climate\.[a-z0-9_]+$/.test(t))(t.entity))throw new Error("Select a valid climate entity.");if(t.mqtt_device&&!(t=>"string"==typeof t&&t.trim().length>0&&t.length<=256&&!/[+/#\x00-\x1f\x7f]/.test(t))(t.mqtt_device))throw new Error("Provide the exact Zigbee2MQTT friendly name (no /, +, # or control characters).");if(void 0!==t.default_temperature&&!i(Number(t.default_temperature)))throw new Error("Default temperature must be 5–32°C in 0.5°C steps.");if(void 0!==t.default_duration&&!r(Number(t.default_duration)))throw new Error("Default duration must be 15–360 minutes.");this._resetSubscription(),this._clearPending(),this._config={...t},this._temp=void 0===t.default_temperature?21:Number(t.default_temperature),this._duration=void 0===t.default_duration?60:Number(t.default_duration),this._data=null,this._roomTemp=null,this._lastClimateTemp=null,this._temperatureEdited=!1,this._syncClimateTemperature(),this._confirm=!1,this._status="",this._error="",this._ensureSubscription(),this._render()}_syncClimateTemperature(){const t=s(this._hass?.states?.[this._config?.entity]?.attributes?.current_temperature);t===this._lastClimateTemp&&null!==this._roomTemp||(this._lastClimateTemp=t,this._roomTemp=t??s(this._data?.local_temperature))}static getConfigElement(){return document.createElement("hive-boost-card-editor")}static getStubConfig(){return{entity:""}}getCardSize(){return 3}connectedCallback(){this._ensureSubscription(),this._render()}disconnectedCallback(){this._resetSubscription(),this._clearPending()}_resetSubscription(){this._generation++,this._unsub&&(this._unsub(),this._unsub=null),this._subKey="",this._mqttDevice="",this._subscribing=!1}async _ensureSubscription(){if(!this._hass?.user?.is_admin)return void this._resetSubscription();if(!this.isConnected||!this._config||!this._hass?.connection?.subscribeMessage)return;const e=JSON.stringify([this._config.entity,this._config.mqtt_device]);if(this._subKey===e||this._subscribing)return;this._resetSubscription();const i=this._generation;this._subscribing=!0;try{const r=await Pt(this._hass,this._config);if(i!==this._generation||!this.isConnected)return;this._mqttDevice=r;const s=`${t}/${r}`,o=await this._hass.connection.subscribeMessage(t=>{i===this._generation&&t.topic===s&&this._receive(t)},{type:"mqtt/subscribe",topic:s});if(i!==this._generation||!this.isConnected)return void o();this._subKey=e,this._unsub=o,await this._requestState()}catch(t){i===this._generation&&(this._error=`MQTT subscription failed: ${String(t?.message||t)}`)}finally{i===this._generation&&(this._subscribing=!1,this._render())}}async _requestState(){if(this._config&&this._mqttDevice&&this._hass?.user?.is_admin)try{await this._hass.callService("mqtt","publish",{topic:`${t}/${this._mqttDevice}/get`,payload:JSON.stringify({occupied_heating_setpoint:"",temperature_setpoint_hold:"",temperature_setpoint_hold_duration:"",system_mode:""}),retain:!1})}catch(t){this._error=`Could not refresh receiver: ${String(t?.message||t)}`,this._render()}}_receive(t){let e;try{e=JSON.parse(t.payload)}catch{return}if(!e||"object"!=typeof e||Array.isArray(e))return;const i=["occupied_heating_setpoint","temperature_setpoint_hold","temperature_setpoint_hold_duration","system_mode","local_temperature"];i.some(t=>Object.prototype.hasOwnProperty.call(e,t))&&(!Object.prototype.hasOwnProperty.call(e,"local_temperature")||t.retain&&null!==this._roomTemp||(this._roomTemp=s(e.local_temperature)??s(this._hass?.states?.[this._config?.entity]?.attributes?.current_temperature)),this._data={...this._data||{},...Object.fromEntries(i.filter(t=>Object.prototype.hasOwnProperty.call(e,t)).map(t=>[t,e[t]]))},this._pending&&!t.retain&&(Object.assign(this._pending.feedback,Object.fromEntries(i.filter(t=>Object.prototype.hasOwnProperty.call(e,t)).map(t=>[t,e[t]]))),this._matchesPending(this._pending,this._pending.feedback)&&(this._status="start"===this._pending.kind?"Boost confirmed by receiver.":"Boost cancelled; normal scheduling resumed.",this._error="",this._clearPending())),this._render())}_matchesPending(t,e){const i=["temperature_setpoint_hold","temperature_setpoint_hold_duration","system_mode"];if("start"===t.kind&&i.push("occupied_heating_setpoint"),!i.every(t=>Object.prototype.hasOwnProperty.call(e,t)))return!1;const r=Number(e.temperature_setpoint_hold_duration);return"stop"===t.kind?(t=>!1===t||0===t||"false"===t||"0"===t)(e.temperature_setpoint_hold)&&null!==e.temperature_setpoint_hold_duration&&0===r&&"auto"===e.system_mode:o(e.temperature_setpoint_hold)&&"heat"===e.system_mode&&Number.isFinite(r)&&r>0&&r<=t.duration&&Math.abs(Number(e.occupied_heating_setpoint)-t.temp)<.05}_clearPending(){clearTimeout(this._timeout),clearTimeout(this._refreshTimer),this._timeout=null,this._refreshTimer=null,this._pending=null,this._working=!1}async _send(e){if(this._working||!this._config||!this._hass?.user?.is_admin||!this._subKey)return;if(!("start"!==e||i(this._temp)&&r(this._duration)))return this._error="Choose a temperature from 5 to 32°C in 0.5°C steps and a duration from 15 to 360 minutes.",void this._render();const s={kind:e,temp:this._temp,duration:this._duration,feedback:{}},o="start"===e?{system_mode:"heat",occupied_heating_setpoint:this._temp,temperature_setpoint_hold_duration:this._duration,temperature_setpoint_hold:!0}:{system_mode:"auto",temperature_setpoint_hold_duration:0,temperature_setpoint_hold:!1};this._pending=s,this._working=!0,this._confirm=!1,this._error="",this._status="start"===e?"Sending boost to Hive…":"Cancelling boost…",this._render();try{if(await this._hass.callService("mqtt","publish",{topic:`${t}/${this._mqttDevice}/set`,payload:JSON.stringify(o),retain:!1}),this._pending!==s)return;this._status="Command sent. Waiting for receiver confirmation…",this._refreshTimer=setTimeout(()=>{this._pending===s&&this._requestState()},3e3),this._timeout=setTimeout(()=>{this._pending===s&&(this._clearPending(),this._error="Hive did not confirm the command. Check its status before retrying.",this._status="",this._render())},2e4),this._render()}catch(t){this._pending===s&&(this._clearPending(),this._error=`Could not send command: ${String(t?.message||t)}`,this._status="",this._render())}}_getContentRoot(){return this.shadowRoot}_render(){const t=this._getContentRoot();if(!t)return;!this._config||this._temperatureEdited||this._confirm||this._working||(this._temp=null===this._roomTemp?void 0===this._config.default_temperature?21:Number(this._config.default_temperature):Math.min(32,Math.max(5,Math.ceil(2*(this._roomTemp+1))/2)));const i=this._hass?.states?.[this._config?.entity],s=!(!this._config||!i||["unknown","unavailable"].includes(i.state)||!this._hass?.user?.is_admin||this._subKey!==JSON.stringify([this._config.entity,this._config.mqtt_device])||this._working),n=this._data&&Object.prototype.hasOwnProperty.call(this._data,"temperature_setpoint_hold")?o(this._data.temperature_setpoint_hold):null,a=Number(this._data?.temperature_setpoint_hold_duration),d=n&&Number.isInteger(a)&&a>0&&a<=360,l=this._roomTemp,c=this._config?.name||i?.attributes?.friendly_name||"Hive Boost";t.innerHTML='\n        <style>\n    :host { display:block; color:var(--primary-text-color, #222); font:inherit; }\n    ha-card { display:block; padding:20px; border-radius:var(--ha-card-border-radius, 12px); }\n    .heading { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; }\n    h2 { font-size:20px; font-weight:500; margin:0; }\n    .state { font-size:12px; border-radius:12px; background:var(--secondary-background-color,#eee); padding:5px 9px; }\n    .active { background:var(--warning-color,#e8a317); color:#111; }\n    .current { color:var(--secondary-text-color,#777); font-size:14px; margin:0 0 16px; }\n    label { display:block; margin:16px 0 8px; font-weight:500; }\n    .value { font-size:32px; text-align:center; font-variant-numeric:tabular-nums; padding:8px 0; }\n    input[type=range] { width:100%; accent-color:var(--primary-color,#4934d4); }\n    input[type=number] { box-sizing:border-box; width:100%; padding:10px 12px; border:1px solid var(--divider-color,#bbb); border-radius:8px; font:inherit; background:var(--card-background-color,#fff); color:inherit; }\n    .presets { display:flex; flex-wrap:wrap; gap:8px; }\n    button { border:1px solid var(--primary-color,#4934d4); border-radius:8px; background:transparent; color:var(--primary-color,#4934d4); font:inherit; padding:9px 12px; cursor:pointer; }\n    button.selected, button.primary { color:var(--text-primary-color,#fff); background:var(--primary-color,#4934d4); }\n    button.danger { color:var(--error-color,#c62828); border-color:var(--error-color,#c62828); }\n    button:disabled { opacity:.45; cursor:not-allowed; }\n    button:focus-visible, input:focus-visible { outline:2px solid var(--primary-color,#4934d4); outline-offset:2px; }\n    .actions { display:flex; gap:10px; margin-top:20px; }\n    .actions button { flex:1; }\n    .notice { padding:10px 12px; margin:12px 0; border-radius:8px; background:var(--secondary-background-color,#eee); font-size:14px; }\n    .error { color:var(--error-color,#c62828); }\n    .summary { padding:20px 0; text-align:center; font-size:19px; }\n    .small { color:var(--secondary-text-color,#777); font-size:13px; margin-top:10px; }\n  </style>\n        <ha-card>\n          <div class="heading"><h2 id="title"></h2><span class="state" id="badge"></span></div>\n          <p class="current" id="current"></p>\n          <div id="body"></div>\n          <div class="notice" id="notice" role="status" aria-live="polite" hidden></div>\n          <div class="notice error" id="error" role="alert" hidden></div>\n        </ha-card>',t.querySelector("#title").textContent=c;const h=t.querySelector("#badge");h.textContent=null===n?"State unknown":n?"Boost active":"Schedule running",h.classList.toggle("active",!!n),t.querySelector("#current").textContent=Number.isFinite(l)?`Room temperature: ${l.toFixed(1)}°C`:"Room temperature unavailable";const u=t.querySelector("#body");if(this._config)if(this._confirm)u.innerHTML=`<div class="summary" id="summary"></div><div class="actions">\n          <button id="back">Back</button><button class="primary" id="confirm" ${s?"":"disabled"}>Confirm Boost</button></div>`,u.querySelector("#summary").textContent=`Boost to ${this._temp.toFixed(1)}°C for ${e(this._duration)}?`,u.querySelector("#back").addEventListener("click",()=>{this._confirm=!1,this._render()}),u.querySelector("#confirm").addEventListener("click",()=>{this._send("start")});else{u.innerHTML=`\n          <label for="temperature">Boost temperature</label>\n          <div class="value" id="temperature-value"></div>\n          <input id="temperature" type="range" min="5" max="32" step="0.5" aria-label="Boost temperature">\n          <div class="small" id="temperature-hint"></div>\n          <label for="duration">Boost duration</label>\n          <div class="presets" id="presets"></div>\n          <div class="small">Or enter minutes (15–360)</div>\n          <input id="duration" type="number" min="15" max="360" step="1" aria-label="Boost duration in minutes">\n          <div id="receiver" class="notice" hidden></div>\n          <div class="actions">\n            <button class="primary" id="boost" ${s?"":"disabled"}>Boost</button>\n            <button class="danger" id="stop" ${s&&n?"":"disabled"}>Cancel Boost</button>\n          </div>`,u.querySelector("#temperature-value").textContent=`${this._temp.toFixed(1)}°C`;const t=u.querySelector("#temperature");t.value=String(this._temp);const i=u.querySelector("#temperature-hint");i.hidden=this._temperatureEdited,i.textContent=null===this._roomTemp?"Room temperature unavailable; using the fallback temperature.":"Suggested: room temperature +1°C, rounded up to 0.5°C (maximum 32°C).",t.addEventListener("input",t=>{this._temp=Number(t.target.value),this._temperatureEdited=!0,i.hidden=!0,u.querySelector("#temperature-value").textContent=`${this._temp.toFixed(1)}°C`});const o=u.querySelector("#duration");o.value=String(this._duration),o.addEventListener("change",t=>{const e=Number(t.target.value);r(e)?(this._duration=e,this._error=""):this._error="Duration must be an integer between 15 and 360 minutes.",this._render()});for(const t of[15,30,60,90,120,180,360]){const e=document.createElement("button");e.textContent=`${t}m`,e.classList.toggle("selected",this._duration===t),e.addEventListener("click",()=>{this._duration=t,this._render()}),u.querySelector("#presets").appendChild(e)}if(n){const t=u.querySelector("#receiver");t.hidden=!1,t.textContent=d?`Receiver hold: ${this._data.occupied_heating_setpoint??"?"}°C, reported duration ${e(a)}.`:"Receiver has a hold active without a confirmed finite duration."}u.querySelector("#boost").addEventListener("click",()=>{this._confirm=!0,this._error="",this._render()}),u.querySelector("#stop").addEventListener("click",()=>{this._send("stop")})}else u.textContent="Configure a climate entity and the Zigbee2MQTT receiver friendly name.";if(this._status){const e=t.querySelector("#notice");e.hidden=!1,e.textContent=this._status}if(this._error){const e=t.querySelector("#error");e.hidden=!1,e.textContent=this._error}if(this._config&&!this._hass?.user?.is_admin&&!this._error){const e=t.querySelector("#notice");e.hidden=!1,e.textContent="Sign in as a Home Assistant administrator to control Hive via MQTT."}}}class a extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._config={type:this._configType,entity:""},this._hass=null}set hass(t){this._hass=t,this._render(!1)}get hass(){return this._hass}get _configType(){return"custom:hive-boost-card"}setConfig(t){const e={...t,type:this._configType};JSON.stringify(e)!==JSON.stringify(this._config)&&(this._config=e,this._render())}_changed(t,e){this._config[t]!==e&&(this._config={...this._config,[t]:e},"entity"===t&&delete this._config.mqtt_device,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0})))}connectedCallback(){this._render()}_render(t=!0){if(!this.shadowRoot)return;const e=this.shadowRoot;if(!e.querySelector("#entity")){e.innerHTML='<style>\n        :host {display:block}\n        label {display:block; margin:14px 0 5px}\n        select,input {box-sizing:border-box;width:100%;padding:10px;font:inherit;border:1px solid var(--divider-color,#aaa);border-radius:7px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#222)}\n        small {color:var(--secondary-text-color,#777)}\n      </style>\n      <label for="entity">Climate entity</label><select id="entity"></select>\n      <small>The Zigbee2MQTT receiver is discovered from the climate entity.</small>\n      <label for="name">Name (optional)</label><input id="name" placeholder="Hive Boost">\n      <label for="temp">Fallback temperature when room temperature is unavailable (5–32°C)</label><input id="temp" type="number" step=".5" min="5" max="32">\n      <label for="duration">Default duration in minutes (15–360)</label><input id="duration" type="number" min="15" max="360">',e.querySelector("#entity").addEventListener("change",t=>this._changed("entity",t.target.value)),e.querySelector("#entity").addEventListener("blur",()=>this._render(!1));for(const[t,i]of[["name","name"],["temp","default_temperature"],["duration","default_duration"]])e.querySelector("#"+t).addEventListener("change",e=>this._changed(i,"temp"===t||"duration"===t?Number(e.target.value):e.target.value))}const i=Object.keys(this._hass?.states||{}).filter(t=>t.startsWith("climate.")).sort(),r=e.querySelector("#entity"),s=[...new Set([this._config.entity,...i].filter(Boolean))].map(t=>[t,this._hass?.states?.[t]?.attributes?.friendly_name||t]),o=JSON.stringify(s);if(o!==this._optionsSignature&&e.activeElement!==r&&(r.replaceChildren(new Option("Select climate entity",""),...s.map(([t,e])=>new Option(e,t))),this._optionsSignature=o,r.value=this._config.entity||""),t){r.value!==(this._config.entity||"")&&(r.value=this._config.entity||"");for(const[t,i,r]of[["name","name",""],["temp","default_temperature",21],["duration","default_duration",60]]){const s=e.querySelector("#"+t),o=String(this._config[i]??r);s.value!==o&&(s.value=o)}}}}customElements.define("hive-boost-card",n),customElements.define("hive-boost-card-editor",a),customElements.define("hive-boost-badge",class extends n{static getConfigElement(){return document.createElement("hive-boost-badge-editor")}setConfig(t){this._closeControls(!1),super.setConfig(t)}disconnectedCallback(){this._closeControls(!1),super.disconnectedCallback()}_getContentRoot(){return this.shadowRoot?.querySelector("#boost-controls")}_ensureBadge(){if(this.shadowRoot.querySelector("#boost-pill"))return;this.shadowRoot.innerHTML='<style>\n        :host {display:inline-flex !important;max-width:100%;vertical-align:middle;}\n        .boost-pill {display:inline-flex;align-items:center;gap:8px;max-width:100%;min-height:40px;padding:5px 12px;border:1px solid var(--divider-color,#ddd);border-radius:24px;background:var(--ha-card-background,var(--card-background-color,#fff));color:var(--primary-text-color,#222);font:inherit;cursor:pointer;box-shadow:var(--ha-card-box-shadow,0 1px 2px #0001);}\n        .boost-pill:focus-visible,.dialog-close:focus-visible {outline:2px solid var(--primary-color,#087f8c);outline-offset:2px;}\n        .boost-pill:disabled {opacity:.6;cursor:default;}\n        .boost-pill svg {width:22px;height:22px;flex-shrink:0;color:var(--primary-color,#087f8c);fill:currentColor;}\n        .boost-pill.active svg {color:var(--state-climate-heat-color,var(--warning-color,#ef5350));}\n        .badge-text {display:grid;text-align:left;min-width:0;}\n        .badge-label {font-size:10px;line-height:13px;color:var(--secondary-text-color,#777);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\n        .badge-value {font-size:14px;line-height:18px;font-weight:500;white-space:nowrap;}\n        .boost-dialog {box-sizing:border-box;width:min(480px,calc(100vw - 24px));max-width:calc(100vw - 24px);max-height:calc(100dvh - 32px);padding:0;border:1px solid var(--divider-color,#ddd);border-radius:var(--ha-card-border-radius,12px);background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);font:inherit;box-shadow:0 8px 32px #0004;}\n        .boost-dialog::backdrop {background:#0006;}\n        .dialog-heading {position:sticky;top:0;z-index:1;background:var(--card-background-color,#fff);display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--divider-color,#ddd);font-weight:500;}\n        .dialog-close {border:0;border-radius:50%;background:transparent;color:inherit;font:inherit;font-size:26px;padding:0;width:40px;height:40px;cursor:pointer;}\n      </style>\n      <button id="boost-pill" class="boost-pill" type="button" aria-haspopup="dialog" aria-expanded="false">\n        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 5-5 6-5 11a5 5 0 0 0 10 0c0-3-2-5-3-6 0 3-2 3-2 5-3-3 1-6 0-10Z"/></svg>\n        <span class="badge-text"><span id="boost-label" class="badge-label"></span><span id="boost-value" class="badge-value" aria-live="polite"></span></span>\n      </button>\n      <dialog id="boost-dialog" class="boost-dialog" aria-labelledby="boost-dialog-title">\n        <div class="dialog-heading"><span id="boost-dialog-title">Boost controls</span><button id="boost-close" class="dialog-close" type="button" aria-label="Close boost controls">×</button></div>\n        <div id="boost-controls"></div>\n      </dialog>',this.shadowRoot.querySelector("#boost-pill").addEventListener("click",()=>this._openControls()),this.shadowRoot.querySelector("#boost-close").addEventListener("click",()=>this._closeControls());const t=this.shadowRoot.querySelector("#boost-dialog");t.addEventListener("cancel",t=>{t.preventDefault(),this._closeControls()}),t.addEventListener("click",e=>{e.target===t&&this._closeControls()})}_openControls(){const t=this.shadowRoot.querySelector("#boost-dialog");t&&!t.open&&("function"==typeof t.showModal?t.showModal():t.setAttribute("open",""),this.shadowRoot.querySelector("#boost-pill").setAttribute("aria-expanded","true"),this._getContentRoot().querySelector("#temperature, #confirm")?.focus())}_closeControls(t=!0){const e=this.shadowRoot.querySelector("#boost-dialog");if(!e?.open)return;"function"==typeof e.close?e.close():e.removeAttribute("open");const i=this.shadowRoot.querySelector("#boost-pill");i.setAttribute("aria-expanded","false"),t&&this.isConnected&&i.focus()}_render(){if(!this.shadowRoot)return;this._ensureBadge();const t=this.shadowRoot.activeElement,e=t?.closest("#boost-controls")?t.id:null;super._render();const i=this.shadowRoot,r=i.querySelector("#boost-pill"),s=this._hass?.states?.[this._config?.entity],n=o(this._data?.temperature_setpoint_hold),a=Number(this._data?.temperature_setpoint_hold_duration),d=this._config?.name||"Hive Boost";let l=Number.isFinite(this._roomTemp)?`${this._roomTemp.toFixed(1)}°C`:"State unknown";!s||["unknown","unavailable"].includes(s.state)?l="Unavailable":this._working?l="Verifying…":this._error?l="Check Boost":n&&(l="Boost active"+(Number.isInteger(a)&&a>0&&a<=360?` · ${a}m`:"")),i.querySelector("#boost-label").textContent=d,i.querySelector("#boost-value").textContent=l,r.classList.toggle("active",n),r.disabled=!this._config||!this._hass,r.setAttribute("aria-label",`${d}: ${l}. Open Boost controls.`),r.title=this._error||`${d}: ${l}`,e&&i.querySelector("#boost-dialog").open&&(this._getContentRoot().querySelector(`[id="${e}"]`)||this._getContentRoot().querySelector("#confirm")||i.querySelector("#boost-close"))?.focus({preventScroll:!0})}}),customElements.define("hive-boost-badge-editor",class extends a{get _configType(){return"custom:hive-boost-badge"}}),window.customBadges=window.customBadges||[],window.customBadges.some(t=>"hive-boost-badge"===t.type)||window.customBadges.push({type:"hive-boost-badge",name:"Hive Boost Badge",description:"Hive Boost status with timed boost controls on tap",preview:!0,documentationURL:"https://github.com/sultanhq/ha_hive_scheduler_card#hive-boost-badge"}),window.customCards=window.customCards||[],window.customCards.some(t=>"hive-boost-card"===t.type)||window.customCards.push({type:"hive-boost-card",name:"Hive Boost Card",description:"Timed heating boost for Hive SLR1c receivers using Zigbee2MQTT",preview:!1,documentationURL:"https://github.com/sultanhq/ha_hive_scheduler_card"})}();export{ae as HiveSchedulerCard,de as HiveSchedulerCardEditor};
