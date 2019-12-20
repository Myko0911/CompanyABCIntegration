/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Item'],function(q,l,I){"use strict";var M=I.extend("sap.m.MenuItem",{metadata:{library:"sap.m",properties:{icon:{type:"string",group:"Appearance",defaultValue:null},visible:{type:"boolean",group:"Appearance",defaultValue:true},startsSection:{type:"boolean",group:"Behavior",defaultValue:false}},defaultAggregation:"items",aggregations:{items:{type:"sap.m.MenuItem",multiple:true,singularName:"item",bindable:"bindable"}},events:{press:{},propertyChanged:{parameters:{propertyKey:{type:"string"},propertyValue:{type:"any"}}},aggregationChanged:{parameters:{aggregationName:{type:"String"},methodName:{type:"String"},methodParams:{type:"Object"}}}}}});M.prototype.exit=function(){if(this._sVisualChild){this._sVisualChild=null;}if(this._sVisualParent){this._sVisualParent=null;}if(this._sVisualControl){this._sVisualControl=null;}};M.prototype.setProperty=function(p,P){I.prototype.setProperty.apply(this,arguments);this.fireEvent("propertyChanged",{propertyKey:p,propertyValue:P});};M.prototype.addAggregation=function(a,o,s){I.prototype.addAggregation.apply(this,arguments);this.fireEvent("aggregationChanged",{aggregationName:a,methodName:"add",methodParams:{item:o}});return this;};M.prototype.insertAggregation=function(a,o,i,s){I.prototype.insertAggregation.apply(this,arguments);this.fireEvent("aggregationChanged",{aggregationName:a,methodName:"insert",methodParams:{item:o,index:i}});return this;};M.prototype.removeAggregation=function(a,o,s){var O=I.prototype.removeAggregation.apply(this,arguments);this.fireEvent("aggregationChanged",{aggregationName:a,methodName:"remove",methodParams:{item:O}});return O;};M.prototype.removeAllAggregation=function(a,s){var o=I.prototype.removeAllAggregation.apply(this,arguments);this.fireEvent("aggregationChanged",{aggregationName:a,methodName:"removeall",methodParams:{items:o}});return o;};M.prototype.destroyAggregation=function(a,s){this.fireEvent("aggregationChanged",{aggregationName:a,methodName:"destroy"});return I.prototype.destroyAggregation.apply(this,arguments);};M.prototype._setVisualChild=function(c){this._setInternalRef(c,"_sVisualChild");};M.prototype._setVisualParent=function(c){this._setInternalRef(c,"_sVisualParent");};M.prototype._setVisualControl=function(c){this._setInternalRef(c,"_sVisualControl");};M.prototype._setInternalRef=function(c,i){if(!c||typeof c==="string"){this[i]=c;}else if(c.getId){this[i]=c.getId();}};M.prototype._getVisualChild=function(){return this._sVisualChild;};M.prototype._getVisualParent=function(){return this._sVisualParent;};M.prototype._getVisualControl=function(){return this._sVisualControl;};return M;},true);
