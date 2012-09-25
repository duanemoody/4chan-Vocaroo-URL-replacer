/*
    4chan Vocaroo URL Replacer
    Copyright (C) 2010-2011 ScottSteiner (nothingfinerthanscottsteiner@gmail.com)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

// ==UserScript==
// @name			4chan Vocaroo URL Replacer
// @namespace		http://about.me/ScottSteiner
// @id				Vocaroo@ScottSteiner
// @author			Scott Steiner <nothingfinerthanscottsteiner@gmail.com> http://about.me/ScottSteiner
// @description		Turns plaintext Vocaroo URLs into embedded objects
// @version			2.5
// @copyright		2010-2011, Scott Steiner <nothingfinerthanscottsteiner@gmail.com>
// @license			GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @icon			https://github.com/ScottSteiner/4chan-Vocaroo-URL-Replacer/raw/master/icon.jpg
// @homepage		https://github.com/ScottSteiner/4chan-Vocaroo-URL-Replacer
// @supportURL		https://github.com/ScottSteiner/4chan-Vocaroo-URL-Replacer/issues
// @updateURL		https://userscripts.org/scripts/source/89348.meta.js
// @screenshot		https://github.com/ScottSteiner/4chan-Vocaroo-URL-Replacer/raw/master/screenshot.jpg
// @priority		1
//
// @include			http://*.2chan.net/*
// @include			http://7chan.org/*
// @include			http://*.4chon.net/*
// @include			http://4chanarchive.org/brchive/*
// @include			http://archive.easymodo.net/*
// @include			http://archive.installgentoo.net/cgi-board.pl/*
// @include			http://archive.no-ip.org/*
// @include			http://boards.4chan.org/*
// @include			http://boards.420chan.org/*
// @include			http://chanarchive.org/*
// @include			http://dis.4chan.org/*
// @include			http://*.krautchan.net/*
// @include			http://operatorchan.org/*
// @include			http://*.foolz.us/*
// @include			http://suptg.thisisnotatrueending.com/archive/*
//
// @match			http://*.2chan.net/*
// @match			http://*.4chon.net/*
// @match			http://7chan.org/*
// @match			http://4chanarchive.org/brchive/*
// @match			http://archive.easymodo.net/*
// @match			http://archive.installgentoo.net/cgi-board.pl/*
// @match			http://archive.no-ip.org/*
// @match			http://boards.4chan.org/*
// @match			http://boards.420chan.org/*
// @match			http://chanarchive.org/*
// @match			http://dis.4chan.org/*
// @match			http://*.krautchan.net/*
// @match			http://operatorchan.org/*
// @match			http://*.foolz.us/*
// @match			http://suptg.thisisnotatrueending.com/archive/*
// ==/UserScript==

(function () {
	"use strict";
	var i, embedArray = new Array(0), embedCur = 0, embedTotal = 0, re = {}, settings, sites = {}, siteArray;
	settings = {
		filter: {
			limitPer:		5,
			limitTotal:		-1,
			ignoreDupes:	true
		},
		embed: {
			brBefore:		false,
			brAfter:		false
		}
	};
	settings.embed.code = (settings.embed.brBefore ? '<br />' : '') + '<object type="application/x-shockwave-flash" style="width: 148px; height: 44px" data="http://vocaroo.com/player.swf?playMediaID=$1&server=m1.vocaroo.com&autoplay=0"><param name="movie" value="http://vocaroo.com/player.swf?playMediaID=$1&server=m1.vocaroo.com&autoplay=0" /></object>' + (settings.embed.brAfter ? '<br />' : '');

	re.plaintext	= /(?:http.{3}|)(?:www.|)(?:vocaroo.com\/i\/)([\w]+)(?:<br>|)/g
    re.linked		= /(?:<a href="|)(?:http.{3}|)(?:www.|)(?:vocaroo.com\/i\/)([\w]+)(?:" target="_blank")>(?:http.{3}|)(?:www.|)(?:vocaroo.com\/i\/)(?:[\w]+)<\/a>(?:<br>|)/g

	sites.plaintext	= [/(?:\w*\.2chan\.net|4chanarchive\.org|boards\.4chan\.org|chanarchive\.org|krautchan\.net|suptg\.thisisnotatrueending\.com)/, 'blockquote', re.plaintext];
	sites.linkedBQ	= [/(?:4chan\.org|archive\.easymodo\.net|archive\.installgentoo\.net|archive\.no-ip\.org|boards\.420chan\.org|operatorchan\.org)/, 'blockquote', re.linked];
	sites.linkedDiv	= [/(?:7chan\.org|archive\.foolz\.us)/, 'div', re.linked];
	sites.linkedP	= [/(?:4chon\.net)/, 'p', re.linked];

	for (i in sites) { if (sites.hasOwnProperty(i)) { if (sites[i][0].exec(document.domain)) { siteArray = sites[i]; break; } } }
	
	function embedPost(match) {
		var embedURL;
		embedTotal++;
		embedCur++;
		embedURL = match.replace(siteArray[2], '$1');
		if ((embedArray.indexOf(embedURL) > -1) && (settings.filter.ignoreDupes)) { return ''; }
		if (((settings.filter.limitPer < 0) || (embedCur <= settings.filter.limitPer)) && ((settings.filter.limitTotal < 0) || (embedTotal <= settings.filter.limitTotal))) { 
			embedArray.push(embedURL);
			return settings.embed.code.replace('$1', embedURL);
		} else { return match; }
	}
				
	function embed(n) {
		if ((typeof k == 'number') && n.target.nodeType !== 1) { return; }
		var l, posts, temp;
		posts = document.getElementsByTagName(siteArray[1]);
		for (l = 0; l < posts.length; l++) { 
			embedCur = 0;
			embedArray.length = 0;
			temp = posts[l].innerHTML.replace(siteArray[2], embedPost);
			if (temp !== posts[l].innerHTML) { posts[l].innerHTML = temp; }
		}
	}
	document.addEventListener('DOMNodeInserted', embed, true);
	embed();
}());