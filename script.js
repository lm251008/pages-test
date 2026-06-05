// =====================
// パンダデータ
// =====================

const pandas = [
    {
        name: "シャンシャン",
        sex: "メス",
        birth: "2017-06-12",
        death: "",
        zoo: "上野動物園",
        note: "2023年中国返還"
    },
    {
        name: "リーリー",
        sex: "オス",
        birth: "2005-08-16",
        death: "",
        zoo: "上野動物園",
        note: ""
    },

];


// =====================
// フィルター作成
// =====================

const filterArea = document.createElement("div");

filterArea.innerHTML = `
    <input
        type="text"
        id="nameFilter"
        placeholder="名前で検索">

    <select id="sexFilter">
        <option value="">すべての性別</option>
        <option value="オス">オス</option>
        <option value="メス">メス</option>
    </select>

    <select id="zooFilter">
        <option value="">すべての動物園</option>
        <option value="上野動物園">上野動物園</option>
        <option value="アドベンチャーワールド">アドベンチャーワールド</option>
    </select>
`;

document
    .getElementById("pandaCards")
    .before(filterArea);


// =====================
// カード表示
// =====================

function displayCards(data) {

    const container =
        document.getElementById("pandaCards");

    container.innerHTML = "";

    data.forEach(panda => {

        const card =
            document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
            <h3>${panda.name}</h3>

            <p><strong>性別：</strong>${panda.sex}</p>

            <p><strong>誕生日：</strong>${panda.birth}</p>

            <p><strong>死亡日：</strong>${panda.death || "―"}</p>

            <p><strong>動物園：</strong>${panda.zoo}</p>

            <p><strong>備考：</strong>${panda.note}</p>
        `;

        container.appendChild(card);

    });

}

displayCards(pandas);


// =====================
// フィルター処理
// =====================

function filterPandas() {

    const name =
        document
        .getElementById("nameFilter")
        .value;

    const sex =
        document
        .getElementById("sexFilter")
        .value;

    const zoo =
        document
        .getElementById("zooFilter")
        .value;

    const filtered = pandas.filter(panda => {

        return (
            panda.name.includes(name) &&
            (sex === "" || panda.sex === sex) &&
            (zoo === "" || panda.zoo === zoo)
        );

    });

    displayCards(filtered);

}

document
    .getElementById("nameFilter")
    .addEventListener("input", filterPandas);

document
    .getElementById("sexFilter")
    .addEventListener("change", filterPandas);

document
    .getElementById("zooFilter")
    .addEventListener("change", filterPandas);


// =====================
// G7グラフ
// =====================

const chart =
    echarts.init(
        document.getElementById("g7Chart")
    );

const countries = [
    "日本",
    "アメリカ",
    "イギリス",
    "フランス",
    "ドイツ",
    "イタリア",
    "カナダ"
];

const current = [
    0,
    4,
    0,
    2,
    4,
    0,
    0
];

const cumulative = [
    36,
    38,
    14,
    10,
    14,
    0,
    8
];

const past =
    cumulative.map(
        (v, i) =>- current[i]+ v 
    );

chart.setOption({

    title: {
        text: "G7のパンダ飼育数"
    },

    tooltip: {
        trigger: "axis"
    },

    legend: {
        data: [
            "累積飼育数",
            "現在飼育中"
        ]
    },

    xAxis: {
        type: "value"
    },

    yAxis: {
        type: "category",
        data: countries
    },

    series: [
    {
        name: "累積飼育数",
        type: "bar",
        data: cumulative,
        itemStyle: {
            color: "#bdbdbd"
        },
        barGap: "-100%"
    },
    {
        name: "現在飼育中",
        type: "bar",
        data: current,
        itemStyle: {
            color: "#4caf50"
        }
    }
]
});