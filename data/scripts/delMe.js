var rulesStruct = {
 rules: [
  {
  name: 'rule1',
  shortcuts:[{key1:'a',key2:'b',matchers:'sadf,sdfasd',shortcutFunction:'functionName',cache:false},
			{key1:'a',key2:'b',matchers:'sadf,sdfasd',shortcutFunction:'functionName',cache:true}],
  applyTo: ['*google.com*','*meow.com*'],
  dontApplyTo:['*evilSite.com*', '*someRandomSite.com*']
 },
 {
  name: 'rule2',
  shortcuts:[{key1:'a',key2:'b',matchers:'sadf,sdfasd',shortcutFunction:'functionName'},
			{key1:'a',key2:'b',matchers:'sadf,sdfasd',shortcutFunction:'functionName'}],
  applyTo: [],
  dontApplyTo:[]
 }
 ],

 functionData:
			{
			 functionName: 'function(matches){this is how a function goes as string}'
			}
};