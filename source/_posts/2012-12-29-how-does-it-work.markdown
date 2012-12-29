---
layout: post
title: "How does it work?"
date: 2012-12-29 12:11
comments: true
categories: 
---

When you have a [sequence][sequence] `o` + `.elementInFocus` + `openFirstLink`, everytime the the key `o` is pressed, the `openFirstLink` is called with `jQuery(.elementInFocus)` as param, given that _no input/textarea is in focus_.

The sequences bound to a page are controlled by the rules which is a collection of sequences with apply-to, dont-apply-to url filters.
  
You can download from [mozilla omnisequenences addon page][omnisequenences].

[omnisequenences]:https://addons.mozilla.org/en-US/firefox/addon/omnisequences/ "omnisequences"	
[sequence]:/blog/2012/12/29/what-is-a-sequence/ "What is a sequence?"	