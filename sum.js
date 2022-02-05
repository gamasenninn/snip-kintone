/*

別シートから項目を集計し、任意の項目に反映させる。
辞書配列copyTo に　{集計元:集計先,.....}　として指定する。
このサンプルでは前月分を集計している。


*/
//-----------本体ロジック---------
(function() {

    "use strict";

      kintone.events.on(["app.record.create.show", "app.record.edit.show"], function(e) {
          
        // 集計シートにボタンを作成する
        // 追加ボタンを設置
          const addSpace = kintone.app.record.getSpaceElement('btnSP');
          const addButton =  document.createElement('button');
          addButton.innerHTML = '前月分集計ボタン';
          addButton.onclick = lastMonthTotal;   //クリックイベントを登録する。ボタンが押されたら、集計処理＆コピー
          addSpace.appendChild(addButton);
      });
})();


function lastMonthTotal(){
    kintone.api(
        //コピー元シートのカーソルを作成。条件指定
        kintone.api.url('/k/v1/records/cursor',true),　
        'POST',{
            app: 156,   //コピー元シートの番号
            query: "日付=LAST_MONTH()", //条件指定
            //id: 1,
        },
        function(res){
            //カーソルのレコードを読み込む
            let curRec = kintone.app.record.get();
            //console.log(res);
            kintone.api(kintone.api.url('/k/v1/records/cursor',true),
                'GET',{
                    id: res.id,
                },
                function(res){
                    items = Object.keys(res.records[0]);　//　項目名のリスト作成
                    let jlist = {};
                    let tolist = {};
                    for( let item of items){
                        let total = res.records.reduce((p, x) => p + Number(x[item].value) , 0);　//同項目の数値を集計する
                        if ( item.indexOf('数量') != -1) {
                            //console.log(item,":", total);
                            jlist[item] = total;
                            if(copyTo[item]){
                                tolist[copyTo[item]] = total;
                                console.log(copyTo[item])
                                curRec.record[copyTo[item]].value = total;　//
                            }
                        }
                    }
                    //console.log(tolist);
                    //alert(JSON.stringify(jlist));
                    alert(JSON.stringify(tolist));
                    kintone.app.record.set(curRec);
                }
            )

        }
    )
}

//--------- 設定データ ---------

let copyTo ={
    
  "コピー元項目1":"コピー先項目1",
  "コピー元項目2":"コピー先項目2",
  "コピー元項目3":"コピー先項目3",
  "コピー元項目4":"コピー先項目4",
  "コピー元項目5":"コピー先項目5",
  "コピー元項目6":"コピー先項目6",
  "コピー元項目7":"コピー先項目7",
}



