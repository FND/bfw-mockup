(function($) {

"use strict";

// hijacks clicks to read mock contents from templates
// the clicked element's `href` or text value determines the template being used
// each template contains a title, nav items and page contents

var separator = "----\n";
var name2template = {
	"home": "frontpage",
	"dashboard": "dashboard",
	"wiki index": "wiki-index"
};

$(document.body).on("click", "a", onLinkSelect);
// initialize (hacky, but pragmatic)
var dummy = $("<span />").text("home")[0];
onLinkSelect.call(dummy);

function onLinkSelect(ev) {
	var link = $(this);
	var target = link.attr("href");
	var name = target && target.substr(1) || link.text().trim();
	var data = parseTemplate(name);

	var nav = $("ul.nav").empty();
	nav.nextUntil("script").remove();

	$("title").text(data.title);
	nav.append(data.navItems);
	data.contents.insertAfter(nav);
}

function parseTemplate(name) {
	name = name.replace(/\*$/, ""); // XXX: special-casing, undocumented
	var template = name2template[name] || name;
	template = $("#" + template).text();
	if(!template) {
		template = $("#error").text();
	}

	var sections = template.split(separator);
	var title = sections.shift().trim();
	var navItems = sections.shift().trim().split("\n");
	navItems = $.map(navItems, function(item) {
		var label = item.trim();
		var active = label.indexOf("!") === 0; // XXX: undocumented
		var divided = label.indexOf("~") === 0; // XXX: undocumented
		var el = $("<li />");
		if(active) {
			label = label.substr(1);
			el.addClass("pure-menu-selected");
		} else if(divided) {
			label = label.substr(1);
			el.addClass("divided");
		}
		var link = $('<a href="#" />').text(label);
		return el.append(link)[0];
	}); // NB: not a jQuery collection

	var contents = sections.join(separator);
	contents = $("<div />").html(contents).children();

	return { title: title, navItems: navItems, contents: contents };
}

}(jQuery));
