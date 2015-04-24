/*
    Copyright (c) 2015, James Robson. All rights reserved.  Use of this source
    code is governed by a BSD-style license that can be found in the LICENSE
    file accompanying the Chromium source.

*/

#include "ppapi/cpp/instance.h"
#include "ppapi/cpp/module.h"
#include "ppapi/cpp/var.h"
#include "ppapi/cpp/var_dictionary.h"
#include "salty.h" // Depends on the above

using namespace std;

class ExampleInstance : public pp::Instance {
private:
    // Used to "round-trip" the SaltyMessageId so salty.js can correlate calls
    SaltyReply reply;

public:
    explicit ExampleInstance(PP_Instance instance) : pp::Instance(instance) {}
    virtual ~ExampleInstance() {}

    // The handler:
    virtual void HandleMessage(const pp::Var& var_message) {

        pp::VarDictionary var_dict(var_message);

        reply.setId(var_dict); // Capture the SaltyMessageId first

        string directive = var_dict.Get("directive").AsString();

        // test1
        if (directive.compare("helowrld") == 0) {

            string salutation = var_dict.Get("salutation").AsString();
            if (salutation.compare("helo") == 0) {
                reply.Set(pp::Var("answer"), pp::Var("wrld"));
            }
            else {
                reply.Set(pp::Var("answer"),
                    pp::Var("Didn't understand salutation."));
            }
            PostMessage(reply);
            return;

        }

        

        // test2
        if (directive.compare("add10") == 0) {
            int v = var_dict.Get("value").AsInt();
            v += 10;
            reply.Set(pp::Var("sum"), pp::Var(v));
            PostMessage(reply);
            return;
        }


        // test3
        if (directive.compare("strlen") == 0) {
            string s = var_dict.Get("string").AsString();
            reply.Set(pp::Var("strlen"), pp::Var((int)s.size()));
            PostMessage(reply);
            return;
        }


        // test4
        if (directive.compare("replace") == 0) {
            string s = var_dict.Get("string").AsString();
            s = s.replace(s.size()-4, strlen(" sandwich"), " sandwich");

            reply.Set(pp::Var("string"), pp::Var(s));
            PostMessage(reply);
            return;
        }



    } // HandleMessage

};

class ExampleModule : public pp::Module {
public:
    ExampleModule() : pp::Module() {}
    virtual ~ExampleModule() {}

    virtual pp::Instance* CreateInstance(PP_Instance instance) {
        return new ExampleInstance(instance);
    }
};

namespace pp {

Module* CreateModule() {
    return new ExampleModule();
}

}  // namespace pp
