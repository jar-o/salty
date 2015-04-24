/*
    Copyright (c) 2015, James Robson. All rights reserved.  Use of this source
    code is governed by a BSD-style license that can be found in the LICENSE
    file accompanying the Chromium source.

    Note, to be used in conjuction with common.js from the nacl_sdk source. See
    getting_started/part2/ for details.

*/
var SALTY_ID = "SaltyMessageId"; // Must match salty.h

var SaltyMessenger = (function() {

    callbackMap = {};
    callbackIndex = 0;

    function handleMessage_(message) {
        if (typeof message.data[SALTY_ID] === 'undefined' ||
            typeof callbackMap[message.data[SALTY_ID]] !== 'function') {
            console.log('No callback defined', message);        
        }
        else
        {
            callbackMap[message.data[SALTY_ID]](message);
        }
    }

    function init_(settings) {

        // After the NaCl module has loaded, common.naclModule is a reference to the
        // NaCl module's <embed> element.
        //
        // postMessage sends a message to it.

        window.handleMessage = handleMessage_;

        window.moduleDidLoad = function() {

            if ('hidemodule' in settings) common.hideModule();

            if (typeof settings.callback === 'function') {
                settings.callback();
            }
            else {
                console.log('SaltyMessenger default: nacl module loaded'); 
            }
        } // moduleDidLoad

    } // init_



    // Public interfaces
    return {
        initAndHideModule: function(callback) {
            init_({hidemodule:true, callback: callback});
        }, // initAndHideModule

        initModule: function(callback) {
            init_({callback: callback});
        }, // initModule

        resetIndex: function() { callbackIndex = 0; },

        post: function(message, callback, userindex) { //Invoke the module postmessage
            // This must make the round-trip through the post/receive message
            // logic in C++ code
            
            var i;
            if (typeof userindex !== 'undefined') {
                i = userindex;
            }
            else {
                i = callbackIndex;
                callbackIndex++;
            }

            message[SALTY_ID] = i;
            callbackMap[message[SALTY_ID]] = callback;
            common.naclModule.postMessage(message);
        }

    }; // return
    
})(); // SaltyMessenger
