import{A as p,B as m,C as n,D as o,Da as A,E as h,F as M,Fa as H,G as V,Ga as Q,Gb as Z,Ha as B,Ia as R,Ja as L,K as q,L as D,M as w,Ma as P,Na as $,O as i,Oa as k,P as x,Pa as J,Qa as K,Ua as U,Va as W,Wa as X,Xa as Y,Z as z,_ as O,a as b,bb as I,dc as ee,ec as te,gc as re,n as _,p as N,pa as C,q as G,v as l,w as E,ya as j}from"./chunk-J3ZMDLLJ.js";var ie=["firstFocused"];function le(r,t){if(r&1&&(M(0),n(1,"option",16),i(2),o(),V()),r&2){let T=t.$implicit;l(),m("value",T.id),l(),x(T.label)}}function me(r,t){r&1&&(n(0,"my-error"),i(1," Veuillez remplir ce champ. "),o())}function ue(r,t){r&1&&(n(0,"my-error"),i(1," Veuillez remplir ce champ. "),o())}function ae(r,t){r&1&&(n(0,"my-error"),i(1," Veuillez remplir ce champ. "),o())}function pe(r,t){r&1&&(n(0,"my-error"),i(1," Veuillez remplir ce champ. "),o())}function de(r,t){r&1&&(n(0,"my-error"),i(1," Veuillez remplir ce champ. "),o())}function se(r,t){r&1&&(n(0,"my-error"),i(1," Veuillez remplir ce champ. "),o())}function fe(r,t){r&1&&(n(0,"my-error"),i(1," Veuillez remplir ce champ. "),o())}function ce(r,t){r&1&&(n(0,"my-error"),i(1," Veuillez remplir ce champ. "),o())}var S=(()=>{let t=class t{constructor(d,u,e){this.fb=d,this.turnoverHttp=u,this.categoriesHttp=e,this.categories=[],this.turnoverFormGroup=this.fb.group({categoryId:[void 0],fromDate:[I()],toDate:[I()]}),this.statsFormGroup=this.fb.group({amount:[0]})}ngOnInit(){this.categoriesHttp.getAll().subscribe({next:d=>this.categories=d}),this.handleFormChanged()}ngAfterViewInit(){setTimeout(()=>{this.firstFocused.nativeElement.focus()},300)}save(){}getFormData(){return b({},this.turnoverFormGroup.getRawValue())}handleFormChanged(){this.turnoverFormGroup.get("categoryId")?.valueChanges.subscribe({next:d=>{}})}};t.\u0275fac=function(u){return new(u||t)(E(K),E(ee),E(Z))},t.\u0275cmp=N({type:t,selectors:[["app-turnover"]],viewQuery:function(u,e){if(u&1&&q(ie,5),u&2){let a;D(a=w())&&(e.firstFocused=a.first)}},decls:52,vars:13,consts:[[1,"flex","flex-col","flex-1","p-6"],[1,"flex","flex-row","gap-x-6"],[1,"max-h-64"],[1,"w-fit","mt-8",3,"formGroup"],["formControlName","categoryId","myInput",""],["firstFocused",""],[4,"ngFor","ngForOf"],[4,"ngIf"],[1,"inline-fields","mt-3"],[1,"w-52"],[3,"required"],["formControlName","fromDate","type","date","myInput",""],["formControlName","toDate","type","date","myInput",""],["mat-flat-button","","color","primary",1,"mt-5"],[1,"flex","flex-col","gap-y-3","mt-8",3,"formGroup"],["formControlName","amount","type","number","myInput","","myCalculableField",""],[3,"value"]],template:function(u,e){if(u&1&&(n(0,"div",0)(1,"div"),i(2,"Statistiques / Chiffre d'affaires"),o(),n(3,"div",1)(4,"div",2)(5,"form",3)(6,"my-form-field")(7,"my-label"),i(8,"Cat\xE9gorie"),o(),n(9,"select",4,5),p(11,le,3,2,"ng-container",6),o(),p(12,me,2,0,"my-error",7),o(),n(13,"div",8)(14,"my-form-field",9)(15,"my-label",10),i(16,"De"),o(),h(17,"input",11),p(18,ue,2,0,"my-error",7),o(),n(19,"my-form-field",9)(20,"my-label",10),i(21,"\xC0"),o(),h(22,"input",12),p(23,ae,2,0,"my-error",7),o()()(),n(24,"button",13),i(25,"Appliquer"),o()(),n(26,"form",14)(27,"my-form-field")(28,"my-label"),i(29,"Montant"),o(),h(30,"input",15),p(31,pe,2,0,"my-error",7),o(),n(32,"my-form-field")(33,"my-label"),i(34,"Montant"),o(),h(35,"input",15),p(36,de,2,0,"my-error",7),o(),n(37,"my-form-field")(38,"my-label"),i(39,"Montant"),o(),h(40,"input",15),p(41,se,2,0,"my-error",7),o(),n(42,"my-form-field")(43,"my-label"),i(44,"Montant"),o(),h(45,"input",15),p(46,fe,2,0,"my-error",7),o(),n(47,"my-form-field")(48,"my-label"),i(49,"Montant"),o(),h(50,"input",15),p(51,ce,2,0,"my-error",7),o()()()()),u&2){let a,s,f,c,y,g,v,F;l(5),m("formGroup",e.turnoverFormGroup),l(6),m("ngForOf",e.categories),l(),m("ngIf",((a=e.turnoverFormGroup.get("categoryId"))==null?null:a.invalid)&&(((a=e.turnoverFormGroup.get("categoryId"))==null?null:a.dirty)||((a=e.turnoverFormGroup.get("categoryId"))==null?null:a.touched))&&((a=e.turnoverFormGroup.get("categoryId"))==null?null:a.getError("required"))),l(3),m("required",!0),l(3),m("ngIf",((s=e.turnoverFormGroup.get("date"))==null?null:s.invalid)&&(((s=e.turnoverFormGroup.get("date"))==null?null:s.dirty)||((s=e.turnoverFormGroup.get("date"))==null?null:s.touched))&&((s=e.turnoverFormGroup.get("date"))==null?null:s.getError("required"))),l(2),m("required",!0),l(3),m("ngIf",((f=e.turnoverFormGroup.get("date"))==null?null:f.invalid)&&(((f=e.turnoverFormGroup.get("date"))==null?null:f.dirty)||((f=e.turnoverFormGroup.get("date"))==null?null:f.touched))&&((f=e.turnoverFormGroup.get("date"))==null?null:f.getError("required"))),l(3),m("formGroup",e.statsFormGroup),l(5),m("ngIf",((c=e.statsFormGroup.get("amount"))==null?null:c.invalid)&&(((c=e.statsFormGroup.get("amount"))==null?null:c.dirty)||((c=e.statsFormGroup.get("amount"))==null?null:c.touched))&&((c=e.statsFormGroup.get("amount"))==null?null:c.getError("required"))),l(5),m("ngIf",((y=e.statsFormGroup.get("amount"))==null?null:y.invalid)&&(((y=e.statsFormGroup.get("amount"))==null?null:y.dirty)||((y=e.statsFormGroup.get("amount"))==null?null:y.touched))&&((y=e.statsFormGroup.get("amount"))==null?null:y.getError("required"))),l(5),m("ngIf",((g=e.statsFormGroup.get("amount"))==null?null:g.invalid)&&(((g=e.statsFormGroup.get("amount"))==null?null:g.dirty)||((g=e.statsFormGroup.get("amount"))==null?null:g.touched))&&((g=e.statsFormGroup.get("amount"))==null?null:g.getError("required"))),l(5),m("ngIf",((v=e.statsFormGroup.get("amount"))==null?null:v.invalid)&&(((v=e.statsFormGroup.get("amount"))==null?null:v.dirty)||((v=e.statsFormGroup.get("amount"))==null?null:v.touched))&&((v=e.statsFormGroup.get("amount"))==null?null:v.getError("required"))),l(5),m("ngIf",((F=e.statsFormGroup.get("amount"))==null?null:F.invalid)&&(((F=e.statsFormGroup.get("amount"))==null?null:F.dirty)||((F=e.statsFormGroup.get("amount"))==null?null:F.touched))&&((F=e.statsFormGroup.get("amount"))==null?null:F.getError("required")))}},dependencies:[z,O,B,k,J,A,R,$,H,Q,L,P,j,X,U,W,Y,te],styles:[`app-turnover{display:flex;flex:1}
`],encapsulation:2});let r=t;return r})();var ye=[{path:"",redirectTo:"turnover",pathMatch:"full"},{path:"turnover",component:S}],ne=(()=>{let t=class t{};t.\u0275fac=function(u){return new(u||t)},t.\u0275mod=G({type:t}),t.\u0275inj=_({imports:[C.forChild(ye),C]});let r=t;return r})();var Oe=(()=>{let t=class t{};t.\u0275fac=function(u){return new(u||t)},t.\u0275mod=G({type:t}),t.\u0275inj=_({imports:[re,ne]});let r=t;return r})();export{Oe as StatsModule};
