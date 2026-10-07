// LocalStorageの保存用キー名
const STORAGE_KEY = "kakeibo_data";

// 家計簿データを保持する配列
let transactions = [];

// DOM要素の取得
const form = document.getElementById("transaction-form");
const dateInput = document.getElementById("date");
const itemInput = document.getElementById("item");
const typeInput = document.getElementById("type");
const amountInput = document.getElementById("amount");

const transactionList = document.getElementById("transaction-list");
const totalExpenseEl = document.getElementById("total-expense");
const totalIncomeEl = document.getElementById("total-income");
const totalBalanceEl = document.getElementById("total-balance");

/**
 * 画面（リスト・合計金額）の表示を更新する
 */
function render() {
  // リスト表示を一度空にする
  transactionList.innerHTML = "";

  let totalExpense = 0;
  let totalIncome = 0;

  // データ配列をループして行を作成
  transactions.forEach(item => {
    const tr = document.createElement("tr");

    const isExpense = item.type === "expense";
    const typeText = isExpense ? "支出" : "収入";
    const badgeClass = isExpense ? "badge-expense" : "badge-income";

    // 集計
    if (isExpense) {
      totalExpense += item.amount;
    } else {
      totalIncome += item.amount;
    }

    // 行要素の組み立て
    tr.innerHTML = `
            <td>${item.date}</td>
            <td>${item.item}</td>
            <td><span class="badge ${badgeClass}">${typeText}</span></td>
            <td class="amount-cell">${item.amount.toLocaleString()} 円</td>
        `;

    transactionList.appendChild(tr);
  });

  // 合計金額の計算と表示更新
  const totalBalance = totalIncome - totalExpense;

  totalExpenseEl.textContent = `${totalExpense.toLocaleString()} 円`;
  totalIncomeEl.textContent = `${totalIncome.toLocaleString()} 円`;
  totalBalanceEl.textContent = `${totalBalance.toLocaleString()} 円`;
}

/**
 * ページ読み込み時にLocalStorageからデータを取得して表示する
 */
function loadData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    transactions = JSON.parse(data);
  } else {
    transactions = [];
  }
  render();
}

/**
 * フォーム送信時にLocalStorageへ保存し、画面表示を書き換える
 */
form.addEventListener("submit", function (e) {
  e.preventDefault(); // 画面のリロードを防ぐ

  // 入力値の取得と新しいデータオブジェクト作成
  const newTransaction = {
    date: dateInput.value,
    item: itemInput.value,
    type: typeInput.value,
    amount: Number(amountInput.value)
  };

  // 配列に追加
  transactions.push(newTransaction);

  // LocalStorageへ保存
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));

  // 画面表示を書き換える
  render();

  // フォームをリセット
  form.reset();
});

// ページ読み込み時の処理を実行
loadData();