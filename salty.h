/*
    Copyright (c) 2015, James Robson. All rights reserved.  Use of this source
    code is governed by a BSD-style license that can be found in the LICENSE
    file accompanying the Chromium source.

*/

#ifndef SALTY_H_
#define SALTY_H_

#define SALTY_ID "SaltyMessageId" // Must match salty.js
class SaltyReply : public pp::VarDictionary
{
public:
    void setId(const pp::Var& v)
    {
        pp::VarDictionary d(v);
        setId(d);
    }
    void setId(const pp::VarDictionary& d)
    {
        pp::Var k(SALTY_ID);
        this->Set(k, d.Get(SALTY_ID));
    }
};

#endif // SALTY_H_
