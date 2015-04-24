function logit(m){
  var logEl = document.getElementById('log');
  logEl.innerHTML += '<div>' + m + '</div>';
}

var naclhandler = SaltyMessenger;

naclhandler.initAndHideModule( function() { logit('Initialized'); doTests(); } );

function doTests() {
    test1();
    test2();
    test3();
    test4();
}

function test1(callback) {
    naclhandler.post(
        {
            directive: 'helowrld',
            salutation: 'helo'
        },
        function(message) {
            logit('test1: ' + message.data.answer);
        });
} // test1()

function test2(callback) {
    naclhandler.post(
        {
            directive: 'add10',
            value: 10
        },
        function(message) {
            logit('test2: ' + message.data.sum);
        });
} // test2()

function test3(callback) {
    naclhandler.post(
        {
            directive: 'strlen',
            string: "Call me Jonah. My parents did, or nearly did. They called me John."
        },
        function(message) {
            logit('test3: ' + message.data.strlen);
        });
} // test3()


function test4(callback) {
    naclhandler.post(
        {
            directive: 'replace',
            string: "knucklehead"
        },
        function(message) {
            logit('test4: ' + message.data.string);
        });
} // test4()
