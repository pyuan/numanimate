jQuery NumAnimate
==========

A jQuery plugin that gradually tweens one numeric value to another and displays it in the specified DOM element. You can see an example [here](http://paulyuan.ca/numanimate).


## Required Files
	<script type="text/javascript" src="jquery.js"></script>
	<script type="text/javascript" src="jquery_ui.js"></script> <!-- optional, needed only if you want to apply easing to the animation -->
	<script type="text/javascript" src="jquery.numanimate.min.js"></script>


## Sample Usage
	
    $(DOM element).numanimate( {options} );

The following would perform a tween from 0 to 100 over 1 second and display the value in an element with the id "element":

	$("#element").numanimate({from: 0, to: 100, time: 1000});


## Options
* **"from"** - value to start from, default is 0. Can be an integer or a floating value. If not set, the text currently displaying in the DOM element will be used.
* **"to"** - value to animate to, default is 0. Can be an integer or a floating value.
* **"time"** - duration time for the animation, default is 1000 (ms).
* **"easing"** - easing for the animation, default is "swing". Other easing options can be used with the jQueryUI plugin.
* **"decimals"** - number of decimals for the precision of the numeric value, if not set, the number of decimals in the "to" value will be used. 
* **"isCurrency"** - boolean to indicate whether to format the value as a currency by prepending the "$" symbol, setting default decimals to 2 places if not specified and adding thousands comma separators. If not set, the "to" value would be used to set this flag.
* **"format"** - optional function to apply any custom formatting to the animating value. The function will receive a number and will need to return a formatted number or string.
* **"step"** - optional function that is run on every step of the animation. The function will receive a formatted string. Not required to return anything, but if something is returned, it would be displayed in the specified DOM element.
* **"complete"** - optional function to that is run when the animation finishes. The function will receive a formatted value. Not required to return anything, but if something is returned, it would be displayed in the specified DOM element.


## FAQ
**I want to animate a currency value but not the $ currency, what gives!**
> Sorry, the $ currency format is just the easiest and the most familiar one (for me) to support. But have no fear, you can use the fomat option to create your own function to format the values any way you would like. 

**Can I animate values in any HTML element?**
> I hope so, right now, it should work for all the common form elements such as a &lt;input/&gt;, &lt;textarea/&gt;, or &lt;button/&gt; as well as any other regular HTML elements such as a &lt;div/&gt; or &lt;p/&gt; etc. Check out the [example](http://paulyuan.ca/numanimate) to see how it works. If there is an element that is not working right, feel free to drop me a line.


[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/6833a9f632a914b4a2d4833964f3984b "githalytics.com")](http://githalytics.com/pyuan/numanimate)
