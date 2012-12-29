---
layout: post
title: "What is a sequence?"
date: 2012-12-29 14:05
comments: true
categories: 
---
A sequence is `key1[key2]` + `jquery_matchers` + `function_to_invoke`.The arguments to the `function_to_invoke` would be the jquery elements matched by `jquery_matchers`.

When we have a sequence defined as  `o`  + `.elementInFocus` + `openFirstLink`

{% codeblock openFirstLink lang:js %}
function(matches){
	var firstLinkInside = matches.find("a");
	if(firstLinkInside.length >0){
		firstLinkInside[0].click();
	}
}
{% endcodeblock %}

everytime we press `o` (and the focus is not on an input element), it call `openFirstLink(jQuery('.elementInFocus'))`.
