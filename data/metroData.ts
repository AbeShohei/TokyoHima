export interface Spot {
  name: string;
  time: string;
}

export interface Station {
  id: string;
  name: string;
  coordinates: [number, number];
  spots: Spot[];
}

export interface Line {
  id: string;
  name: string;
  color: string;
  stations: Station[];
}

// Full Data Generated from ODPT API
export const METRO_DATA: Record<string, Line> = {
  "M": {
    "id": "M",
    "name": "丸ノ内線",
    "color": "#F62E36",
    "stations": [
      {
        "id": "M01",
        "name": "荻窪",
        "coordinates": [
          35.704175,
          139.61976
        ],
        "spots": []
      },
      {
        "id": "M02",
        "name": "南阿佐ケ谷",
        "coordinates": [
          35.699455,
          139.635575
        ],
        "spots": []
      },
      {
        "id": "M03",
        "name": "新高円寺",
        "coordinates": [
          35.69786,
          139.64851
        ],
        "spots": []
      },
      {
        "id": "M04",
        "name": "東高円寺",
        "coordinates": [
          35.697965,
          139.658295
        ],
        "spots": []
      },
      {
        "id": "M05",
        "name": "新中野",
        "coordinates": [
          35.697475,
          139.66951
        ],
        "spots": []
      },
      {
        "id": "M06",
        "name": "中野坂上",
        "coordinates": [
          35.697085,
          139.682205
        ],
        "spots": []
      },
      {
        "id": "M07",
        "name": "西新宿",
        "coordinates": [
          35.694515,
          139.69256
        ],
        "spots": []
      },
      {
        "id": "M08",
        "name": "新宿",
        "coordinates": [
          35.692452,
          139.700548
        ],
        "spots": []
      },
      {
        "id": "M09",
        "name": "新宿三丁目",
        "coordinates": [
          35.69118,
          139.70421
        ],
        "spots": []
      },
      {
        "id": "M10",
        "name": "新宿御苑前",
        "coordinates": [
          35.688525,
          139.710915
        ],
        "spots": []
      },
      {
        "id": "M11",
        "name": "四谷三丁目",
        "coordinates": [
          35.687835,
          139.719325
        ],
        "spots": []
      },
      {
        "id": "M12",
        "name": "四ツ谷",
        "coordinates": [
          35.684197,
          139.730047
        ],
        "spots": []
      },
      {
        "id": "M13",
        "name": "赤坂見附",
        "coordinates": [
          35.676845,
          139.737347
        ],
        "spots": []
      },
      {
        "id": "M14",
        "name": "国会議事堂前",
        "coordinates": [
          35.674926,
          139.745473
        ],
        "spots": []
      },
      {
        "id": "M15",
        "name": "霞ケ関",
        "coordinates": [
          35.674235,
          139.75268
        ],
        "spots": []
      },
      {
        "id": "M16",
        "name": "銀座",
        "coordinates": [
          35.673159,
          139.763876
        ],
        "spots": []
      },
      {
        "id": "M17",
        "name": "東京",
        "coordinates": [
          35.681935,
          139.7648
        ],
        "spots": []
      },
      {
        "id": "M18",
        "name": "大手町",
        "coordinates": [
          35.686875,
          139.766203
        ],
        "spots": []
      },
      {
        "id": "M19",
        "name": "淡路町",
        "coordinates": [
          35.69487,
          139.767455
        ],
        "spots": []
      },
      {
        "id": "M20",
        "name": "御茶ノ水",
        "coordinates": [
          35.70043,
          139.764405
        ],
        "spots": []
      },
      {
        "id": "M21",
        "name": "本郷三丁目",
        "coordinates": [
          35.706726,
          139.760154
        ],
        "spots": []
      },
      {
        "id": "M22",
        "name": "後楽園",
        "coordinates": [
          35.707307,
          139.750861
        ],
        "spots": []
      },
      {
        "id": "M23",
        "name": "茗荷谷",
        "coordinates": [
          35.7172,
          139.736895
        ],
        "spots": []
      },
      {
        "id": "M24",
        "name": "新大塚",
        "coordinates": [
          35.72613,
          139.729354
        ],
        "spots": []
      },
      {
        "id": "M25",
        "name": "池袋",
        "coordinates": [
          35.730345,
          139.71115
        ],
        "spots": []
      }
    ]
  },
  "C": {
    "id": "C",
    "name": "千代田線",
    "color": "#00BB85",
    "stations": [
      {
        "id": "C01",
        "name": "代々木上原",
        "coordinates": [
          35.669017,
          139.679884
        ],
        "spots": []
      },
      {
        "id": "C02",
        "name": "代々木公園",
        "coordinates": [
          35.669104,
          139.689791
        ],
        "spots": []
      },
      {
        "id": "C03",
        "name": "明治神宮前〈原宿〉",
        "coordinates": [
          35.669123,
          139.703944
        ],
        "spots": []
      },
      {
        "id": "C04",
        "name": "表参道",
        "coordinates": [
          35.665652,
          139.711346
        ],
        "spots": []
      },
      {
        "id": "C05",
        "name": "乃木坂",
        "coordinates": [
          35.666592,
          139.726229
        ],
        "spots": []
      },
      {
        "id": "C06",
        "name": "赤坂",
        "coordinates": [
          35.672104,
          139.736413
        ],
        "spots": []
      },
      {
        "id": "C07",
        "name": "国会議事堂前",
        "coordinates": [
          35.673566,
          139.743188
        ],
        "spots": []
      },
      {
        "id": "C08",
        "name": "霞ケ関",
        "coordinates": [
          35.67256,
          139.75177
        ],
        "spots": []
      },
      {
        "id": "C09",
        "name": "日比谷",
        "coordinates": [
          35.673955,
          139.758765
        ],
        "spots": []
      },
      {
        "id": "C10",
        "name": "二重橋前〈丸の内〉",
        "coordinates": [
          35.680505,
          139.76178
        ],
        "spots": []
      },
      {
        "id": "C11",
        "name": "大手町",
        "coordinates": [
          35.68525,
          139.763285
        ],
        "spots": []
      },
      {
        "id": "C12",
        "name": "新御茶ノ水",
        "coordinates": [
          35.696925,
          139.76545
        ],
        "spots": []
      },
      {
        "id": "C13",
        "name": "湯島",
        "coordinates": [
          35.706805,
          139.769981
        ],
        "spots": []
      },
      {
        "id": "C14",
        "name": "根津",
        "coordinates": [
          35.717325,
          139.76575
        ],
        "spots": []
      },
      {
        "id": "C15",
        "name": "千駄木",
        "coordinates": [
          35.725746,
          139.763303
        ],
        "spots": []
      },
      {
        "id": "C16",
        "name": "西日暮里",
        "coordinates": [
          35.732355,
          139.76689
        ],
        "spots": []
      },
      {
        "id": "C17",
        "name": "町屋",
        "coordinates": [
          35.742068,
          139.780047
        ],
        "spots": []
      },
      {
        "id": "C18",
        "name": "北千住",
        "coordinates": [
          35.7492,
          139.804403
        ],
        "spots": []
      },
      {
        "id": "C19",
        "name": "綾瀬",
        "coordinates": [
          35.762285,
          139.82489
        ],
        "spots": []
      },
      {
        "id": "C20",
        "name": "北綾瀬",
        "coordinates": [
          35.77689,
          139.832095
        ],
        "spots": []
      }
    ]
  },
  "N": {
    "id": "N",
    "name": "南北線",
    "color": "#00AC9B",
    "stations": [
      {
        "id": "N01",
        "name": "目黒",
        "coordinates": [
          35.632485,
          139.71566
        ],
        "spots": []
      },
      {
        "id": "N02",
        "name": "白金台",
        "coordinates": [
          35.63777,
          139.72586
        ],
        "spots": []
      },
      {
        "id": "N03",
        "name": "白金高輪",
        "coordinates": [
          35.643145,
          139.734285
        ],
        "spots": []
      },
      {
        "id": "N04",
        "name": "麻布十番",
        "coordinates": [
          35.65481,
          139.737045
        ],
        "spots": []
      },
      {
        "id": "N05",
        "name": "六本木一丁目",
        "coordinates": [
          35.665075,
          139.7389
        ],
        "spots": []
      },
      {
        "id": "N06",
        "name": "溜池山王",
        "coordinates": [
          35.673091,
          139.741294
        ],
        "spots": []
      },
      {
        "id": "N07",
        "name": "永田町",
        "coordinates": [
          35.678338,
          139.739288
        ],
        "spots": []
      },
      {
        "id": "N08",
        "name": "四ツ谷",
        "coordinates": [
          35.686082,
          139.72968
        ],
        "spots": []
      },
      {
        "id": "N09",
        "name": "市ケ谷",
        "coordinates": [
          35.692894,
          139.736324
        ],
        "spots": []
      },
      {
        "id": "N10",
        "name": "飯田橋",
        "coordinates": [
          35.701532,
          139.743716
        ],
        "spots": []
      },
      {
        "id": "N11",
        "name": "後楽園",
        "coordinates": [
          35.70839,
          139.751786
        ],
        "spots": []
      },
      {
        "id": "N12",
        "name": "東大前",
        "coordinates": [
          35.718014,
          139.75788
        ],
        "spots": []
      },
      {
        "id": "N13",
        "name": "本駒込",
        "coordinates": [
          35.724365,
          139.753812
        ],
        "spots": []
      },
      {
        "id": "N14",
        "name": "駒込",
        "coordinates": [
          35.735913,
          139.746909
        ],
        "spots": []
      },
      {
        "id": "N15",
        "name": "西ケ原",
        "coordinates": [
          35.745945,
          139.74226
        ],
        "spots": []
      },
      {
        "id": "N16",
        "name": "王子",
        "coordinates": [
          35.75447,
          139.737362
        ],
        "spots": []
      },
      {
        "id": "N17",
        "name": "王子神谷",
        "coordinates": [
          35.765292,
          139.735641
        ],
        "spots": []
      },
      {
        "id": "N18",
        "name": "志茂",
        "coordinates": [
          35.778025,
          139.7325
        ],
        "spots": []
      },
      {
        "id": "N19",
        "name": "赤羽岩淵",
        "coordinates": [
          35.783355,
          139.72211
        ],
        "spots": []
      }
    ]
  },
  "F": {
    "id": "F",
    "name": "副都心線",
    "color": "#9C5E31",
    "stations": [
      {
        "id": "F01",
        "name": "和光市",
        "coordinates": [
          35.78835,
          139.612865
        ],
        "spots": []
      },
      {
        "id": "F02",
        "name": "地下鉄成増",
        "coordinates": [
          35.77674,
          139.63117
        ],
        "spots": []
      },
      {
        "id": "F03",
        "name": "地下鉄赤塚",
        "coordinates": [
          35.76998,
          139.644001
        ],
        "spots": []
      },
      {
        "id": "F04",
        "name": "平和台",
        "coordinates": [
          35.757555,
          139.6543
        ],
        "spots": []
      },
      {
        "id": "F05",
        "name": "氷川台",
        "coordinates": [
          35.74962,
          139.66547
        ],
        "spots": []
      },
      {
        "id": "F06",
        "name": "小竹向原",
        "coordinates": [
          35.743395,
          139.67952
        ],
        "spots": []
      },
      {
        "id": "F07",
        "name": "千川",
        "coordinates": [
          35.738175,
          139.6894
        ],
        "spots": []
      },
      {
        "id": "F08",
        "name": "要町",
        "coordinates": [
          35.733215,
          139.69848
        ],
        "spots": []
      },
      {
        "id": "F09",
        "name": "池袋",
        "coordinates": [
          35.730345,
          139.71115
        ],
        "spots": []
      },
      {
        "id": "F10",
        "name": "雑司が谷",
        "coordinates": [
          35.7202,
          139.714715
        ],
        "spots": []
      },
      {
        "id": "F11",
        "name": "西早稲田",
        "coordinates": [
          35.707806,
          139.70912
        ],
        "spots": []
      },
      {
        "id": "F12",
        "name": "東新宿",
        "coordinates": [
          35.699829,
          139.707846
        ],
        "spots": []
      },
      {
        "id": "F13",
        "name": "新宿三丁目",
        "coordinates": [
          35.690609,
          139.704727
        ],
        "spots": []
      },
      {
        "id": "F14",
        "name": "北参道",
        "coordinates": [
          35.678503,
          139.705469
        ],
        "spots": []
      },
      {
        "id": "F15",
        "name": "明治神宮前〈原宿〉",
        "coordinates": [
          35.668205,
          139.70524
        ],
        "spots": []
      },
      {
        "id": "F16",
        "name": "渋谷",
        "coordinates": [
          35.659092,
          139.70257
        ],
        "spots": []
      }
    ]
  },
  "G": {
    "id": "G",
    "name": "銀座線",
    "color": "#FF9500",
    "stations": [
      {
        "id": "G01",
        "name": "渋谷",
        "coordinates": [
          35.659097,
          139.702673
        ],
        "spots": []
      },
      {
        "id": "G02",
        "name": "表参道",
        "coordinates": [
          35.665042,
          139.712473
        ],
        "spots": []
      },
      {
        "id": "G03",
        "name": "外苑前",
        "coordinates": [
          35.670375,
          139.717825
        ],
        "spots": []
      },
      {
        "id": "G04",
        "name": "青山一丁目",
        "coordinates": [
          35.67279,
          139.724145
        ],
        "spots": []
      },
      {
        "id": "G05",
        "name": "赤坂見附",
        "coordinates": [
          35.676845,
          139.737347
        ],
        "spots": []
      },
      {
        "id": "G06",
        "name": "溜池山王",
        "coordinates": [
          35.671511,
          139.741943
        ],
        "spots": []
      },
      {
        "id": "G07",
        "name": "虎ノ門",
        "coordinates": [
          35.67016,
          139.75012
        ],
        "spots": []
      },
      {
        "id": "G08",
        "name": "新橋",
        "coordinates": [
          35.667382,
          139.758512
        ],
        "spots": []
      },
      {
        "id": "G09",
        "name": "銀座",
        "coordinates": [
          35.6715,
          139.765366
        ],
        "spots": []
      },
      {
        "id": "G10",
        "name": "京橋",
        "coordinates": [
          35.676704,
          139.77011
        ],
        "spots": []
      },
      {
        "id": "G11",
        "name": "日本橋",
        "coordinates": [
          35.681879,
          139.773335
        ],
        "spots": []
      },
      {
        "id": "G12",
        "name": "三越前",
        "coordinates": [
          35.687173,
          139.773582
        ],
        "spots": []
      },
      {
        "id": "G13",
        "name": "神田",
        "coordinates": [
          35.693715,
          139.77089
        ],
        "spots": []
      },
      {
        "id": "G14",
        "name": "末広町",
        "coordinates": [
          35.70278,
          139.771762
        ],
        "spots": []
      },
      {
        "id": "G15",
        "name": "上野広小路",
        "coordinates": [
          35.707765,
          139.773011
        ],
        "spots": []
      },
      {
        "id": "G16",
        "name": "上野",
        "coordinates": [
          35.711835,
          139.775625
        ],
        "spots": []
      },
      {
        "id": "G17",
        "name": "稲荷町",
        "coordinates": [
          35.711389,
          139.78221
        ],
        "spots": []
      },
      {
        "id": "G18",
        "name": "田原町",
        "coordinates": [
          35.709917,
          139.790306
        ],
        "spots": []
      },
      {
        "id": "G19",
        "name": "浅草",
        "coordinates": [
          35.710746,
          139.797774
        ],
        "spots": []
      }
    ]
  },
  "Z": {
    "id": "Z",
    "name": "半蔵門線",
    "color": "#8F76D6",
    "stations": [
      {
        "id": "Z01",
        "name": "渋谷",
        "coordinates": [
          35.65945,
          139.701035
        ],
        "spots": []
      },
      {
        "id": "Z02",
        "name": "表参道",
        "coordinates": [
          35.665143,
          139.712383
        ],
        "spots": []
      },
      {
        "id": "Z03",
        "name": "青山一丁目",
        "coordinates": [
          35.672956,
          139.724075
        ],
        "spots": []
      },
      {
        "id": "Z04",
        "name": "永田町",
        "coordinates": [
          35.678407,
          139.738865
        ],
        "spots": []
      },
      {
        "id": "Z05",
        "name": "半蔵門",
        "coordinates": [
          35.68538,
          139.741695
        ],
        "spots": []
      },
      {
        "id": "Z06",
        "name": "九段下",
        "coordinates": [
          35.695501,
          139.751117
        ],
        "spots": []
      },
      {
        "id": "Z07",
        "name": "神保町",
        "coordinates": [
          35.696021,
          139.75756
        ],
        "spots": []
      },
      {
        "id": "Z08",
        "name": "大手町",
        "coordinates": [
          35.686745,
          139.764905
        ],
        "spots": []
      },
      {
        "id": "Z09",
        "name": "三越前",
        "coordinates": [
          35.684928,
          139.77308
        ],
        "spots": []
      },
      {
        "id": "Z10",
        "name": "水天宮前",
        "coordinates": [
          35.683,
          139.785171
        ],
        "spots": []
      },
      {
        "id": "Z11",
        "name": "清澄白河",
        "coordinates": [
          35.682119,
          139.799841
        ],
        "spots": []
      },
      {
        "id": "Z12",
        "name": "住吉",
        "coordinates": [
          35.688704,
          139.815667
        ],
        "spots": []
      },
      {
        "id": "Z13",
        "name": "錦糸町",
        "coordinates": [
          35.697441,
          139.814957
        ],
        "spots": []
      },
      {
        "id": "Z14",
        "name": "押上〈スカイツリー前〉",
        "coordinates": [
          35.708467,
          139.813735
        ],
        "spots": []
      }
    ]
  },
  "H": {
    "id": "H",
    "name": "日比谷線",
    "color": "#B5B5AC",
    "stations": [
      {
        "id": "H01",
        "name": "中目黒",
        "coordinates": [
          35.644108,
          139.698833
        ],
        "spots": []
      },
      {
        "id": "H02",
        "name": "恵比寿",
        "coordinates": [
          35.64704,
          139.708701
        ],
        "spots": []
      },
      {
        "id": "H03",
        "name": "広尾",
        "coordinates": [
          35.651499,
          139.722209
        ],
        "spots": []
      },
      {
        "id": "H04",
        "name": "六本木",
        "coordinates": [
          35.6628,
          139.731155
        ],
        "spots": []
      },
      {
        "id": "H05",
        "name": "神谷町",
        "coordinates": [
          35.662625,
          139.744725
        ],
        "spots": []
      },
      {
        "id": "H06",
        "name": "虎ノ門ヒルズ",
        "coordinates": [
          35.667309,
          139.747738
        ],
        "spots": []
      },
      {
        "id": "H07",
        "name": "霞ケ関",
        "coordinates": [
          35.673875,
          139.75106
        ],
        "spots": []
      },
      {
        "id": "H08",
        "name": "日比谷",
        "coordinates": [
          35.674271,
          139.7606
        ],
        "spots": []
      },
      {
        "id": "H09",
        "name": "銀座",
        "coordinates": [
          35.671983,
          139.764007
        ],
        "spots": []
      },
      {
        "id": "H10",
        "name": "東銀座",
        "coordinates": [
          35.669129,
          139.767633
        ],
        "spots": []
      },
      {
        "id": "H11",
        "name": "築地",
        "coordinates": [
          35.667928,
          139.772473
        ],
        "spots": []
      },
      {
        "id": "H12",
        "name": "八丁堀",
        "coordinates": [
          35.675368,
          139.777334
        ],
        "spots": []
      },
      {
        "id": "H13",
        "name": "茅場町",
        "coordinates": [
          35.679078,
          139.779619
        ],
        "spots": []
      },
      {
        "id": "H14",
        "name": "人形町",
        "coordinates": [
          35.686259,
          139.782339
        ],
        "spots": []
      },
      {
        "id": "H15",
        "name": "小伝馬町",
        "coordinates": [
          35.690423,
          139.778758
        ],
        "spots": []
      },
      {
        "id": "H16",
        "name": "秋葉原",
        "coordinates": [
          35.697965,
          139.775529
        ],
        "spots": []
      },
      {
        "id": "H17",
        "name": "仲御徒町",
        "coordinates": [
          35.706655,
          139.77619
        ],
        "spots": []
      },
      {
        "id": "H18",
        "name": "上野",
        "coordinates": [
          35.711558,
          139.777061
        ],
        "spots": []
      },
      {
        "id": "H19",
        "name": "入谷",
        "coordinates": [
          35.720565,
          139.784466
        ],
        "spots": []
      },
      {
        "id": "H20",
        "name": "三ノ輪",
        "coordinates": [
          35.729285,
          139.791165
        ],
        "spots": []
      },
      {
        "id": "H21",
        "name": "南千住",
        "coordinates": [
          35.73231,
          139.79878
        ],
        "spots": []
      },
      {
        "id": "H22",
        "name": "北千住",
        "coordinates": [
          35.749904,
          139.805591
        ],
        "spots": []
      }
    ]
  },
  "T": {
    "id": "T",
    "name": "東西線",
    "color": "#009BBF",
    "stations": [
      {
        "id": "T01",
        "name": "中野",
        "coordinates": [
          35.70574,
          139.665605
        ],
        "spots": []
      },
      {
        "id": "T02",
        "name": "落合",
        "coordinates": [
          35.710635,
          139.685965
        ],
        "spots": []
      },
      {
        "id": "T03",
        "name": "高田馬場",
        "coordinates": [
          35.71328,
          139.705045
        ],
        "spots": []
      },
      {
        "id": "T04",
        "name": "早稲田",
        "coordinates": [
          35.70568,
          139.72219
        ],
        "spots": []
      },
      {
        "id": "T05",
        "name": "神楽坂",
        "coordinates": [
          35.703865,
          139.73452
        ],
        "spots": []
      },
      {
        "id": "T06",
        "name": "飯田橋",
        "coordinates": [
          35.701403,
          139.746521
        ],
        "spots": []
      },
      {
        "id": "T07",
        "name": "九段下",
        "coordinates": [
          35.696091,
          139.751265
        ],
        "spots": []
      },
      {
        "id": "T08",
        "name": "竹橋",
        "coordinates": [
          35.69044,
          139.75767
        ],
        "spots": []
      },
      {
        "id": "T09",
        "name": "大手町",
        "coordinates": [
          35.684697,
          139.76603
        ],
        "spots": []
      },
      {
        "id": "T10",
        "name": "日本橋",
        "coordinates": [
          35.682376,
          139.774101
        ],
        "spots": []
      },
      {
        "id": "T11",
        "name": "茅場町",
        "coordinates": [
          35.680346,
          139.77927
        ],
        "spots": []
      },
      {
        "id": "T12",
        "name": "門前仲町",
        "coordinates": [
          35.671892,
          139.796099
        ],
        "spots": []
      },
      {
        "id": "T13",
        "name": "木場",
        "coordinates": [
          35.669356,
          139.807115
        ],
        "spots": []
      },
      {
        "id": "T14",
        "name": "東陽町",
        "coordinates": [
          35.66959,
          139.81768
        ],
        "spots": []
      },
      {
        "id": "T15",
        "name": "南砂町",
        "coordinates": [
          35.668415,
          139.831695
        ],
        "spots": []
      },
      {
        "id": "T16",
        "name": "西葛西",
        "coordinates": [
          35.664562,
          139.8596
        ],
        "spots": []
      },
      {
        "id": "T17",
        "name": "葛西",
        "coordinates": [
          35.663616,
          139.87253
        ],
        "spots": []
      },
      {
        "id": "T18",
        "name": "浦安",
        "coordinates": [
          35.665903,
          139.893236
        ],
        "spots": []
      },
      {
        "id": "T19",
        "name": "南行徳",
        "coordinates": [
          35.672729,
          139.902276
        ],
        "spots": []
      },
      {
        "id": "T20",
        "name": "行徳",
        "coordinates": [
          35.68262,
          139.914185
        ],
        "spots": []
      },
      {
        "id": "T21",
        "name": "妙典",
        "coordinates": [
          35.691014,
          139.924286
        ],
        "spots": []
      },
      {
        "id": "T22",
        "name": "原木中山",
        "coordinates": [
          35.7033,
          139.941915
        ],
        "spots": []
      },
      {
        "id": "T23",
        "name": "西船橋",
        "coordinates": [
          35.707174,
          139.958767
        ],
        "spots": []
      }
    ]
  },
  "Y": {
    "id": "Y",
    "name": "有楽町線",
    "color": "#C1A470",
    "stations": [
      {
        "id": "Y01",
        "name": "和光市",
        "coordinates": [
          35.78835,
          139.612865
        ],
        "spots": []
      },
      {
        "id": "Y02",
        "name": "地下鉄成増",
        "coordinates": [
          35.77674,
          139.63117
        ],
        "spots": []
      },
      {
        "id": "Y03",
        "name": "地下鉄赤塚",
        "coordinates": [
          35.769981,
          139.644
        ],
        "spots": []
      },
      {
        "id": "Y04",
        "name": "平和台",
        "coordinates": [
          35.757555,
          139.6543
        ],
        "spots": []
      },
      {
        "id": "Y05",
        "name": "氷川台",
        "coordinates": [
          35.74962,
          139.66547
        ],
        "spots": []
      },
      {
        "id": "Y06",
        "name": "小竹向原",
        "coordinates": [
          35.743395,
          139.67952
        ],
        "spots": []
      },
      {
        "id": "Y07",
        "name": "千川",
        "coordinates": [
          35.738175,
          139.6894
        ],
        "spots": []
      },
      {
        "id": "Y08",
        "name": "要町",
        "coordinates": [
          35.733215,
          139.69848
        ],
        "spots": []
      },
      {
        "id": "Y09",
        "name": "池袋",
        "coordinates": [
          35.729185,
          139.710885
        ],
        "spots": []
      },
      {
        "id": "Y10",
        "name": "東池袋",
        "coordinates": [
          35.72595,
          139.718865
        ],
        "spots": []
      },
      {
        "id": "Y11",
        "name": "護国寺",
        "coordinates": [
          35.71918,
          139.72745
        ],
        "spots": []
      },
      {
        "id": "Y12",
        "name": "江戸川橋",
        "coordinates": [
          35.709295,
          139.73413
        ],
        "spots": []
      },
      {
        "id": "Y13",
        "name": "飯田橋",
        "coordinates": [
          35.701342,
          139.743207
        ],
        "spots": []
      },
      {
        "id": "Y14",
        "name": "市ケ谷",
        "coordinates": [
          35.692576,
          139.736891
        ],
        "spots": []
      },
      {
        "id": "Y15",
        "name": "麴町",
        "coordinates": [
          35.684785,
          139.73735
        ],
        "spots": []
      },
      {
        "id": "Y16",
        "name": "永田町",
        "coordinates": [
          35.677895,
          139.741773
        ],
        "spots": []
      },
      {
        "id": "Y17",
        "name": "桜田門",
        "coordinates": [
          35.677459,
          139.751886
        ],
        "spots": []
      },
      {
        "id": "Y18",
        "name": "有楽町",
        "coordinates": [
          35.675973,
          139.762286
        ],
        "spots": []
      },
      {
        "id": "Y19",
        "name": "銀座一丁目",
        "coordinates": [
          35.674519,
          139.766786
        ],
        "spots": []
      },
      {
        "id": "Y20",
        "name": "新富町",
        "coordinates": [
          35.670529,
          139.773594
        ],
        "spots": []
      },
      {
        "id": "Y21",
        "name": "月島",
        "coordinates": [
          35.664711,
          139.784405
        ],
        "spots": []
      },
      {
        "id": "Y22",
        "name": "豊洲",
        "coordinates": [
          35.655153,
          139.795994
        ],
        "spots": []
      },
      {
        "id": "Y23",
        "name": "辰巳",
        "coordinates": [
          35.645775,
          139.81033
        ],
        "spots": []
      },
      {
        "id": "Y24",
        "name": "新木場",
        "coordinates": [
          35.64578,
          139.826605
        ],
        "spots": []
      }
    ]
  },
  "Mb": {
    "id": "Mb",
    "name": "丸ノ内線支線",
    "color": "#F62E36",
    "stations": [
      {
        "id": "Mb03",
        "name": "方南町",
        "coordinates": [
          35.683515,
          139.657935
        ],
        "spots": []
      },
      {
        "id": "Mb04",
        "name": "中野富士見町",
        "coordinates": [
          35.69082,
          139.668155
        ],
        "spots": []
      },
      {
        "id": "Mb05",
        "name": "中野新橋",
        "coordinates": [
          35.691685,
          139.674001
        ],
        "spots": []
      },
      {
        "id": "M06",
        "name": "中野坂上",
        "coordinates": [
          35.697085,
          139.682205
        ],
        "spots": []
      }
    ]
  }
};
