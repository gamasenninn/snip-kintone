/*
    Object key changing sample
    - Not Kintone. 

    $ node keyChange.js

*/

//--- easy sample --
baseKeyPrice={
    priceA: 123,
    priceB: 456,
    priceC: 789,
    priceD: 912,
};

keyPrice = {};
prefix = "add_";

for (let [k, v] of Object.entries(baseKeyPrice)) {
    keyPrice[prefix+k] = v
}
console.log(keyPrice)


//--- Nested sample --
baseKeyPrice={
    priceA: { 
        item01A: 111,
        item02A: 222,
        item03A: 333,
        item04A: 444,
    },
    priceB: { 
        item01B: 111,
        item02B: 222,
        item03B: 333,
        item04B: 444,
    }
};

keyPrice = {};
prefix = "add_";
// first key
for (let [k, v] of Object.entries(baseKeyPrice)) {
    ck = prefix+k
    keyPrice[ck] = v
}
console.log(keyPrice)


// second key
keyPrice = {};
prefix = "add_";
for (let [k, v] of Object.entries(baseKeyPrice)) {
    keyPrice[k] = {}
    for (let [k2, v2] of Object.entries(v)) {
        ck = prefix+k2
        keyPrice[k][ck] = v2
    }
}
console.log(keyPrice)

