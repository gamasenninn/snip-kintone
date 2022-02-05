jQuery.noConflict();
(function($) {
    "use strict";
    kintone.events.on(["app.record.create.show", "app.record.edit.show"], function(e) {
         // 集計シートにボタンを作成する
        // 追加ボタンを設置
        const addSpace = kintone.app.record.getSpaceElement('cmdBtn');
        const addButton =  document.createElement('button');
        addButton.innerHTML = 'テスト用';
        addButton.onclick = getData;   //クリックイベントを登録する。ボタンが押されたら、集計処理＆コピー
        addSpace.appendChild(addButton);

    });
})(jQuery);


async function getData(){

    //現在レコードを取得
    let curRec = kintone.app.record.get();
    //指定された「日付」から前月スタート日、エンド日を取得
    //console.log (moment('2021/11/1').subtract(1,'month').format('YYYY/MM/DD'))
    let startDay = moment(curRec.record.日付.value).add(-1,'month').startOf('month').format("YYYY-MM-DD")
    let endDay = moment(curRec.record.日付.value).add(-1,'month').endOf('month').format("YYYY-MM-DD")
    console.log(startDay,endDay)

    let iName = curRec.record.名前.value
    let prefix = copyKeys[iName];
    
    //コピー用データの準備（Baseデータに苗字頭を付加する） 
    
    copyTo = {};
    
    //コピー用データの準備（Baseデータに苗字頭を付加する）
    for (let [key, value] of Object.entries(copyToBase)) {
    //console.log('key:' + key + ' value:' + value);
        copyTo[key] = {}
        for (let [key2, value2] of Object.entries(value)) {
            //console.log('key:' + key + ' value:' + value2);
            let ck = prefix + key2
            copyTo[key][ck] = value2
        }
    }
    console.log(copyTo)

    
    //数量・価格などの合計取得・反映
    sumSheet(156,`日付 >= "${startDay}" and 日付 <= "${endDay}"`,function(sumList){
        //console.log("sumList",sumList)
        //当年数量合計反映
        for(let [k,v] of Object.entries(copyTo['当年数量'])){
           // console.log(k,v,sumList[k])
            try{
                curRec.record[v].value = sumList[k]
            }catch (e){
                console.log(e)
            }
        }
        //当年金額合計反映
        for(let [k,v] of Object.entries(copyTo['当年金額'])){
            //console.log(k,v,sumList[k])
            try{
                curRec.record[v].value = sumList[k]
            }catch (e){
                console.log(e)
            }
        }
        kintone.app.record.set(curRec);
        
    })
    // 控除取得・反映
    sumSheet(154,`日付_0 >= "${startDay}" and 日付_0 <= "${endDay}"`,function(sumList){
        console.log("sumList",sumList)
        for(let [k,v] of Object.entries(copyTo['控除手数料'])){
            //console.log(k,v,sumList[k])
            try{
                curRec.record[v].value = sumList[k]
            }catch (e){
                console.log(e)
            }
        }
        kintone.app.record.set(curRec);
    })
    //運賃取得・反映
    sumSheet(162,`日付 >= "${startDay}" and 日付 <= "${endDay}"`,function(sumList){
        console.log("sumList",sumList)
        for(let [k,v] of Object.entries(copyTo['運賃'])){
            //console.log(k,v,sumList[k])
            try{
                curRec.record[v].value = sumList[k]
            }catch (e){
                console.log(e)
            }
        }
        kintone.app.record.set(curRec);
    })

    
}

//----------集計ロジック -----------
function sumSheet(id,query,callback){
    let amountList = {};
    console.log("query:",query)
    //let id = sid;
    kintone.api(
        kintone.api.url('/k/v1/records/cursor',true),　
            'POST',{
                app: id,   //コピー元シートの番号
                query:  query, //条件指定
                //id: 1,
            },
            function(res){
                //console.log("get record/cursor");
                //カーソルからデータを取得
                kintone.api(kintone.api.url('/k/v1/records/cursor',true),
                    'GET',{
                        id: res.id,
                    },
                    function(res){
                        //一行目のレコードからkeyリストを作成する。
                        items = Object.keys(res.records[0]);
                        //console.log(items)
                        //キーごとに集計する。
                        for( let item of items){
                            let total = res.records.reduce((p, x) => p + Number(x[item].value) , 0);
                            amountList[item] = total
                        }
                        callback(amountList);
                    }
                )
    
            }
    );
}

//-------- 変換辞書　------------
let copyKeys ={
    "AAAAA": "AA",
    "BBBBB": "BB",
    "CCCCC": "CC",
    "DDDDD": "DD",
    "EEEEE": "EE",
    "FFFFF": "FF",
    "GGGGG": "GG"
}

let copyTo = {};

let copyToBase ={
        "当年数量":{
                "数量FGA":"当年荷受数量FGA",
                "数量FG":"荷受数量FG",
                "数量AL":"荷受数量LA",
                "数量L":"荷受数量L",
                "数量A":"荷受数量A",
                "数量2L":"荷受数量2L",
                "数量エムズ":"荷受数量M",
        },
        "当年金額":{  
                "販売価格FGA":"金額FGA",
                "販売価格FG":"金額FG",
                "販売価格AL":"金額AL",
                "販売価格L":"金額L",
                "販売価格A":"金額A",
                "販売価格2L":"金額2L",
                "販売価格エムズ":"金額M",
        },
        "前年数量":{
                "数量FGA":"前年荷受数量FGA",
                "数量FG":"前年荷受数量FG",
                "数量AL":"前年荷受数量AL",
                "数量L":"前年荷受数量L",
                "数量A":"前年荷受数量A",
                "数量2L":"前年荷受数量2L",
                "数量エムズ":"前年荷受数量M",
        },
        "前年金額":{  
                "販売価格FGA":"前年金額FGA",
                "販売価格FG":"前年金額FG",
                "販売価格AL":"前年金額AL",
                "販売価格L":"前年金額L",
                "販売価格A":"前年金額A",
                "販売価格2L":"前年金額2A",
                "販売価格エムズ":"前年金額M",
        },
        "控除手数料":{  
                "市場控除": "税込控除市場手数料",
                "系統控除":"税込控除系統手数料",
                "全農宣伝控除": "税込控除全農宣伝手数料",
                "JA控除": "税込控除JA手数料",
        },
        "運賃":{  
                "運賃合計":"税込控除運賃",
        }
        
        
}
