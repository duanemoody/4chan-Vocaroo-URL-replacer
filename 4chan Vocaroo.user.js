// ==UserScript==
// @name			4chan Vocaroo URL replacer
// @namespace		ScottSteiner@irc.rizon.net
// @description		Turns plaintext vocaroo URIs into embedded objects
// @include			http://4chanarchive.org/brchive/*
// @include			http://archive.easymodo.net/cgi-board.pl/*
// @include			http://boards.4chan.org/*
// @include			http://boards.420chan.org/*
// @include			http://dis.4chan.org/read/*
// @include			http://suptg.thisisnotatrueending.com/archive/*
// @version			1.0
// @copyright		2010, Scott Steiner <#ScottSteiner@irc.rizon.net>
// @license			GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// ==/UserScript==

reDis			= /<a rel.*>.*?\?v=([a-zA-Z0-9_-]{11}).*?<\/a>(?:<br \/>|)/
reLinked		= /<a href="(?:http.{3}|)(?:www.|)vocaroo.com\/\?media=.*" rel="nofollow">.*\?media=([a-zA-Z0-9]{17}).*?<\/a>/
reMain			= /(?:http.{3}|)(?:www.|)vocaroo.com\/\?media=([a-zA-Z0-9]{17})(?:<br>|)/

reDisSites		= /(?:dis.4chan.org)/
reLinkedSites	= /(?:420chan.org)/
reMainSites		= /(?:boards.4chan.org|4chanarchive.org|archive.easymodo.net|suptg.thisisnotatrueending.com)/

embedcode 		= '<object type="application/x-shockwave-flash" style="width: 148; height: 44" data="http://vocaroo.com/player.swf?playMediaID=$1&server=m1.vocaroo.com&autoplay=0""><param name="movie" value="http://vocaroo.com/player.swf?playMediaID=$1&server=m1.vocaroo.com&autoplay=0"></object><br />'

posts = document.getElementsByTagName("blockquote");
for (i = 0; i < posts.length; i++) { 
	for (j = 0; j < 5; j++) { 
		if (reDisSites.exec(document.URL))		posts[i].innerHTML		= posts[i].innerHTML.replace(reDis, embedcode);
		if (reLinkedSites.exec(document.URL))	posts[i].innerHTML		= posts[i].innerHTML.replace(reLinked, embedcode); 
		if (reMainSites.exec(document.URL))		posts[i].innerHTML		= posts[i].innerHTML.replace(reMain, embedcode); 
	}
}