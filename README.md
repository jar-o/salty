SaltyMessenger
==============

This is a sample app that can be used as a template. It demonstrates a simplified way to create a Chrome Native Client app that uses the `PostMessage()` interface to communicate between Javascript and your native module.


## What it is

Basically, the way to communicate between your C++ code and Javascript in the browser is via the [Messaging System](http://src.chromium.org/viewvc/chrome/trunk/src/ppapi/c/ppb_messaging.h?revision=92312&view=markup). The old ways are [deprecated](https://code.google.com/p/ppapi/wiki/InterfacingWithJavaScript).

This repo is a small sample app based on the `pepper_41/getting_started/part2` source, which is a "hello world" of the Messaging System. I've added a Javascript library `salty.js` and a C++ header `salty.h` that simplify the mechanism for using the `PostMessage()` interface.

## How to use it

This sample requires `common.js` from the `getting_started/part2/` sources (it's included already for convenience). The `common.js` library handles all the generic tasks of loading the Native Client module appropriately. You use `salty.js` to simplify usage of your module once it's loaded.

In your HTML file (i.e. `index.html`), include the Javascript files in the following order:

    ...
    <script type="text/javascript" src="common.js"></script>
    <script type="text/javascript" src="salty.js"></script>
    <script type="text/javascript" src="example.js"></script>
    ...

In the above, `example.js` is where you put the code for your module.

Then, in the `<body>` tag, you setup your module using the custom `<data-...>` tags as below:

    ...
    <body data-name="salty" data-tools="pnacl newlib glibc" data-configs="Debug Release" data-path="{tc}/{config}">
    ...

(The only tag you're likely to change above is `<data-name>`. These attributes are used by `common.js`, btw.)

In `example.js` you do something like the following

    var naclhandler = SaltyMessenger;

    naclhandler.initAndHideModule( // This initializer hides the NaCL module from user's view
        function() {
            console.log('Initialized');
            doMyStuff();
        }
    );

    function doMyStuff() {

        naclhandler.post(

            // Post any message to your module using a JS object as parameter ...
            {
                directive: 'strlen',
                string: "Call me Jonah. My parents did, or nearly did. They called me John."
            },

            // ... and handle the reply with a callback.
            function(message) {
                console.log('test3: ' + message.data.strlen);
            }
        );
    }

### C++ side of things

None of the above really works however, unless you've built your C++ module to be _SaltyMessenger_-aware. For this you include the `salty.h` header in your `Instance` source. See `example.cc`.

Basically, it looks something like the following:

    #include "ppapi/cpp/instance.h"
    #include "ppapi/cpp/module.h"
    #include "ppapi/cpp/var.h"
    #include "ppapi/cpp/var_dictionary.h"
    #include "salty.h" // Depends on the above includes

    using namespace std;

    class ExampleInstance : public pp::Instance {
    private:
        // Used to "round-trip" the SaltyMessageId so salty.js can correlate calls
        SaltyReply reply;

    public:
        explicit ExampleInstance(PP_Instance instance) : pp::Instance(instance) {}
        virtual ~ExampleInstance() {}


        virtual void HandleMessage(const pp::Var& var_message) {

            pp::VarDictionary var_dict(var_message);

            reply.setId(var_dict); // Capture the SaltyMessageId first
            

            // ... do your handling here ...

            
            // Use the SaltyReply object to return an object back to your Javascript
            reply.Set(pp::Var("someKeyFromYourLogic"), pp::Var("some value."));
            PostMessage(reply);
            return;

        } // HandleMessage
            
    ...

The `SaltyReply` object is just a `pp::VarDictionary` with and additional method, `setId()`. It obtains the callback identifier generated in `salty.js` and ensures that when you `PostMessage(reply)` the correct JavaScript callback will be called.

## Running the code

Once you've followed Google's instructions for setting up Native Client, you should try and get the `getting_started/` samples working. Once you have them, checkout this repository into the `pepper_$(VERSION)/getting_started/` folder. You should end up with this repo located here:

    pepper_$(VERSION)/getting_started/salty/

From a command-line change directory into `salty/` above, and do `make serve`. If nothing breaks, you should be able to browse to `http://localhost:5103` (or whatever the port is from the other samples) and run the code.
