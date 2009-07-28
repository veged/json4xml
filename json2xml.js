(function($){
    // == Элемент
    // Массив из 2-х или 3-х элементов. На первом месте строка с именем,
    // на втором (если всего 3 элемента) хеш атрибутов, на третьем (или на 2-м, если всего 2 элемента) значение.
    // Атрибуты -- необязательный элемент. Значение -- обязательный элемент.
    //
    // == Значение
    // Простой тип, элемент, хеш элементов или массив элементов.
    //
    // == Хеш элементов
    // В качестве ключа имя элемента или массива элементов,
    // в качестве значения соответсвенно элемент или массив элементов.
    // В случае когда ключ не совпадает с именем элемента считаем, что есть два вложенных элемента:
    // первый по имени ключа (без атрибутов), второй полностью соответствует элементу.
    // Используется когда неважен порядок элементов, элементы уникальные и нужен доступ по ключу.
    //
    // == Массив элементов
    // Отличается от элемента (который тоже массив) тем что на первой позиции у него массив,
    // в то время как у элемента -- строка.
    // Используется когда важен порядок элементов.
    //
    // == Примерчики
    var x1 = ['item', {attr1: '1', attr2: 'bla'}, 'text1'];
    var x2 = ['item', 'text2'];
    var x3 = [x1, x2];
    var x4 = ['items', {
        item1: ['item1', 'text1'],
        item2: ['item2', 'item2'],
        subitem: [
            ['subitem', {attr: true}, 'content1'],
            ['subitem', {attr: false}, 'content2']
        ]
    }];
    // ---

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


    // == Tests
    // isSimple
    console.log(isSimple(true) == true);
    console.log(isSimple(1) == true);
    console.log(isSimple('') == true);
    console.log(isSimple([]) == false);
    console.log(isSimple({}) == false);

    // isArray
    console.log(isArray([]) == true);
    console.log(isArray({}) == false);
    console.log(isArray('abc') == false);

    // isElement
    console.log(isElement(['item', {attr:'1'}, 'text1']) == true);
    console.log(isElement(['item', 'text1']) == true);
    console.log(isElement(['item', {subitem1: ['subitem1', 'text1'], subitem2: ['subitem2', 'text2']}]) == true);
    console.log(isElement(['item']) == false);

    // isElementsArray
    console.log(isElementsArray([['item', 'text1'], ['item', 'text2']]) == true);
    console.log(isElementsArray([['item', 'text1'], ['item'], ['item']]) == false);
    console.log(isElementsArray({subitem1: ['subitem1', 'text1'], subitem2: ['subitem2', 'text2']}) == false);

    // isElementsHash
    console.log(isElementsHash({subitem1: ['subitem1', 'text1'], subitem2: ['subitem2', 'text2']}) == true);
    console.log(isElementsHash({s: 'blabla', subitem1: ['subitem1', 'text1'], subitem2: ['subitem2', 'text2']}) == true);
    console.log(isElementsHash([['item', 'text1'], ['item', 'text2']]) == false);

    // == Interactive
    $(function(){
        var textarea = '<textarea style="display:block; width: 100%; height: 100px;"></textarea>',
            output = $(textarea).appendTo('body'),
            input = $(textarea).appendTo('body').change(function(){ output.val(json2xml(eval('(' + this.value + ')'))) });
    });
})(jQuery);
