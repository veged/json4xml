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

    function isElementsArray(o) {
        var result = true;
        $.each(o, function(){ return result = isElement(this) });
        return isArray(o) && result;
    };

    function isElementsHash(o) {
        var result = true;
        $.each(o, function(k, v){
            return result = (isSimple(v) || (isArray(v) && v.length && v.length <= 2)  || isElement(v) || isElementsArray(v));
        });
        return !isArray(o) && !isSimple(o) && result;
    };

    function json4xml(o) {
        var r = [];
        if (isSimple(o)) {
            r.push(xmlEscape(o));
        } else if (isElement(o)) {
            if (o[0]) {
                r.push('<', o[0]);
                if (o.length == 3) $.each(o[1], function(n){ r.push(' ', n, '="', xmlEscape(this), '"') });
                r.push('>');
            }
            r.push(json4xml(o[2] || o[1]));
            if (o[0]) r.push('</', o[0], '>');
        } else if (isElementsArray(o)) {
            $.each(o, function(){ r.push(json4xml(this)) });
        } else if (isElementsHash(o)) {
            $.each(o, function(k, v){
                if (isSimple(v) || isElement(v) || isElementsArray(v)) {
                    if (k) r.push('<', k, '>');
                    r.push(json4xml(v));
                    if (k) r.push('</', k, '>');
                } else {
                    r.push(json4xml([k, v.length == 2 ? v[0] : {}, v[1] || v[0] || '']));
                }
            });
        }
        return r.join('');
    };

    $.json4xml = json4xml;

})(jQuery);
