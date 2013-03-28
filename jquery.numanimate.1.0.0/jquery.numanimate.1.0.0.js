/**
 * v 0.0.1
 * This plugin animates a numeric value in a HTML DOM element
 * This utilizes the jQuery animate method to gradually tween from one value to another  
 */
(function($) {
	
	$.fn.numanimate = function(options) 
	{
		var opts = $.extend({}, $.fn.numanimate.options, options);
		var isCurrencySet = options && options.isCurrency != null;
		var isFromSet = options && options.from != null;
		
		return this.each(function() {
			opts.element = $(this);
			
			if(!isCurrencySet) {
				opts.isCurrency = isCurrency(opts.to);
			}
			
			if(!isFromSet) {
				opts.from = getElementValue(opts.element);
			}
			
			opts.from = $.numanimate._convertCurrencyToNumber(opts.from); //convert just in case
			opts.to = $.numanimate._convertCurrencyToNumber(opts.to); //convert just in case
			if(!opts.decimals) {
				opts.decimals = getNumDecimals(opts.to);
			}
			$.numanimate._animate(opts);
	    });
	    
	    /**
	     * check to see if value is a currency
	     * @param value, Number
	     * @return isCurrency, boolean
	     */
	    function isCurrency(value)
	    {
	    	var isCurrency = false;
	    	if(String(value).indexOf("$") != -1) {
	    		isCurrency = true;
	    	}
	    	return isCurrency;
	    }
	    
	    /**
		 * get the number of decimals of a number
		 * @param number, Number
		 * @return decimals, int
		 */
	    function getNumDecimals(number) 
	    {
	    	var decimals = 0;
	    	if(!isNaN(number)) {
	    		var numString = String(number);
	    		var start = numString.indexOf(".");
	    		if(start != -1){
	    			decimals = numString.substring(start + 1).length;
	    		}
	    	}
	    	return decimals;
	    }
	    
	    /**
	     * get the value from the element
	     * @param element, DOM element
	     * @return value, string
	     */
	    function getElementValue(element)
	    {
	    	var isFormElement = $.numanimate._isFormElement(element);
	    	var value = isFormElement ? $(element).val() : $(element).text();
	    	return value;
	    }
	}
	
	/**
	 * customization options
	 * @param element, DOM element
	 * @param time, time to animate in ms
	 * @param easing, string
	 * @param from, Number to animate from
	 * @param to, Number to animate to
	 * @param decimals, Number of decimals, if not set, will based on the number of decimals specified in the to value
	 * @param isCurrency, boolean to indicate if value is a currency, if true, value will be formatted as currency and will ignore the decimals setting
	 * @param format, formatter function to format the output at every step of the animation, will receive a Number in the function parameter
	 * @param step, function to call on every step of the animation, will receive a formatted value in the function parameter
	 * @param complete, function to call when the animation ends, will receive the final formatted value in the function parameter
	 */
	$.fn.numanimate.options = 
	{
		element: null,
		time: 1000,
		easing: "swing",
		from: 0,
		to: 100,
		decimals: 0,
		isCurrency: false,
		format: null,
		step: null,
		complete: null
	}

})(jQuery);

/**
 * numanimate specific functions
 */
jQuery.extend({
	
    numanimate: 
    {
    	/**** constants ****/
    	NUMANIMATE_PROPERTY : "numanimate",
    	FORM_ELEMENTS : ["input", "textarea"],
    	
    	/**
    	 * add an item into the queue
    	 * @param options, object
    	 */
    	_animate: function(options) 
    	{
    		var self = this;
    		
    		var from = {};
    		from[this.NUMANIMATE_PROPERTY] = options.from;
    		
    		var to = {};
    		to[this.NUMANIMATE_PROPERTY] = options.to;
    		
    		$(from).animate(to, {
				duration: options.time,
				easing: options.easing, 
				step: function() 
				{ 
					var raw = this[self.NUMANIMATE_PROPERTY];
					var value = $.numanimate._createNumberString(raw, options.decimals);
					var formatted = value;
					
					if(options.isCurrency) {
						formatted = $.numanimate._convertNumberToCurrency(raw);
					}
					
					if(options.format) {
						formatted = options.format(raw);
						if(formatted == null) {
							throw Error("jQuery.numanimate 'format' function needs to return a formatted string.");
						}
					}
					
					if(options.step) {
						options.step(formatted);
					}
					
					if(options.element) {
						$.numanimate._displayValue(options.element, formatted);
					}
				},
				
				complete: function(){
					var raw = $.numanimate._convertCurrencyToNumber(options.to);
					
					if(options.isCurrency) {
						formatted = $.numanimate._convertNumberToCurrency(raw);
					}
					else {
						formatted = $.numanimate._createNumberString(raw, options.decimals);
					}
					
					if(options.format) {
						formatted = options.format(raw);
						if(formatted == null) {
							throw Error("jQuery.numanimate 'format' function needs to return a formatted string.");
						}
					}
					
					if(options.complete) {
						options.complete(formatted);
					}
					
					//make sure to always finish animation with the correct value
					if(options.element) {
						$.numanimate._displayValue(options.element, formatted);
					}
				}
			});
    	},
    	
    	/**
    	 * construct a string from a number to have the specified number of decimal places
    	 * @param number, Number
    	 * @param decimals, int, number of decimal places
    	 * @return numString, string of the number
    	 */
    	_createNumberString: function(number, decimals)
    	{
    		var numString = String(number);
    		if(decimals == 0) 
    		{
    			numString = String(Math.round(number));
    		}
    		else
    		{
    			number = Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    			numString = String(number);
    			var start = numString.indexOf(".");
    			
    			if(start == -1) {
    				numString += ".";
    				start = numString.length-1;
    			}
    			
    			var decimalsString = numString.substring(start + 1); 
    			if(decimalsString.length < decimals) 
    			{
    				for(var i=0; i<decimals-decimalsString.length; i++) {
    					numString += "0";
    				}	
    			}
    		}
    		return numString;
    	},
    	
    	/**
		 * convert a currency string to a number
		 * @param currency, string
		 * @return value, number
		 */
		_convertCurrencyToNumber: function(currency)
		{
			var value = isNaN(currency) ? 0 : currency;
			if(!value)
			{
				currency = String(currency);
				var isNegative = currency.indexOf("(") != -1;
				currency = currency.replace("$", "");
				currency = currency.replace(/[(),]/g, "");
				if(!isNaN(currency)){
					value = Number(currency);
				}
				
				if(isNegative){
					value *= -1;
				}
			}
			return value;
		},
		
		/**
		 * convert a number to a currency string with $ symbol prefix, thousand place separaters and precision to two decimal places
		 * @param number, Number
		 * @return currency, string
		 */
		_convertNumberToCurrency: function(number)
		{
			if(isNaN(number)){
				return "$0.00";
			}
			
			//round off the number to max two decimal places
			number = Math.round(number * 100) / 100;
			var decimals = number - Math.floor(number);
			number = Math.floor(number);
				
			var isNegative = number < 0;
			var currency = "$" + String(number).replace(/\-/g, "").split("").reverse().join("").replace(/(.{3}\B)/g, "$1,").split("").reverse().join("");
			
			if(decimals > 0){
				var temp = String(Math.round(decimals * 100));
				currency += "." + (temp.length == 1 ? "0" : "") + temp;
			}
			
			if(currency.indexOf(".") == -1) {
				currency += ".00";
			}
			
			if(isNegative){
				currency = "(" + currency + ")";
			}
			
			return currency;
		},
		
		/**
		 * display the value in the specified element
		 * @param element, DOM element
		 * @param value, string
		 */
		_displayValue: function(element, value)
		{
			var isFormElement = this._isFormElement(element);
			isFormElement ? $(element).val(value) : $(element).html(value);
		},
		
		/**
		 * returns if the element is a form element
		 * @param element, DOM element
		 * @return isFormElement, boolean
		 */
		_isFormElement: function(element)
		{
			var isFormElement = false;
			for(var i in this.FORM_ELEMENTS) {
				if( $(element).is(this.FORM_ELEMENTS[i]) ) {
					isFormElement = true;
					break;
				}
			}
			return isFormElement;
		},
    	
    	/**
    	 * change the defaults for the plugin
    	 * any message created prior to this call retains the original default options
    	 * @param newDefaults, object
    	 */
    	setDefaults: function(newDefaults)
    	{
    		var defaults = $.extend({}, $.fn.numanimate.options, newDefaults);
    		$.fn.numanimate.options = defaults;
    	}
		
    }
    
});






