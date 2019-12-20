/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ListItemBaseRenderer','sap/ui/core/Renderer'],function(q,L,R){"use strict";var G=R.extend(L);G.renderType=function(r,l){var t=l.getTable();t&&r.write('<td class="sapMListTblNavCol">');L.renderType.apply(this,arguments);t&&r.write('</td>');};G.renderCounter=function(r,l){};G.renderLIAttributes=function(r,l){r.addClass("sapMGHLI");if(l.getUpperCase()){r.addClass("sapMGHLIUpperCase");}};G.renderLIContentWrapper=function(r,l){var t=l.getTable();if(t){r.write('<td class="sapMGHLICell"');r.writeAttribute("colspan",t.getColSpan());r.write(">");}L.renderLIContentWrapper.apply(this,arguments);if(t){r.write("</td>");}};G.renderLIContent=function(r,l){var t=l.getTitleTextDirection();r.write("<span class='sapMGHLITitle'");if(t!=sap.ui.core.TextDirection.Inherit){r.writeAttribute("dir",t.toLowerCase());}r.write(">");r.writeEscaped(l.getTitle());r.write("</span>");var c=l.getCount()||l.getCounter();if(c){r.write("<span class='sapMGHLICounter'>");r.writeEscaped(" ("+c+")");r.write("</span>");}};G.addLegacyOutlineClass=function(r,l){if(!l.getTable()){L.addLegacyOutlineClass.apply(this,arguments);}};return G;},true);
