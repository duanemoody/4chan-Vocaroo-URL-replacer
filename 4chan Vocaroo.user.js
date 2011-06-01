// ==UserScript==
// @name			4chan Vocaroo URL replacer
// @namespace		ScottSteiner@irc.rizon.net
// @description		Turns plaintext vocaroo URIs into embedded objects
// @include			http://4chanarchive.org/brchive/*
// @include			http://archive.easymodo.net/cgi-board.pl/*
// @include			http://archive.no-ip.org/*
// @include			http://boards.4chan.org/*
// @include			http://boards.420chan.org/*
// @include			http://dis.4chan.org/read/*
// @include			http://green-oval.net/cgi-board.pl/*
// @include			http://suptg.thisisnotatrueending.com/archive/*
// @version			1.0.3
// @copyright		2010-2011, Scott Steiner <#ScottSteiner@irc.rizon.net>
// @license			GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// ==/UserScript==

limit			= 5
reDis			= /<a rel.*>.*?\?v=([a-zA-Z0-9_-]{11}).*?<\/a>(?:<br \/>|)/
reLinked		= /<a href="(?:http.{3}|)(?:www.|)vocaroo.com\/\?media=.*?"(?: rel="nofollow"|)>(?:http.{3}|)(?:www.|)vocaroo.com\/\?media=([a-zA-Z0-9]{17}).*<\/a>(?:<br>|)/g
reMain			= /(?:http.{3}|)(?:www.|)vocaroo.com\/\?media=([a-zA-Z0-9]{17})(?:<br>|)/g

reDisSites		= /(?:dis.4chan.org)/
reLinkedSites	= /(?:420chan.org|green-oval.net)/
reMainSites		= /(?:boards.4chan.org|4chanarchive.org|archive.easymodo.net|suptg.thisisnotatrueending.com)/

embedcode 		= '<object type="application/x-shockwave-flash" style="width: 148px; height: 44px" data="http://vocaroo.com/player.swf?playMediaID=$1&server=m1.vocaroo.com&autoplay=0""><param name="movie" value="http://vocaroo.com/player.swf?playMediaID=$1&server=m1.vocaroo.com&autoplay=0"></object><br />'

switch(document.domain) {
	case "boards.420chan.org" :
	case "green-oval.net" :					reCode = reLinked;	break;
	case "4chanarchive.org" :
	case "archive.easymodo.net" :
	case "archive.no-ip.org" :
	case "boards.4chan.org" :
	case "suptg.thisisnotatrueending.com" :	reCode = reMain;	break;
	case "dis.4chan.org" :					reCode = reDis;		break;
}
posts = document.getElementsByTagName("blockquote");
for (i = 0; i < posts.length; i++) { 
	var j = limit;
	posts[i].innerHTML		= posts[i].innerHTML.replace(reCode, function (v) {return j-- > 0 ? v.replace(reCode,embedcode) : v;});
}