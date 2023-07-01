window.pkmn=window.pkmn||{};window.pkmn.data=(()=>{var k=Object.defineProperty;var L=Object.getOwnPropertyDescriptor;var R=Object.getOwnPropertyNames;var V=Object.prototype.hasOwnProperty;var U=(i,e)=>{for(var t in e)k(i,t,{get:e[t],enumerable:!0})},j=(i,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of R(e))!V.call(i,n)&&n!==t&&k(i,n,{get:()=>e[n],enumerable:!(s=L(e,n))||s.enumerable});return i};var q=i=>j(k({},"__esModule",{value:!0}),i);var J={};U(J,{Abilities:()=>S,Conditions:()=>N,Generation:()=>x,Generations:()=>p,Items:()=>b,Learnsets:()=>F,Moves:()=>D,Natures:()=>E,Specie:()=>m,Species:()=>T,Stats:()=>I,Type:()=>g,Types:()=>v,toID:()=>u});var H=i=>!i.exists||"isNonstandard"in i&&i.isNonstandard||i.kind==="Ability"&&i.id==="noability"?!1:!("tier"in i&&["Illegal","Unreleased"].includes(i.tier)),c=(i,e=0)=>e?(i>>>0)%2**e:i>>>0;function w(i,e,t){for(let s in e)Object.prototype.hasOwnProperty.call(e,s)&&!t.has(s)&&(i[s]=e[s]);return i}function u(i){return i!=null&&i.id&&(i=i.id),typeof i!="string"&&typeof i!="number"?"":(""+i).toLowerCase().replace(/[^a-z0-9]+/g,"")}var A=class{constructor(e,t=A.DEFAULT_EXISTS){this.cache=Object.create(null);this.dex=e,this.exists=t}get(e){let t=typeof e=="string"?parseInt(e.slice(e.search(/\d/))):e;if(isNaN(+t))throw new Error(`Invalid gen ${e}`);return this.cache[t]?this.cache[t]:this.cache[t]=new x(this.dex.forGen(t),s=>this.exists(s,t))}*[Symbol.iterator](){for(let e=1;e<=9;e++)yield this.get(e)}},p=A;p.DEFAULT_EXISTS=H;var x=class{static get(e,t,s=H){return new p(e,s).get(t)}constructor(e,t){this.dex=e,this.exists=t,this.abilities=new S(this.dex,this.exists),this.items=new b(this.dex,this.exists),this.moves=new D(this.dex,this.exists),this.species=new T(this.dex,this.exists),this.natures=new E(this.dex,this.exists),this.types=new v(this.dex,this.exists),this.learnsets=new F(this,this.dex,this.exists),this.conditions=new N(this.dex,this.exists),this.stats=new I(this.dex)}get num(){return this.dex.gen}toString(){return`[Generation:${this.num}]`}toJSON(){return this.toString()}},S=class{constructor(e,t){this.dex=e,this.exists=t}get(e){let t=this.dex.abilities.get(e);return this.exists(t)?t:void 0}*[Symbol.iterator](){for(let e in this.dex.data.Abilities){let t=this.get(e);t&&(yield t)}}},b=class{constructor(e,t){this.dex=e,this.exists=t}get(e){let t=this.dex.items.get(e);return this.exists(t)?t:void 0}*[Symbol.iterator](){for(let e in this.dex.data.Items){let t=this.get(e);t&&(yield t)}}},D=class{constructor(e,t){this.dex=e,this.exists=t}get(e){let t=this.dex.moves.get(e);return this.exists(t)?t:void 0}*[Symbol.iterator](){for(let e in this.dex.data.Moves){let t=this.get(e);t&&(yield t)}}},T=class{constructor(e,t){this.cache=Object.create(null);this.dex=e,this.exists=t}get(e){let t=this.dex.species.get(e);if(!this.exists(t))return;let s=t.speciesid||t.id,n=this.cache[s];return n||(this.cache[s]=new m(this.dex,this.exists,t))}*[Symbol.iterator](){for(let e in this.dex.data.Species){let t=this.get(e);t&&(yield t)}}},P=class{constructor(e,t,s){var n,r,o,a,d,y,h,f;w(this,s,P.EXCLUDE),this.dex=e,this.dex.gen>=2?(this.gender=s.gender,this.genderRatio=s.genderRatio):this.genderRatio={M:0,F:0},this.dex.gen>=3?(this.abilities={0:s.abilities[0]},s.abilities[1]&&this.dex.abilities.get(s.abilities[1]).gen<=this.dex.gen&&(this.abilities[1]=s.abilities[1]),this.dex.gen>=5&&s.abilities.H&&(this.abilities.H=s.abilities.H),this.dex.gen>=7&&s.abilities.S&&(this.abilities.S=s.abilities.S)):this.abilities={0:""},this.evos=(n=s.evos)==null?void 0:n.filter(l=>t(this.dex.species.get(l))),this.nfe=!!((r=this.evos)!=null&&r.length),this.nfe||(this.evos=void 0),this.cosmeticFormes=(o=s.cosmeticFormes)==null?void 0:o.filter(l=>t(this.dex.species.get(l))),(a=this.cosmeticFormes)!=null&&a.length||(this.cosmeticFormes=void 0),this.otherFormes=(d=s.otherFormes)==null?void 0:d.filter(l=>t(this.dex.species.get(l))),(y=this.otherFormes)!=null&&y.length||(this.otherFormes=void 0),this.formeOrder=(h=s.formeOrder)==null?void 0:h.filter(l=>t(this.dex.species.get(l))),(!this.formeOrder||this.formeOrder.length<=1)&&(this.formeOrder=void 0),this.formes=(f=this.formeOrder)==null?void 0:f.filter(l=>this.dex.species.get(l).isNonstandard!=="Gigantamax"),this.prevo=s.prevo&&t(this.dex.species.get(s.prevo))?s.prevo:void 0}get formeNum(){return this.baseSpecies===this.name?this.formeOrder?this.formeOrder.findIndex(e=>e===this.name):0:this.dex.species.get(this.baseSpecies).formeOrder.findIndex(e=>e===(this.isNonstandard==="Gigantamax"?this.baseSpecies:this.name))}toString(){return this.name}toJSON(){return w({},this,new Set(["dex"]))}},m=P;m.EXCLUDE=new Set(["abilities","cosmeticFormes","evos","formeOrder","gender","genderRatio","nfe","otherFormes","prevo"]);var N=class{constructor(e,t){this.dex=e,this.exists=t}get(e){let t=this.dex.conditions.get(e);return this.exists(t)?t:void 0}},E=class{constructor(e,t){this.dex=e,this.exists=t}get(e){if(this.dex.gen<3)return;let t=this.dex.natures.get(e);return this.exists(t)?t:void 0}*[Symbol.iterator](){for(let e in this.dex.data.Natures){let t=this.get(e);t&&(yield t)}}},X={"-3":.125,"-2":.25,"-1":.5,0:1,1:2,2:4,3:8},v=class{constructor(e,t){this.cache=Object.create(null);this.dex=e,this.exists=t,this.unknown=new g({effectType:"Type",kind:"Type",id:"",name:"???",exists:e.gen<=4,gen:1,damageTaken:{},HPivs:{},HPdvs:{}},e,this)}get(e){if(e==="???")return this.unknown;let t=this.dex.types.get(e);if(!this.exists(t))return;let s=this.cache[t.id];return s||(this.cache[t.id]=new g(t,this.dex,this))}*[Symbol.iterator](){for(let e in this.dex.data.Types){let t=this.get(e);t&&(yield t)}this.dex.gen>=2&&this.dex.gen<=4&&(yield this.unknown)}getHiddenPower(e){return this.dex.getHiddenPower(e)}canDamage(e,t){return this.dex.getImmunity(e,t)}totalEffectiveness(e,t){if(!this.canDamage(e,t))return 0;let s=`${this.dex.getEffectiveness(e,t)}`;return X[s]}},$=[1,2,.5,0],W=["Fire","Water","Grass","Electric","Ice","Psychic","Dark","Dragon"],g=class{constructor(e,t,s){Object.assign(this,e),this.types=s,this.category=this.name==="Fairy"?void 0:W.includes(this.name)?"Special":"Physical",this.effectiveness={"???":1};for(let n in t.data.Types){let r=n.charAt(0).toUpperCase()+n.slice(1);this.effectiveness[r]=$[t.data.Types[n].damageTaken[this.name]||0]}}canDamage(e){return this.types.canDamage(this.name,e)}totalEffectiveness(e){return this.types.totalEffectiveness(this.name,e)}toString(){return this.name}toJSON(){return w({},this,new Set(["types"]))}},G=new Set(["cut","fly","surf","strength","flash","rocksmash","waterfall","dive"]),M=new Set(["cut","fly","surf","strength","rocksmash","waterfall","rockclimb"]),F=class{constructor(e,t,s){this.cache=Object.create(null);this.gen=e,this.dex=t,this.exists=s}async get(e){let t=await this.dex.learnsets.get(u(e));return this.exists(t)?t:void 0}async*[Symbol.iterator](){this.dex.data.Learnsets||await this.dex.learnsets.get("LOAD");for(let e in this.dex.data.Learnsets){let t=await this.get(e);t&&(yield t)}}async*all(e){let t=e.id,s=await this.get(t);for(s||(t=typeof e.battleOnly=="string"&&e.battleOnly!==e.baseSpecies?u(e.battleOnly):u(e.baseSpecies),s=await this.get(t));s&&(yield s,t==="lycanrocdusk"||e.id==="rockruff"&&t==="rockruff"?t="rockruffdusk":e.id==="gastrodoneast"?t="gastrodon":e.id==="pumpkaboosuper"?t="pumpkaboo":t=u(e.battleOnly||e.changesFrom||e.prevo),!!t);){let n=this.gen.species.get(t);if(!n)break;e=n,s=await this.get(t)}}async learnable(e,t){let s=this.gen.species.get(e);if(!s)return;if(!t){let r=this.cache[s.id];if(r)return r}let n={};for await(let r of this.all(s))if(r.learnset)for(let o in r.learnset){let a=this.gen.moves.get(o);if(a){let d=r.learnset[o];if(this.isLegal(a,d,t||this.gen)){let y=d.filter(h=>+h.charAt(0)<=this.gen.num);if(!y.length)continue;if(n[a.id]){let h=[];e:for(let f of y){let l=f.slice(0,2);for(let C of n[a.id])if(C.startsWith(l))continue e;h.push(f)}n[a.id].push(...h)}else n[a.id]=y}}}return t||(this.cache[s.id]=n),n}async canLearn(e,t,s){var r;let n=this.gen.species.get(e);if(!n||(t=typeof t=="string"&&this.gen.moves.get(t)||t,typeof t=="string"))return!1;for await(let o of this.all(n))if(this.isLegal(t,(r=o.learnset)==null?void 0:r[t.id],s||this.gen))return!0;return!1}isLegal(e,t,s){if(!t)return;let n=t.map(a=>Number(a[0])),r=Math.min(...n),o=r===7&&t.every(a=>a[0]!=="7"||a==="7V")||r===8&&t.every(a=>a[0]!=="8"||a==="8V");if(s==="Pentagon")return n.includes(6);if(s==="Plus")return n.includes(7)&&!o;if(s==="Galar")return n.includes(8)&&!o;if(s==="Paldea")return n.includes(9);if(this.gen.num>=3&&r<=4&&(G.has(e.id)||M.has(e.id))){let a="",d=!1;r===3&&(a+="3",d=!0),d&&(d=!G.has(e.id)),(d||n.includes(4))&&(a+="4",d=!0),d&&(d=!M.has(e.id));let y=d?5:Math.min(...n.filter(h=>h>4));return a+="0123456789".slice(y),a.includes(`${s.num}`)}else return"0123456789".slice(r).includes(`${s.num}`)}},O=["hp","atk","def","spe","spa","spd"],B={HP:"hp",hp:"hp",Attack:"atk",Atk:"atk",atk:"atk",Defense:"def",Def:"def",def:"def","Special Attack":"spa",SpA:"spa",SAtk:"spa",SpAtk:"spa",spa:"spa",Special:"spa",spc:"spa",Spc:"spa","Special Defense":"spd",SpD:"spd",SDef:"spd",SpDef:"spd",spd:"spd",Speed:"spe",Spe:"spe",Spd:"spe",spe:"spe"},_={hp:["HP","HP"],atk:["Atk","Attack"],def:["Def","Defense"],spa:["SpA","Special Attack"],spd:["SpD","Special Defense"],spe:["Spe","Speed"],spc:["Spc","Special"]},I=class{constructor(e){this.dex=e}calc(e,t,s=31,n,r=100,o){if(n===void 0&&(n=this.dex.gen<3?252:0),this.dex.gen<3&&(s=this.toDV(s)*2,o=void 0),e==="hp")return t===1?t:c(c(2*t+s+c(n/4)+100)*r/100+10);{let a=c(c(2*t+s+c(n/4))*r/100+5);if(o!==void 0){if(o.plus===e)return c(c(a*110,16)/100);if(o.minus===e)return c(c(a*90,16)/100)}return a}}get(e){return B[e]}display(e,t=!1){let s=B[e];return s===void 0?e:(this.dex.gen===1&&s==="spa"&&(s="spc"),_[s][+t])}fill(e,t){for(let s of O)s in e||(e[s]=t);return e}getHPDV(e){return this.toDV(e.atk===void 0?31:e.atk)%2*8+this.toDV(e.def===void 0?31:e.def)%2*4+this.toDV(e.spe===void 0?31:e.spe)%2*2+this.toDV(e.spa===void 0?31:e.spa)%2}*[Symbol.iterator](){for(let e of O)yield e}toDV(e){return Math.floor(e/2)}toIV(e){return e*2+1}};return q(J);})();