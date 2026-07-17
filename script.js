let pandas = [];

// CSVを読み込む
Papa.parse("panda_utf8.csv", {
    download: true,
    header: true,

    complete: function(results) {
        pandas = results.data
            .filter(row => row["カナ名"])
            .map(row => ({
                name: row["カナ名"],
                kanji: row["漢字名（中国語読み）"],
                sex: row["性別"],
                birth: row["出生日"],
                arrival: row["来日日"],
                status: row["死亡日／現在地"],
                departure: row["日本出国日"],
                zoo: row["日本での居住地"]
            }));

        displayCards(pandas);
    },
});

// カードを表示
function displayCards(data) {
    const cardArea = document.getElementById("pandaCards");
    cardArea.innerHTML = "";

    data.forEach(panda => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>${panda.name}</h3>
            <p><strong>漢字名：</strong>${panda.kanji}</p>
            <p><strong>性別：</strong>${panda.sex}</p>
            <p><strong>出生日：</strong>${panda.birth}</p>
            <p><strong>死亡日／現在地：</strong>${panda.status}</p>
            <p><strong>来日日：</strong>${panda.arrival}</p>
            <p><strong>日本出国日：</strong>${panda.departure}</p>
            <p><strong>日本での居住地：</strong>${panda.zoo}</p>
        `;

        cardArea.appendChild(card);
    });
}
function checkYearRange(dateStr, filter) {
    if (!filter) return true;
    if (!dateStr) return false;

    switch (filter) {
        case "不明":
            return dateStr.includes("不明");

        case "生存中":
            return !dateStr.includes("不明") &&
                (isNaN(parseInt(dateStr)) || dateStr.includes("生存中"));

        case "日本で生誕":
            return dateStr.includes("日本で生誕");

        case "日本で死亡":
            return dateStr.includes("日本で死亡");
    }

   const year = parseInt(dateStr);
        if (isNaN(year)) return false;

        if (filter === "2020-現在") return year >= 2020;

    const [start, end] = filter.split("-").map(Number);
    return year >= start && year <= end;
}

function checkZoo(zoo, filter) {
    if (!filter) return true;

    if (filter === "短期イベント") {
        if (zoo.includes("函館EXPO'88")) return true;

        return !zoo.includes("恩賜上野動物園") &&
               !zoo.includes("神戸市立王子動物園") &&
               !zoo.includes("アドベンチャーワールド");
    }

    return zoo.includes(filter);
}

function filterPandas() {
    const nameValue = document.getElementById("nameFilter").value;
    const sexValue = document.getElementById("sexFilter").value;
    const birthValue = document.getElementById("birthFilter").value;
    const statusValue = document.getElementById("statusFilter").value;
    const arrivalValue = document.getElementById("arrivalFilter").value;
    const departureValue = document.getElementById("departureFilter").value;
    const zooValue = document.getElementById("zooFilter").value;

    const filtered = pandas.filter(panda => {

        if (!panda.name.includes(nameValue)) return false;

        if (sexValue && panda.sex !== sexValue) return false;

        if (!checkYearRange(panda.birth, birthValue)) return false;

        if (!checkYearRange(panda.status, statusValue)) return false;

        if (!checkYearRange(panda.arrival, arrivalValue)) return false;

        if (!checkYearRange(panda.departure, departureValue)) return false;

        if (!checkZoo(panda.zoo || "", zooValue)) return false;

        return true;
    });

    displayCards(filtered);
}

document.getElementById("nameFilter").addEventListener("input", filterPandas);
document.getElementById("sexFilter").addEventListener("change", filterPandas);
document.getElementById("birthFilter").addEventListener("change", filterPandas);
document.getElementById("statusFilter").addEventListener("change", filterPandas);
document.getElementById("arrivalFilter").addEventListener("change", filterPandas);
document.getElementById("departureFilter").addEventListener("change", filterPandas);
document.getElementById("zooFilter").addEventListener("change", filterPandas);


// ==========================================
// 7. G7グラフの描画 (ECharts)
// ==========================================
const chart = echarts.init(document.getElementById("g7Chart"));

const countries = ["日本", "アメリカ", "イギリス", "フランス", "ドイツ", "イタリア", "カナダ"];
const current = [0, 4, 0, 2, 4, 0, 0];
const cumulative = [36, 38, 14, 10, 14, 0, 8];

chart.setOption({
    title: { text: "G7のパンダ飼育数" },
    tooltip: { trigger: "axis" },
    legend: { data: ["累積飼育数", "現在飼育中"] },

    xAxis: {
        type: "value",
        min: 0,
        max: 40,
        interval: 5
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
            itemStyle: { color: "#bdbdbd" },
            barGap: "-100%"
        },
        {
            name: "現在飼育中",
            type: "bar",
            data: current,
            itemStyle: { color: "#4caf50" }
        }
    ]
});