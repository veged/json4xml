(function(){
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

    function isArray(o) { return Object.prototype.toString.call(o) === "[object Array]" };

    function isElement(o) {
        return isArray(o) &&
            (o.length == 2 || o.length == 3) &&
            (typeof o[0] === 'string');
    };

    function isElementsArray(o) {
        if (!isArray(o)) return false;
        var result = true;
        for (var i = 0, l = o.length; i < l; i++) result = isElement(o[i]);
        return result;
    };

    function isNonameElement(o) {
        return isArray(o) &&
            (o.length && o.length <= 2);
    };

    function isNonameElementsArray(o) {
        if (!isArray(o)) return false;
        var result = true;
        for (var i = 0, l = o.length; i < l; i++) result = isNonameElement(o[i]);
        return result;
    };

    function isElementsHash(o) {
        if (isArray(o) || isSimple(o)) return false;

        var result = true;

        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                var v = o[i];
                result = isSimple(v) ||
                    isNonameElement(v) ||
                    isElement(v) ||
                    isNonameElementsArray(v) ||
                    isElementsArray(v) ||
                    isElementsHash(v);
                if (!result) break;
            }
        }
        return result;
    };

    function json4xml(o) {
        var r = [];
        if (isSimple(o)) {
            r.push(xmlEscape(o));
        } else if (isElement(o)) {
            if (o[0]) {
                r.push('<', o[0]);
                if (o.length == 3) {
                    var a = o[1];
                    for (var n in a)
                        if (a.hasOwnProperty(n)) r.push(' ', n, '="', xmlEscape(a[n]), '"');
                }
                r.push('>');
            }
            r.push(json4xml(o[2] || o[1]));
            if (o[0]) r.push('</', o[0], '>');
        } else if (isElementsArray(o)) {
            for (var i = 0, l = o.length; i < l; i++) r.push(json4xml(o[i]));
        } else if (isElementsHash(o)) {
            for (var k in o) {
                if (o.hasOwnProperty(k)) {
                    var v = o[k];
                    if (isSimple(v) || isElement(v) || isElementsArray(v) || isElementsHash(v)) {
                        if (k) r.push('<', k, '>');
                        r.push(json4xml(v));
                        if (k) r.push('</', k, '>');
                    } else {
                        if (!isArray(v[0])) v = [v];
                        for (var i = 0, l = v.length; i < l; i++)
                            r.push(json4xml([
                                k,
                                v[i].length == 2 ? v[i][0] : {},
                                v[i][1] || v[i][0] || ''
                            ]));
                    }
                }
            };
        }
        return r.join('');
    };

    var window = this;
    return window.json4xml = json4xml;
})();
