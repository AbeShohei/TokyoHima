
export const STATION_SPOTS = {
    "銀座": [
        { name: "銀座三越", time: "2時間", description: "銀座のランドマーク的デパート。", minutes: 1, coords: [35.6716, 139.7656] },
        { name: "歌舞伎座", time: "1時間", description: "日本の伝統芸能、歌舞伎の殿堂。", minutes: 5, coords: [35.6695, 139.7679] },
        { name: "銀座シックス", time: "2時間", description: "ラグジュアリーな複合商業施設。", minutes: 3, coords: [35.6696, 139.7640] }
    ],
    "東京": [
        { name: "東京駅丸の内駅舎", time: "30分", description: "辰野金吾設計の赤レンガ駅舎。", minutes: 1, coords: [35.6812, 139.7671] },
        { name: "皇居外苑", time: "1.5時間", description: "都会のオアシス。散歩に最適。", minutes: 10, coords: [35.6803, 139.7583] },
        { name: "KITTE丸の内", time: "1.5時間", description: "旧東京中央郵便局を活用した商業施設。", minutes: 2, coords: [35.6796, 139.7649] }
    ],
    "新宿": [
        { name: "新宿御苑", time: "2時間", description: "四季折々の自然が楽しめる広大な庭園。", minutes: 10, coords: [35.6852, 139.7101] },
        { name: "東京都庁展望室", time: "1時間", description: "東京の街を一望できる無料展望台。", minutes: 12, coords: [35.6896, 139.6917] },
        { name: "思い出横丁", time: "1.5時間", description: "昭和レトロな飲み屋街。", minutes: 3, coords: [35.6931, 139.6996] }
    ],
    "渋谷": [
        { name: "渋谷スクランブル交差点", time: "15分", description: "世界的に有名な交差点。", minutes: 1, coords: [35.6595, 139.7004] },
        { name: "SHIBUYA SKY", time: "1.5時間", description: "渋谷最高峰のパノラマビュー。", minutes: 0, coords: [35.6585, 139.7013] },
        { name: "MIYASHITA PARK", time: "1時間", description: "公園・商業・ホテルが一体となった施設。", minutes: 3, coords: [35.6622, 139.7024] }
    ],
    "池袋": [
        { name: "サンシャイン60展望台", time: "1.5時間", description: "「てんぼうパーク」としてリニューアル。", minutes: 10, coords: [35.7289, 139.7197] },
        { name: "南池袋公園", time: "1時間", description: "芝生が気持ちいい都会の公園。", minutes: 5, coords: [35.7266, 139.7153] }
    ],
    "上野": [
        { name: "上野恩賜公園", time: "1時間", description: "美術館や博物館が集まる文化の森。", minutes: 2, coords: [35.7141, 139.7741] },
        { name: "上野動物園", time: "3時間", description: "パンダで有名な日本最古の動物園。", minutes: 5, coords: [35.7166, 139.7713] },
        { name: "アメ横商店街", time: "1.5時間", description: "活気あふれる商店街。", minutes: 3, coords: [35.7099, 139.7745] }
    ],
    "浅草": [
        { name: "浅草寺・雷門", time: "2時間", description: "東京最古の寺院。", minutes: 5, coords: [35.7111, 139.7963] },
        { name: "仲見世通り", time: "1時間", description: "日本最古の商店街の一つ。", minutes: 5, coords: [35.7115, 139.7964] },
        { name: "東京スカイツリー", time: "2.5時間", description: "隅田川を越えて徒歩圏内。", minutes: 20, coords: [35.7100, 139.8107] }
    ],
    "表参道": [
        { name: "表参道ヒルズ", time: "1.5時間", description: "最先端のトレンド発信地。", minutes: 2, coords: [35.6672, 139.7090] },
        { name: "根津美術館", time: "1.5時間", description: "日本・東洋の古美術と見事な庭園。", minutes: 8, coords: [35.6631, 139.7180] }
    ],
    "六本木": [
        { name: "六本木ヒルズ", time: "2.5時間", description: "展望台、美術館、映画館がある複合施設。", minutes: 0, coords: [35.6604, 139.7292] },
        { name: "東京ミッドタウン", time: "2時間", description: "デザインとアート、緑が融合した街。", minutes: 5, coords: [35.6657, 139.7309] }
    ],
    "赤坂見附": [
        { name: "豊川稲荷東京別院", time: "30分", description: "芸能人も訪れるパワースポット。", minutes: 5, coords: [35.6763, 139.7329] }
    ],
    "日本橋": [
        { name: "日本橋", time: "15分", description: "日本の道路の起点。", minutes: 1, coords: [35.6836, 139.7743] },
        { name: "COREDO室町", time: "2時間", description: "日本の「和」を感じる商業施設。", minutes: 3, coords: [35.6865, 139.7745] }
    ],
    "大手町": [
        { name: "皇居東御苑", time: "1.5時間", description: "旧江戸城の本丸・二の丸・三の丸跡。", minutes: 5, coords: [35.6869, 139.7565] }
    ],
    "後楽園": [
        { name: "東京ドームシティ", time: "3時間", description: "スパ、アトラクション、ショッピング。", minutes: 2, coords: [35.7051, 139.7519] },
        { name: "小石川後楽園", time: "1時間", description: "水戸黄門ゆかりの大名庭園。", minutes: 5, coords: [35.7053, 139.7495] }
    ],
    "飯田橋": [
        { name: "東京大神宮", time: "45分", description: "東京のお伊勢さま。縁結びで有名。", minutes: 5, coords: [35.6998, 139.7460] },
        { name: "神楽坂", time: "2時間", description: "路地裏散策が楽しい粋な街。", minutes: 1, coords: [35.7011, 139.7408] }
    ],
    "九段下": [
        { name: "日本武道館", time: "30分", description: "武道と音楽の聖地。", minutes: 5, coords: [35.6933, 139.7498] },
        { name: "千鳥ヶ淵", time: "45分", description: "桜の名所として有名なお堀。", minutes: 5, coords: [35.6917, 139.7483] }
    ],
    "神保町": [
        { name: "神保町古書店街", time: "2時間", description: "世界最大級の古書店街。", minutes: 1, coords: [35.6955, 139.7573] }
    ],
    "秋葉原": [
        { name: "電気街", time: "2時間", description: "アニメ、ゲーム、電子部品の聖地。", minutes: 2, coords: [35.6983, 139.7731] }
    ],
    "築地": [
        { name: "築地場外市場", time: "2時間", description: "新鮮な海産物と活気ある市場。", minutes: 3, coords: [35.6655, 139.7707] },
        { name: "築地本願寺", time: "30分", description: "古代インド様式の独特な外観。", minutes: 1, coords: [35.6672, 139.7723] }
    ],
    "月島": [
        { name: "月島もんじゃストリート", time: "1.5時間", description: "もんじゃ焼き店が軒を連ねる。", minutes: 1, coords: [35.6635, 139.7816] }
    ],
    "豊洲": [
        { name: "ららぽーと豊洲", time: "2.5時間", description: "海沿いのロケーション抜群なSC。", minutes: 2, coords: [35.6562, 139.7915] },
        { name: "チームラボプラネッツ", time: "2時間", description: "水に入るミュージアム。", minutes: 10, coords: [35.6457, 139.7910] }
    ],
    "清澄白河": [
        { name: "東京都現代美術館(MOT)", time: "2.5時間", description: "現代アートの拠点。", minutes: 10, coords: [35.6811, 139.8080] },
        { name: "清澄庭園", time: "1時間", description: "明治の代表的な「回遊式林泉庭園」。", minutes: 3, coords: [35.6806, 139.7997] },
        { name: "カフェ巡り", time: "1.5時間", description: "「コーヒーの街」として有名。", minutes: 0, coords: [35.6830, 139.8000] }
    ],
    "門前仲町": [
        { name: "富岡八幡宮", time: "45分", description: "江戸最大の八幡様。", minutes: 3, coords: [35.6719, 139.7996] },
        { name: "深川不動堂", time: "30分", description: "護摩祈祷が迫力満点。", minutes: 2, coords: [35.6726, 139.7978] }
    ],
    "永田町": [
        { name: "国会議事堂", time: "1時間", description: "日本の政治の中心。", minutes: 5, coords: [35.6759, 139.7448] }
    ],
    "赤坂": [
        { name: "赤坂サカス", time: "1.5時間", description: "TBS放送センターを中心とした複合施設。", minutes: 0, coords: [35.6738, 139.7356] }
    ],
    "乃木坂": [
        { name: "国立新美術館", time: "2時間", description: "国内最大級の展示スペース。", minutes: 0, coords: [35.6653, 139.7263] }
    ],
    "明治神宮前〈原宿〉": [
        { name: "明治神宮", time: "1.5時間", description: "広大な鎮守の杜。", minutes: 1, coords: [35.6764, 139.6993] },
        { name: "竹下通り", time: "1時間", description: "カワイイ文化の発信地。", minutes: 2, coords: [35.6712, 139.7042] }
    ],
    "代々木公園": [
        { name: "代々木公園", time: "1.5時間", description: "都心で一番広い空が見える公園。", minutes: 3, coords: [35.6717, 139.6949] }
    ],
    "麻布十番": [
        { name: "麻布十番商店街", time: "1.5時間", description: "老舗と新店が混在するグルメな商店街。", minutes: 1, coords: [35.6558, 139.7353] }
    ],
    "広尾": [
        { name: "有栖川宮記念公園", time: "1時間", description: "起伏に富んだ緑豊かな公園。", minutes: 3, coords: [35.6521, 139.7237] }
    ],
    "恵比寿": [
        { name: "恵比寿ガーデンプレイス", time: "2時間", description: "大人の雰囲気漂う複合施設。", minutes: 7, coords: [35.6423, 139.7135] }
    ],
    "中目黒": [
        { name: "目黒川", time: "1時間", description: "桜の名所。川沿いにお洒落な店が並ぶ。", minutes: 1, coords: [35.6443, 139.6991] }
    ],
    "北千住": [
        { name: "宿場町通り", time: "1時間", description: "日光街道の宿場町の面影を残す。", minutes: 5, coords: [35.7513, 139.8033] }
    ],
    "西日暮里": [
        { name: "谷中銀座商店街", time: "1.5時間", description: "下町情緒あふれる商店街。", minutes: 5, coords: [35.7275, 139.7648] }
    ],
    "根津": [
        { name: "根津神社", time: "45分", description: "つつじの名所として有名。", minutes: 5, coords: [35.7202, 139.7607] }
    ],
    "湯島": [
        { name: "湯島天満宮", time: "45分", description: "学問の神様。", minutes: 2, coords: [35.7078, 139.7682] }
    ],
    "新御茶ノ水": [
        { name: "ニコライ堂", time: "30分", description: "日本初のビザンティン様式の聖堂。", minutes: 2, coords: [35.6983, 139.7656] }
    ],
    "日比谷": [
        { name: "日比谷公園", time: "1時間", description: "日本初の洋風近代式公園。", minutes: 1, coords: [35.6736, 139.7560] },
        { name: "東京ミッドタウン日比谷", time: "1.5時間", description: "映画・演劇・食事の中心地。", minutes: 0, coords: [35.6738, 139.7584] }
    ],
    "虎ノ門ヒルズ": [
        { name: "虎ノ門ヒルズ", time: "1.5時間", description: "未来的な超高層複合タワー。", minutes: 0, coords: [35.6669, 139.7496] }
    ],
    "神谷町": [
        { name: "東京タワー", time: "1.5時間", description: "東京のシンボル。", minutes: 7, coords: [35.6586, 139.7454] }
    ],
    "白金台": [
        { name: "東京都庭園美術館", time: "2時間", description: "旧朝香宮邸のアール・デコ建築。", minutes: 6, coords: [35.6367, 139.7196] },
        { name: "国立科学博物館附属自然教育園", time: "1.5時間", description: "都心に残された貴重な自然。", minutes: 7, coords: [35.6375, 139.7198] }
    ],
    "目黒": [
        { name: "目黒雅叙園", time: "1時間", description: "「昭和の竜宮城」と呼ばれる豪華絢爛な装飾。", minutes: 3, coords: [35.6320, 139.7118] }
    ],
    "浦安": [
        { name: "浦安市郷土博物館", time: "1時間", description: "昭和の浦安の街並みを再現。", minutes: 20, coords: [35.6560, 139.8943] }
    ],
    "葛西": [
        { name: "地下鉄博物館", time: "1.5時間", description: "地下鉄の歴史と技術を学べる。", minutes: 0, coords: [35.6634, 139.8732] }
    ],
    "木場": [
        { name: "木場公園", time: "1.5時間", description: "広大な芝生広場と美術館がある。", minutes: 5, coords: [35.6754, 139.8080] }
    ]
};
