// ==UserScript==
// @name         YouTube Playlist Close
// @version      1.7
// @description  Allow quick closing of playlists
// @author       AjaxGb
// @match        http*://www.youtube.com/*
// @run-at       document-start
// @resource     button https://raw.githubusercontent.com/AjaxGb/YouTube-Playlist-Close/master/closeMediumDark.png
// @grant        GM_getResourceURL
// @noframes
// ==/UserScript==

(function(){
	'use strict';

	function getQueryArgs(query){
		query = (query || window.location.search).substring(1);
		if(!query) return {};
		return query.split('&').reduce(function(prev, curr){
			const p = curr.split('=');
			prev[decodeURIComponent(p[0])] = p[1] ? decodeURIComponent(p[1]) : p[1];
			return prev;
		}, {});
	}

	function setQueryArgs(query){
		if(!query) return;
		let search = '';
		for(let prop in query){
			if(query[prop] === undefined){
				search += '&'+encodeURIComponent(prop);
			}else{
				search += '&'+encodeURIComponent(prop)+'='+encodeURIComponent(query[prop]);
			}
		}
		return '?' + search.substr(1);
	}

	let q;
	const b = document.createElement('a'), s = b.style;
	s.width  = '44px';
	s.height = '40px';
    s.position = 'absolute';
    s.top = '-8px';
    s.right = '0';
	s.background = 'url("' + GM_getResourceURL('button') + '") center';
    s.backgroundRepeat = 'no-repeat';
	s.cursor = 'pointer';
	s.opacity = 0.5;
	b.title = 'Close playlist';

	b.onmouseenter = function(){
		s.opacity = 0.6;
	};
	b.onmouseleave = function(){
		s.opacity = 0.5;
	};
	b.onmouseup = function(){
		q.time_continue = document.getElementById('movie_player').getCurrentTime()|0;
		b.search = setQueryArgs(q);
		setTimeout(resetQuery);
	};
	function resetQuery(){
		delete q.time_continue;
		b.search = setQueryArgs(q);
	}

	function addButton(p){
		b.href = location.toString();
		q = getQueryArgs(b.search);
		delete q.list;
		delete q.index;
		b.search = setQueryArgs(q);
		p.style.position = 'relative';
		p.appendChild(b);
	}

	const observer = new MutationObserver(function(mrs){
		if(document.contains(b)) return;
        const p = document.getElementById('header-contents');
        if(p) addButton(p);
	});
	observer.observe(document.documentElement, {
		childList: true,
		subtree: true
	});
})();
