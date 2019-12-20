/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","./ResponsivePopover","./Button","./Toolbar","./ToolbarSpacer","./Bar","./List","./StandardListItem","./library","sap/ui/core/Control","sap/ui/core/IconPool","./Text","sap/ui/core/Icon","./SegmentedButton","./Page","./NavContainer","./Popover","./ViewSettingsItem","sap/ui/base/ManagedObject"],function(q,R,B,T,a,b,L,S,l,C,I,c,d,e,P,N,f,V,M){"use strict";var g='-toolbar';var h='-segmented';var j='-listitem';var k='-group';var m='-filter';var n='-sort';var F='-filterdetailItem';var o='-navContainer';var p='-mainPage';var D='-detailspage';var r='-backbutton';var s='-title';var t='-searchfield';var u='-selectall';var v=C.extend("sap.m.ViewSettingsPopover",{metadata:{library:"sap.m",aggregations:{sortItems:{type:"sap.ui.core.Item",multiple:true,singularName:"sortItem"},filterItems:{type:"sap.ui.core.Item",multiple:true,singularName:"filterItem"},filterDetailItems:{type:"sap.ui.core.Item",multiple:true,singularName:"filterDetailItem"},groupItems:{type:"sap.ui.core.Item",multiple:true,singularName:"groupItem"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{afterOpen:{parameters:{openBy:{type:"sap.ui.core.Control"}}},afterClose:{parameters:{openBy:{type:"sap.ui.core.Control"}}},beforeOpen:{parameters:{openBy:{type:"sap.ui.core.Control"}}},beforeClose:{parameters:{openBy:{type:"sap.ui.core.Control"}}},sortSelected:{allowPreventDefault:true,parameters:{items:{type:"array"}}},filterSelected:{allowPreventDefault:true,parameters:{items:{type:"array"}}},groupSelected:{allowPreventDefault:true,parameters:{items:{type:"array"}}},afterFilterDetailPageOpened:{parameters:{parentFilterItem:{type:"sap.m.ViewSettingsFilterItem"}}}}},constructor:function(i,w){this._stashedItems={};if(!w&&i&&typeof i==='object'){w=i;}this._stashItems(w);if(w&&Array.isArray(w['sortItems'])){w['sortItems']=null;}if(w&&Array.isArray(w['filterItems'])){w['filterItems']=null;}if(w&&Array.isArray(w['groupItems'])){w['groupItems']=null;}M.prototype.constructor.apply(this,arguments);this._getPopover().addContent(this._getNavContainer());this._addStashedItems();}});v.prototype.init=function(){this._tabMap={sort:'sort',filter:'filter',filterDetail:'filterDetail',group:'group'};};v.prototype.openBy=function(i){var w=this._getPopover(i);w.openBy(i);if(sap.ui.Device.system.phone){this._showContentFor(this._determinePageToOpen());}else{this._removeSegmentedButtonSelection();this._adjustInitialWidth();}this._initialHeight=this._getPopover().getContentHeight();if(this._getSegmentedButton().getItems()&&this._getSegmentedButton().getItems().length===1){this._showContentFor(this._determinePageToOpen());}if(w.getAriaLabelledBy()&&w.getAriaLabelledBy().indexOf(this._getPopoverAriaLabel())===-1){w.addAriaLabelledBy(this._getPopoverAriaLabel());}};v.prototype._removeSegmentedButtonSelection=function(){this._getSegmentedButton().setProperty('selectedKey','',true).removeAllAssociation('selectedButton',true);this._getSegmentedButton().getButtons().forEach(function(i){i.$().removeClass("sapMSegBBtnSel").attr("aria-checked",false);});};v.prototype.toggle=function(i){if(this.isOpen()){this.close();}else{this.openBy(i);}return this;};v.prototype.isOpen=function(){return this._getPopover().isOpen();};v.prototype.close=function(){this._getPopover().close();this._cleanAfterClose();return this;};v.prototype._determinePageToOpen=function(){var i,w,x;for(i in this._tabMap){w=this._tabMap[i];w=w.slice(0,1).toUpperCase()+w.slice(1);x=this['_get'+w+'List']().getItems();if(x.length){return this._tabMap[i];}}return this._tabMap['sort'];};v.prototype._removeFooter=function(){if(this._getPopover()._oFooter){this._getPopover()._oFooter.destroy();this._getPopover()._oFooter=null;}this._getPopover().destroyAggregation('beginButton');this._getPopover().destroyAggregation('endButton');};v.prototype._showContentFor=function(i,w,x){var y=sap.ui.getCore().byId(this._getPopoverAriaLabel()),A;this._getPopover().setContentHeight('300px');this._getPopover().setContentWidth('300px');this._removePageContents(i);this._addPageContents(i);if(i===this._tabMap['filterDetail']){A=this._updateTitleText(this._getText('VIEWSETTINGS_TITLE_FILTERBY')+w.getTitle(),true);this._goToDetailsPage(w,x);}else{A=this._updateTitleText(i);if(i===this._tabMap['filter']){this._updateFilterListItemsCount();}this._goToMainPage();}y.setText(A);this._getSegmentedButton().setSelectedKey(i);this._currentPageId=i;};v.prototype._updateTitleText=function(i,w){var x,y=i;if(!w){x=i;if(x=='filterDetail'){x='filter';}x="VIEWSETTINGS_TITLE_"+x.toUpperCase();y=this._getText(x);}if(w&&this._getDetailsPage().getHeaderContent()[0].getContentMiddle()){this._getDetailsPage().getHeaderContent()[0].getContentMiddle()[0].setText(y);}else{this._getTitle().setText(y);}return y;};v.prototype._goToDetailsPage=function(i,w){var x=this._findViewSettingsItemFromListItem(i).getMultiSelect();if(x){this._getSearchField().setValue('');this._getDetailsPage().insertAggregation('content',new T({content:[this._getSearchField().addStyleClass('sapMVSDFilterSearchField'),this._getShowSelectedOnlyButton()]}),0);this._getFilterDetailList().setHeaderToolbar(new T({content:[this._getSelectAllCheckbox(this._findViewSettingsItemFromListItem(i).getItems(),this._getFilterDetailList())]}).addStyleClass('sapMVSDFilterHeaderToolbar'));}else{this._getFilterDetailList().removeAllAggregation('headerToolbar');}this._updateFilterDetailListFor(i);this._navigateToPage('Details',w);this._addFooterButtons();this._updateSelectAllCheckBoxState();if(sap.ui.Device.system.phone){this._hideToolbarButtons();}this._lastViewedFilterParent=i;this._oPreviousSelectedFilters={selectedItemIds:this._getFilterDetailList().getSelectedItems().map(function(y){return y.getId();})};this.fireAfterFilterDetailPageOpened({parentFilterItem:i});};v.prototype._getShowSelectedOnlyButton=function(){var i=false;if(!this._oShowSelectedOnlyButton){this._oShowSelectedOnlyButton=new sap.m.Button({icon:I.getIconURI("multiselect-all"),tooltip:this._getText('SHOW_SELECTED_ONLY'),press:function(E){i=!i;if(i){E.getSource().$("inner").addClass('sapMBtnActive');}this._getFilterDetailList().getItems().forEach(function(w){if(i){if(!w.getSelected()){w.setVisible(false);}}else if(!i){this._filterItemsBy(this._getSearchField().getValue());}},this);this._updateSelectAllCheckBoxState();}.bind(this)});}return this._oShowSelectedOnlyButton;};v.prototype._updateSelectAllCheckBoxState=function(){var w=sap.ui.getCore().byId(this.getId()+u),x=this._getFilterDetailList().getItems()||[],A=true,y=0,i;for(i=0;i<x.length;i++){if(x[i].getVisible()){y++;if(!x[i].getSelected()){A=false;}}}if(w){w.setSelected(A&&y);}};v.prototype._addFooterButtons=function(){var i=new B({text:this._getText("VIEWSETTINGS_ACCEPT"),press:this._confirmFilterDetail.bind(this)}),w=new B({text:this._getText("VIEWSETTINGS_CANCEL"),press:this._cancel.bind(this)});this._getPopover().setBeginButton(i);this._getPopover().setEndButton(w);};v.prototype._confirmFilterDetail=function(){var i=this._getFilterDetailList().getItems().filter(function(w){return w.getSelected();});this.fireFilterSelected({items:i.map(function(w){return this._findViewSettingsItemFromListItem(w);}.bind(this))});this.close();};v.prototype._cancel=function(){this._restorePreviousState();this._updateFilterListItemsCount();this.close();};v.prototype._restorePreviousState=function(){var w;if(this._oPreviousSelectedFilters){w=function(x,y,z){var i;for(i=0;i<x.length;i++){if(y.getId()===x[i]){z.setProperty('selected',true,true);break;}}};this._getFilterDetailList().getItems().forEach(function(i){var x=this._findViewSettingsItemFromListItem(i);x.setProperty('selected',false,true);w(this._oPreviousSelectedFilters.selectedItemIds,i,x);},this);this._updateSelectAllCheckBoxState();}};v.prototype._hideToolbarButtons=function(){this._getPopover().setShowHeader(false);q.sap.delayedCall(0,this,function(){if(this._getPopover().getAggregation('_popup')._internalHeader){this._getPopover().getAggregation('_popup')._internalHeader.$().hide();}});};v.prototype._goToMainPage=function(){this._getPopover().setShowHeader(true);this._getPopover().setCustomHeader(this._getToolbar());this._oPreviousSelectedFilters=null;this._navigateToPage('Main');};v.prototype._adjustInitialWidth=function(){var i,w,x,y,z=this._getSegmentedButton(),A=z&&z.getButtons();if(!A||!A[0]){return;}i=A[0].$().width();w=parseInt(A[0].$().css('margin-right'),10);x=A.length;if(sap.m._bSizeCompact||!!document.querySelector('.sapUiSizeCompact')){i=i*2;}y=(i+w)*(x+1.6);this._getPopover().setContentWidth(y+"px");};v.prototype._navigateToPage=function(i,w){var x;if(this._getNavContainer().getCurrentPage().getId()!==this['_get'+i+'PageId']()){if(i==='Details'){if(w){this._getNavContainer().to(this['_get'+i+'Page'](),'show');x=sap.ui.getCore().byId(this.getId()+r);x&&x.destroy();x=null;}else{q.sap.delayedCall(0,this._getNavContainer(),"to",[this['_get'+i+'Page'](),"slide"]);}}else{q.sap.delayedCall(0,this._getNavContainer(),'back');}}this._getNavContainer().attachEventOnce("afterNavigate",function(){if(this._currentPageId!==this._tabMap['filterDetail']){this._removeFooter();if(sap.ui.Device.system.desktop&&this._lastViewedFilterParent&&this._lastViewedFilterParent.getFocusDomRef()){this._lastViewedFilterParent.getFocusDomRef().focus();}}else{if(sap.ui.Device.system.desktop&&this._getFilterDetailList().getItems()[0]&&this._getFilterDetailList().getItems()[0].getFocusDomRef()){this._getFilterDetailList().getItems()[0].getFocusDomRef().focus();}}}.bind(this));};v.prototype._updateFilterListItemsCount=function(){var i,w,x=this._getFilterList().getItems();x.forEach(function(y){if(y.getId().indexOf('nofiltering')===-1){w=this._findViewSettingsItemFromListItem(y);if(w instanceof sap.m.ViewSettingsCustomItem){i=w.getFilterCount();}else if(w instanceof sap.m.ViewSettingsFilterItem){i=w.getItems().filter(function(z){return z.getSelected();}).length;}y.setCounter(i);}},this);};v.prototype._updateFilterDetailListFor=function(i){var w=this._findViewSettingsItemFromListItem(i).getMultiSelect();var x=sap.ui.getCore().byId(i.getId().split(j).shift());var y=x&&x.getItems()||[];var z=this._getFilterDetailList();z.destroyAggregation("items");if(w){z.setIncludeItemInSelection(true);z.setMode(sap.m.ListMode.MultiSelect);}else{z.setMode(sap.m.ListMode.SingleSelectLeft);}y.forEach(function(A){z.addItem(new S({id:A.getId()+F,title:A.getText(),type:sap.m.ListType.Active,selected:A.getSelected()}));},this);};v.prototype._removePageContents=function(i){var w,x,y,G='_getMainPage';if(i==='filterDetail'){G='_getDetailsPage';}y=this[G]().getContent()[0];for(w in this._tabMap){x=this._tabMap[w];if(y){if(y.getId()===x+'list'){this['_'+x+'List']=y;}}}this[G]().removeAllContent();};v.prototype._addPageContents=function(i){var w,x,y,G='_getMainPage';if(i==='filterDetail'){G='_getDetailsPage';}for(w in this._tabMap){x=this._tabMap[w];if(x===i){x=x.slice(0,1).toUpperCase()+x.slice(1);y=this['_get'+x+'List']();this[G]().addContent(y);}}};v.prototype._stashItems=function(i){var w=['sort','filter','group'];w.forEach(function(x){if(i&&Array.isArray(i[x+'Items'])){this._stashedItems[x]=i[x+'Items'];}},this);};v.prototype._addStashedItems=function(i){var w,x,y,z;for(w in this._tabMap){var z=this._tabMap[w];x=this._stashedItems[z];for(y in x){var A=x[y];this.addAggregation(z+'Items',A);}}};v.prototype._handleBack=function(E){if(this._currentPageId==='filterDetail'){this._showContentFor('filter');}};v.prototype._getSelectAllCheckbox=function(i,w){var x=sap.ui.getCore().byId(this.getId()+u);if(x){return x;}return new sap.m.CheckBox({id:this.getId()+u,text:'Select All',selected:i&&i.every(function(y){return y&&y.getSelected();}),select:function(E){var y=E.getParameter('selected');w.getItems().filter(function(z){return z.getVisible();}).forEach(function(z){var A=this._findViewSettingsItemFromListItem(z);A.setProperty('selected',y,true);}.bind(this));this._toggleRemoveFilterItem();}.bind(this)});};v.prototype._createList=function(i){var w=new L({id:this.getId()+'-'+i+'list',selectionChange:function(E){this._updateSelectAllCheckBoxState();var x=this._findViewSettingsItemFromListItem(E.getParameter('listItem'));var y;var z;var A=[];x.setProperty('selected',E.getParameter('selected'),true);if(w.getMode()!==sap.m.ListMode.MultiSelect){y=this.getFilterItems();if(y){y.forEach(function(H){z=H.getItems();if(z){A=A.concat(z);}});}A.forEach(function(H){if(H.getParent().getId()===x.getParent().getId()&&H.getSelected(true)&&H.getId()!==x.getId()){H.setProperty('selected',false,true);}});}var G=i.slice(0,1).toUpperCase()+i.slice(1);if(i==='filterDetail'){G='Filter';}else{this['fire'+G+'Selected']({items:[x]});this.close();}switch(i){case'group':this._getGroupList().addItem(this._getRemoveGroupingItem());break;}}.bind(this)});if(i!=='filter'){w.setMode(sap.m.ListMode.SingleSelectMaster);}this['_'+i+'List']=w;};v.prototype._getRemoveGroupingItem=function(){if(!this._removeGroupingItem){this._removeGroupingItem=new S({id:this.getId()+'-nogrouping',title:this._getText('NO_GROUPING'),type:sap.m.ListType.Active});}return this._removeGroupingItem;};v.prototype._getRemoveFilterItem=function(){if(!this._removeFilteringItem){this._removeFilteringItem=new S({id:this.getId()+'-nofiltering',title:this._getText('REMOVE_FILTER'),type:sap.m.ListType.Active,press:function(){this.getFilterItems().forEach(function(i){i.getItems().forEach(function(w){w.setProperty('selected',false,true);});});this.close();this._removeFilteringItem.destroy();this._removeFilteringItem=null;}.bind(this)});}return this._removeFilteringItem;};v.prototype._addTab=function(i){var w=this._tabMap[i];switch(w){case'group':w=w+'-2';break;}var x=new sap.m.SegmentedButtonItem({key:i,icon:I.getIconURI(w),tooltip:this._getText("VIEWSETTINGS_TITLE_"+i.toUpperCase()),press:function onTabPress(E){var y=E.getSource().getProperty('key');var z=this['get'+y.slice(0,1).toUpperCase()+y.slice(1)+'Items']();if(this._currentPageId===y||this._currentPageId===this._tabMap['filterDetail']&&z&&z.length>1){if(sap.ui.Device.system.phone){this._cancel();}else{this._hideContent();}}else{if(z&&z.length===1){if(y!=='filter'){z.forEach(function(A){A.setSelected(!A.getSelected());});this['fire'+y.slice(0,1).toUpperCase()+y.slice(1)+'Selected']({items:z});this.close();}else{this._showContentFor('filterDetail',this._findListItemFromViewSettingsItem(z[0]),true);}}else{this._showContentFor(y);}}}.bind(this)});switch(i){case'sort':this._getSegmentedButton().insertItem(x,0);break;case'filter':this._getSegmentedButton().insertItem(x,1);break;case'group':this._getSegmentedButton().addItem(x);break;}};v.prototype._hideContent=function(){this._removeSegmentedButtonSelection();this._cleanAfterClose();q.sap.delayedCall(0,this,'_adjustInitialWidth');};v.prototype._cleanAfterClose=function(){this._removePageContents(this._currentPageId);this._getPopover().setContentHeight(this._initialHeight);this._removeFooter();this._navigateToPage('Main');this._currentPageId=null;};v.prototype._removeTab=function(i){var w=this._getSegmentedButton().getItems();w.forEach(function(x){if(x.getKey()===i.toLowerCase()){this._getSegmentedButton().removeItem(x);}},this);if(this._currentPageId===i.toLowerCase()){this._showContentFor(this._determinePageToOpen());}};v.prototype._getPopoverAriaLabel=function(){var i=this.getAssociation("ariaLabelledBy");if(!i){i=new sap.ui.core.InvisibleText({text:this._getText("ARIA_LABELLED_BY_POPOVER")}).toStatic().getId();this.setAssociation("ariaLabelledBy",i,true);}return i;};v.prototype._isItemsAggregation=function(A){var i=[];var w;for(w in this._tabMap){i.push(w+'Items');}if(i.indexOf(A)===-1){return false;}return true;};v.prototype.addAggregation=function(A,O,i){if(this._isItemsAggregation(A)){(!this.getAggregation(A)||this.getAggregation(A).length===0)&&this._addTab(A.replace('Items',''));this._handleItemsAggregation.call(this,['addAggregation',A,O,i],true);}return C.prototype.addAggregation.call(this,A,O,i);};v.prototype.insertAggregation=function(A,O,i,w){if(this._isItemsAggregation(A)){(!this.getAggregation(A)||this.getAggregation(A).length===0)&&this._addTab(A.replace('Items',''));this._handleItemsAggregation.call(this,['insertAggregation',A,O,i,w],true);}return C.prototype.insertAggregation.call(this,A,O,i,w);};v.prototype.removeAggregation=function(A,O,i){if(this._isItemsAggregation(A)){this._handleItemsAggregation.call(this,['removeAggregation',A,O,i]);if(!this['getAggregation'](A)){this._removeTab(A.replace('Items',''));}}return C.prototype.removeAggregation.call(this,A,O,i);};v.prototype.removeAllAggregation=function(A,i){if(this._isItemsAggregation(A)){this._handleItemsAggregation.call(this,['removeAllAggregation',A,null,i]);this._removeTab(A.replace('Items',''));}return C.prototype.removeAllAggregation.call(this,A,i);};v.prototype.destroyAggregation=function(A,i){if(this._isItemsAggregation(A)){var w=A.replace('Items','');this._handleItemsAggregation.call(this,['destroyAggregation',A,i]);this._removeTab(w.slice(0,1).toUpperCase()+w.slice(1));}return C.prototype.destroyAggregation.call(this,A,i);};v.prototype._handleItemsAggregation=function(A,i){var w=A[0],x=A[1],O=A[2],y=A.slice(1);if(!this._isItemsAggregation(x)){return this;}if(i){this._attachItemEventListeners(O);}else{this._detachItemEventListeners(O);}this._handleListItemsAggregation(y,i,w,O);return this;};v.prototype._handleListItemsAggregation=function(A,i,w,O){var x,y,z,E,G,H=A[0],J=false;switch(H){case'sortItems':x=this._getSortList();break;case'groupItems':x=this._getGroupList();break;case'filterItems':x=this._getFilterList();break;case'filterDetailItems':x=this._getFilterDetailList();break;}if(w==='destroyAggregation'&&!x){return;}if(O===null||typeof O!=='object'){return x[w]['apply'](x,A);}if(i){J=H==='filterItems'&&O.getItems;z=this._createListItemFromViewSettingsItem(O,H.replace("Items",""),J);}else{z=this._findListItemFromViewSettingsItem(O);}A.forEach(function(K,Q){if(K&&typeof K==='object'){A[Q]=z;}});for(E in this._tabMap){G=this._tabMap[E];A[0]=A[0].replace(G+'I','i');}y=x[w].apply(x,A);if(w=='removeAggregation'){y.destroy();}switch(H){case'filterItems':this._toggleRemoveFilterItem();break;}return y;};v.prototype._toggleRemoveFilterItem=function(){var H=false;this.getFilterItems().forEach(function(i){if(i.getItems){i.getItems().forEach(function(w){if(w.getSelected()){H=true;}});}});if(H){if(!this._getRemoveFilterItem().getParent()){this._getFilterList().addItem(this._getRemoveFilterItem());}}else{if(this._removeFilteringItem){this._removeFilteringItem.destroy();this._removeFilteringItem=null;}}};v.prototype._attachItemEventListeners=function(O){if(O instanceof V&&O.getId().indexOf('nogrouping')===-1){O.detachItemPropertyChanged(this._handleViewSettingsItemPropertyChanged.bind(this));O.attachItemPropertyChanged(this._handleViewSettingsItemPropertyChanged.bind(this));}if(O instanceof sap.m.ViewSettingsFilterItem){O.detachFilterDetailItemsAggregationChange(this._handleFilterDetailItemsAggregationChange.bind(this));O.attachFilterDetailItemsAggregationChange(this._handleFilterDetailItemsAggregationChange.bind(this));}};v.prototype._handleViewSettingsItemPropertyChanged=function(E){var i=E.getParameter('changedItem');var w=this._findListItemFromViewSettingsItem(i);var x=E.getParameter('propertyKey');var y=E.getParameter('propertyValue');if(x==='text'){x='title';}if(w&&['key','multiSelect'].indexOf(x)==-1){w.setProperty(x,y);}};v.prototype._handleFilterDetailItemsAggregationChange=function(E){var i=E.getParameters(),w=i.item||i.changedItem;if(w&&w.getParent&&w.getParent()instanceof V){this._updateFilterDetailListFor(w.getParent());}};v.prototype._detachItemEventListeners=function(O){};v.prototype._createListItemFromViewSettingsItem=function(i,w,H){var x,y=j;if(!i&&!(i instanceof sap.m.ViewSettingsItem)){q.sap.log.error('Expecting instance of "sap.m.ViewSettingsItem": instead of '+i+' given.');return;}switch(w){case"group":y+=k;break;case"filter":y+=m;break;case"sort":y+=n;break;}x=new sap.m.StandardListItem({id:i.getId()+y,title:i.getText(),type:sap.m.ListType.Active});H&&x.attachPress(this._showContentFor.bind(this,'filterDetail',x,false))&&x.setType(sap.m.ListType.Navigation);return x;};v.prototype._findViewSettingsItemFromListItem=function(i){var w=j;if(i.getId().indexOf('filterdetail')!==-1){w=F;}return sap.ui.getCore().byId(i.getId().split(w).shift());};v.prototype._findListItemFromViewSettingsItem=function(i){var w=i.getId()+j,x=sap.ui.getCore().byId(w+k)||sap.ui.getCore().byId(w+m)||sap.ui.getCore().byId(w+n);if(!x){x=sap.ui.getCore().byId(i.getId()+F);}return x;};v.prototype._getMainPage=function(){if(!this._mainPage){this._mainPage=new P({showHeader:true,id:this._getMainPageId()});this._getMainPage().addHeaderContent(new sap.m.Bar({contentMiddle:this._getTitle()}).addStyleClass('sapMVSDBar').addStyleClass("sapMVSPCompactHeaderBar"));}return this._mainPage;};v.prototype._getDetailsPage=function(){var i,w;if(!this._detailsPage){this._detailsPage=new P({showHeader:true,id:this._getDetailsPageId()});var x=new sap.m.Label({text:this._getText("VIEWSETTINGS_TITLE")}).addStyleClass("sapMVSDTitle");w=new sap.m.Bar({contentMiddle:[x]}).addStyleClass("sapMVSPCompactHeaderBar");this._getDetailsPage().addHeaderContent(w);i=new sap.m.Button(this.getId()+r,{icon:I.getIconURI("nav-back"),press:this._handleBack.bind(this)});w.addContentLeft(i);}return this._detailsPage;};v.prototype._getMainPageId=function(){return this.getId()+p;};v.prototype._getDetailsPageId=function(){return this.getId()+D;};v.prototype._getPopover=function(O){if(!this._popover){this._popover=new R({showHeader:true,contentWidth:"300px",placement:sap.m.VerticalPlacementType.Vertical,showCloseButton:false,modal:false,afterOpen:function(E){this.fireAfterOpen({openBy:E.getParameter("openBy")});this.$().attr("aria-labelledby",this._getPopoverAriaLabel());this._getSegmentedButton().getFocusDomRef().focus();}.bind(this),afterClose:function(E){this._cleanAfterClose();this.fireAfterClose({openBy:E.getParameter("openBy")});}.bind(this),beforeOpen:function(E){this.fireBeforeOpen({openBy:E.getParameter("openBy")});}.bind(this),beforeClose:function(E){this.fireBeforeClose({openBy:E.getParameter("openBy")});}.bind(this)}).addStyleClass('sapMVSPopover');this._popover.setCustomHeader(this._getToolbar());if(this._popover.getAggregation('_popup').setShowArrow){this._popover.getAggregation('_popup').setShowArrow(false);}}if(O&&O.$()){this._popover.setOffsetY(-O.$().height());}return this._popover;};v.prototype._getNavContainer=function(){if(!this._navContainer){this._navContainer=new N(this.getId()+o,{initialPage:this._getMainPageId(),pages:[this._getMainPage(),this._getDetailsPage()]});}return this._navContainer;};v.prototype._getSortList=function(){if(!this._sortList){this._createList('sort');}return this._sortList;};v.prototype._getGroupList=function(){if(!this._groupList){this._createList('group');}return this._groupList;};v.prototype._getFilterList=function(){if(!this._filterList){this._createList('filter');}return this._filterList;};v.prototype._getFilterDetailList=function(){if(!this._filterDetailList){this._createList('filterDetail');this._filterDetailList.attachEvent('selectionChange',function(){this._toggleRemoveFilterItem();}.bind(this));}return this._filterDetailList;};v.prototype._getToolbar=function(){if(!this._toolbar){var i;this._toolbar=new sap.m.Toolbar({id:this.getId()+g});this._oCloseBtnARIAInvText=new sap.ui.core.InvisibleText({text:this._getText("MESSAGEPOPOVER_CLOSE")});i=new B({icon:I.getIconURI("decline"),ariaLabelledBy:this._oCloseBtnARIAInvText.toStatic().getId(),press:this._cancel.bind(this)}).addStyleClass('sapMVSPCloseBtn');this._toolbar.addContent(this._getSegmentedButton());this._toolbar.addContent(new a());this._toolbar.addContent(i);}return this._toolbar;};v.prototype._getTitle=function(){if(!this._title){this._title=new sap.m.Label(this.getId()+"-title",{id:this.getId()+s,text:this._getText("VIEWSETTINGS_TITLE")}).addStyleClass("sapMVSDTitle");}return this._title;};v.prototype._getSearchField=function(){if(!this._filterSearchField){this._filterSearchField=new sap.m.SearchField({id:this.getId()+t,liveChange:function(E){this._filterItemsBy(E.getParameter('newValue').toLowerCase());}.bind(this)});this._updateSelectAllCheckBoxState();}return this._filterSearchField;};v.prototype._filterItemsBy=function(Q){this._getFilterDetailList().getItems().forEach(function(i){var w=i.getTitle().toLowerCase().indexOf(Q)===0;i.setVisible(w);});this._updateSelectAllCheckBoxState();};v.prototype._getSegmentedButton=function(){if(!this._segmentedButton){this._segmentedButton=new e(this.getId()+h);}return this._segmentedButton;};v.prototype._getText=function(K){return sap.ui.getCore().getLibraryResourceBundle("sap.m").getText(K);};v.prototype.getDomRef=function(i){return this._popover&&this._popover.getAggregation("_popup").getDomRef(i);};["invalidate","close","isOpen","addStyleClass","removeStyleClass","toggleStyleClass","hasStyleClass","setBindingContext","getBindingContext","getBinding","getBindingInfo","getBindingPath","setBusy","getBusy","setBusyIndicatorDelay","getBusyIndicatorDelay"].forEach(function(i){v.prototype[i]=function(){if(this._popover&&this._popover[i]){var w=this._popover[i].apply(this._popover,arguments);return w===this._popover?this:w;}};});v.prototype.exit=function(){if(this._sortList){this._sortList.destroy();this._sortList=null;}if(this._filterList){this._filterList.destroy();this._filterList=null;}if(this._filterDetailList){this._filterDetailList.destroy();this._filterDetailList=null;}if(this._groupList){this._groupList.destroy();this._groupList=null;}this._popover.destroy();this._popover=null;this._oCloseBtnARIAInvText.destroy();this._oCloseBtnARIAInvText=null;this._title=null;this._navContainer=null;this._mainPage=null;this._detailsPage=null;this._toolbar=null;this._segmentedButton=null;this._currentPageId=null;this._tabMap=null;this._oPreviousSelectedFilters=null;var i=sap.ui.getCore().byId(this.getAssociation("ariaLabelledBy"));if(i&&i.destroy&&!i.bIsDestroyed){i.destroy();i=null;}if(this._removeFilteringItem){this._removeFilteringItem.destroy();this._removeFilteringItem=null;}};return v;},false);
