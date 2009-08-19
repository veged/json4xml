var tests = [
    {
        'in': ['item', {attr: '1'}, 'text1'],
        'out': '<item attr="1">text1</item>'
    },
    {
        'in': ['item', {attr1: '1', attr2: '2'}, 'text1'],
        'out': '<item attr1="1" attr2="2">text1</item>'
    },
    {
        'in': ['', 'text'],
        'out': 'text'
    },
    {
        'in': ['item', ''],
        'out': '<item></item>'
    },
    {
        'in': {item1: 'text'},
        'out': '<item1>text</item1>'
    },
    {
        'in': {item1: [{attr: 'bla'}, 'text']},
        'out': '<item1 attr="bla">text</item1>'
    },
    {
        'in': {item1: [[{attr: '1'}, 'text'], [{attr: '2'}, 'text']]},
        'out': '<item1 attr="1">text</item1><item1 attr="2">text</item1>'
    },
    {
        'in': {item: ['subitem', 'text']},
        'out': '<item><subitem>text</subitem></item>'
    },
    {
        'in': {item: [['subitem1', 'text1'], ['subitem2', 'text2']]},
        'out': '<item><subitem1>text1</subitem1><subitem2>text2</subitem2></item>'
    },
    {
        'in': ['item', {subitem1: 'text1', subitem2: 'text2'}],
        'out': '<item><subitem1>text1</subitem1><subitem2>text2</subitem2></item>'
    },
    {
        'in': ['item', {subitem: {subsubitem: 'text'}}],
        'out': '<item><subitem><subsubitem>text</subsubitem></subitem></item>'
    },
    {
        'in': [['subitem1', 'text1'], ['subitem2', 'text2']],
        'out': '<subitem1>text1</subitem1><subitem2>text2</subitem2>'
    },
    {
        'in': ['items', {
           item1: 'text1',
           item2: [{attr: 1}, 'text2'],
           item3: ['text3'],
           item4: [],
           subitems: [
              ['subitem', {attr: true}, 'content1'],
              ['subitem', {attr: false}, 'content2']
           ],
           elem: ['subelem', {attr:true}, 'subtext']
        }],
        'out': '<items>' +
                '<item1>text1</item1>' +
                '<item2 attr="1">text2</item2>' +
                '<item3>text3</item3>' +
                '<item4></item4>' +
                '<subitems>' +
                    '<subitem attr="true">content1</subitem>' +
                    '<subitem attr="false">content2</subitem>' +
                '</subitems>' +
                '<elem>' +
                    '<subelem attr="true">subtext</subelem>' +
                '</elem>' +
            '</items>'
    }
];

var times = [(new Date()).getTime()],
    totalFail = 0;
for (var i = 0; i < tests.length; i++) {
    var test = tests[i];

    test.res = json4xml(test['in']);
    var isOk = test.res == test.out;

    console.log('Test in:', test['in'], (isOk ? 'OK' : 'FAIL'));
    console.log('Test result:', test.res);
    if (!isOk) {
        totalFail++;
        console.log('Test out:', test.out);
    }
    times.push((new Date()).getTime() - times[0]);
}
console.log(totalFail ? 'Total FAIL: ' + totalFail : 'All OK');
times.shift();
console.log('Times:', times);

