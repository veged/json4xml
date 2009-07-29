(function($){

    function xmlEscape(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\'/g, '&apos;')
            .replace(/"/g, '&quot;');
    };

    function isSimple(o) {
        return typeof o === 'boolean' ||
            typeof o === 'number' ||
            typeof o === 'string';
    };

    var isArray = $.isArray || function(o) { return toString.call(obj) === "[object Array]" };

    function isElement(o) {
        return isArray(o) &&
            (o.length == 2 || o.length == 3) &&
            (typeof o[0] === 'string');
    };

    function isSameElements(o) {
        var result = true;
        $.each(o, function(){ return result = (isElement(this) && this[0] == o[0][0]) });
        return result;
    };

    function isElementsArray(o) {
        var result = true;
        $.each(o, function(){ return result = isElement(this) });
        return isArray(o) && result;
    };

    function isElementsHash(o) {
        var result = true;
        $.each(o, function(k, v){
            return result = (isSimple(v) || isElement(v) || isElementsArray(v));
        });
        return !isArray(o) && !isSimple(o) && result;
    };

    function json2xml(o) {
        var r = [];
        if (isSimple(o)) {
            r.push(xmlEscape(o));
        } else if (isElement(o)) {
            if (o[0]) {
                r.push('<', o[0]);
                if (o.length == 3) $.each(o[1], function(n){ r.push(' ', n, '="', xmlEscape(this), '"') });
                r.push('>');
            }
            r.push(json2xml(o[2] || o[1]));
            if (o[0]) r.push('</', o[0], '>');
        } else if (isElementsArray(o)) {
            $.each(o, function(){ r.push(json2xml(this)) });
        } else if (isElementsHash(o)) {
            $.each(o, function(k, v){
                var same, element,
                    needLevel = k && (isSimple(v) ||
                        ((element = isElement(v)) && k != v[0]) ||
                        ((same = isSameElements(v)) && k != v[0][0]) ||
                        (!element && !same));
                if (needLevel) r.push('<', k, '>');
                r.push(json2xml(v));
                if (needLevel) r.push('</', k, '>');
            });
        }
        return r.join('');
    };

    $.json2xml = json2xml;

})(jQuery);
