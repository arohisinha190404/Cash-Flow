let salary = 0;
let expenses = [];

let currentCurrency = "INR";
let exchangeRate = 1;

let expenseChart = null;


// DOM Elements
const expenseForm = document.getElementById("expenseForm");

const salaryInput = document.getElementById("salary");
const expenseNameInput = document.getElementById("expenseName");
const expenseAmountInput = document.getElementById("expenseAmount");

const salaryDisplay = document.getElementById("salaryDisplay");
const expenseDisplay = document.getElementById("expenseDisplay");
const balanceDisplay = document.getElementById("balanceDisplay");

const expenseList = document.getElementById("expenseList");
const expenseCount = document.getElementById("expenseCount");

const errorMessage = document.getElementById("errorMessage");

const alertBanner = document.getElementById("alertBanner");

const currencySelect = document.getElementById("currencySelect");

const downloadReportButton =
    document.getElementById("downloadReport");

const currencyStatus =
    document.getElementById("currencyStatus");


// Load LocalStorage
function loadData() {

    const savedSalary =
        localStorage.getItem("cashFlowSalary");

    const savedExpenses =
        localStorage.getItem("cashFlowExpenses");

    if (savedSalary !== null) {
        salary = Number(savedSalary);
    }

    if (savedExpenses !== null) {

        try {
            expenses = JSON.parse(savedExpenses);

            if (!Array.isArray(expenses)) {
                expenses = [];
            }

        } catch (error) {
            expenses = [];
        }
    }
}


// Save LocalStorage
function saveData() {

    localStorage.setItem(
        "cashFlowSalary",
        JSON.stringify(salary)
    );

    localStorage.setItem(
        "cashFlowExpenses",
        JSON.stringify(expenses)
    );
}


// Calculate Total Expenses
function calculateTotalExpenses() {

    return expenses.reduce(
        (total, expense) =>
            total + Number(expense.amount),
        0
    );
}


// Calculate Remaining Balance
function calculateRemainingBalance() {

    return salary - calculateTotalExpenses();
}


// Format Money
function formatMoney(amount) {

    if (currentCurrency === "USD") {
        return "$" + amount.toFixed(2);
    }

    return "₹" + amount.toFixed(2);
}


// Render Summary
function renderSummary() {

    const totalExpenses =
        calculateTotalExpenses();

    const remainingBalance =
        calculateRemainingBalance();

    salaryDisplay.textContent =
        formatMoney(salary * exchangeRate);

    expenseDisplay.textContent =
        formatMoney(totalExpenses * exchangeRate);

    balanceDisplay.textContent =
        formatMoney(remainingBalance * exchangeRate);


    if (
        salary > 0 &&
        remainingBalance < salary * 0.10
    ) {

        balanceDisplay.parentElement.classList.add(
            "balance-danger"
        );

        alertBanner.classList.remove("hidden");

    } else {

        balanceDisplay.parentElement.classList.remove(
            "balance-danger"
        );

        alertBanner.classList.add("hidden");
    }
}


// Render Expenses
function renderExpenses() {

    expenseList.innerHTML = "";

    if (expenses.length === 0) {

        expenseList.innerHTML = `
            <p class="empty-message">
                No expenses added yet.
            </p>
        `;

        expenseCount.textContent = "0 expenses";

        return;
    }

    expenseCount.textContent =
        `${expenses.length} ${
            expenses.length === 1
                ? "expense"
                : "expenses"
        }`;


    expenses.forEach(function (expense) {

        const expenseItem =
            document.createElement("div");

        expenseItem.className = "expense-item";


        const expenseInfo =
            document.createElement("div");

        expenseInfo.className = "expense-info";


        const title =
            document.createElement("h3");

        title.textContent = expense.name;


        const date =
            document.createElement("p");

        date.textContent =
            expense.date || "Added recently";


        expenseInfo.appendChild(title);
        expenseInfo.appendChild(date);


        const right =
            document.createElement("div");

        right.className = "expense-right";


        const amount =
            document.createElement("span");

        amount.className = "expense-amount";

        amount.textContent =
            formatMoney(
                Number(expense.amount) *
                exchangeRate
            );


        const deleteButton =
            document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "🗑️";


        deleteButton.addEventListener(
            "click",
            function () {

                deleteExpense(expense.id);

            }
        );


        right.appendChild(amount);
        right.appendChild(deleteButton);

        expenseItem.appendChild(expenseInfo);
        expenseItem.appendChild(right);

        expenseList.appendChild(expenseItem);

    });
}


// Add Expense
expenseForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        errorMessage.textContent = "";


        const salaryValue =
            Number(salaryInput.value);

        const expenseName =
            expenseNameInput.value.trim();

        const expenseAmount =
            Number(expenseAmountInput.value);


        // Validation

        if (salaryInput.value === "") {
            showError("Please enter your total salary.");
            return;
        }

        if (salaryValue < 0) {
            showError("Salary cannot be negative.");
            return;
        }

        if (expenseName === "") {
            showError("Please enter an expense name.");
            return;
        }

        if (expenseAmountInput.value === "") {
            showError("Please enter the expense amount.");
            return;
        }

        if (expenseAmount < 0) {
            showError("Expense amount cannot be negative.");
            return;
        }


        // Update salary
        salary = salaryValue;


        // Create expense
        const newExpense = {

            id: Date.now(),

            name: expenseName,

            amount: expenseAmount,

            date: new Date().toLocaleDateString()

        };


        expenses.push(newExpense);

        saveData();

        renderAll();


        // Clear inputs
        expenseNameInput.value = "";
        expenseAmountInput.value = "";

        salaryInput.value = salary;

    }
);


// Error
function showError(message) {

    errorMessage.textContent = message;

}


// Delete Expense
function deleteExpense(id) {

    expenses =
        expenses.filter(
            expense => expense.id !== id
        );

    saveData();

    renderAll();
}


// Chart
function renderChart() {

    const totalExpenses =
        calculateTotalExpenses();

    const remainingBalance =
        Math.max(
            calculateRemainingBalance(),
            0
        );


    const canvas =
        document.getElementById("expenseChart");


    if (expenseChart !== null) {
        expenseChart.destroy();
    }


    expenseChart =
        new Chart(canvas, {

            type: "pie",

            data: {

                labels: [
                    "Remaining Balance",
                    "Total Expenses"
                ],

                datasets: [{

                    data: [
                        remainingBalance,
                        totalExpenses
                    ]

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        position: "bottom"
                    }

                }

            }

        });
}


// Render Everything
function renderAll() {

    renderSummary();

    renderExpenses();

    renderChart();

}


// Currency Change
currencySelect.addEventListener("change", async function () {
    currentCurrency = currencySelect.value;

    if (currentCurrency === "USD") {
        await convertCurrency();
    } else {
        exchangeRate = 1;
        currencyStatus.textContent = "Currency: INR ₹";
        renderAll();
    }
});


// Currency API
async function convertCurrency() {
    try {
        currencyStatus.textContent = "Getting latest exchange rate...";

        const response = await fetch(
            "https://api.frankfurter.dev/v2/rate/inr/usd"
        );

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        exchangeRate = data.rate;

        currencyStatus.textContent =
            `INR → USD rate: ${exchangeRate.toFixed(4)}`;

        renderAll();

    } catch (error) {
        console.error(error);
        currencyStatus.textContent = "Currency conversion unavailable.";
    }
}


// PDF Report
downloadReportButton.addEventListener("click", function () {
    generatePDFReport();
});

function generatePDFReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const totalExpenses = calculateTotalExpenses();
    const remainingBalance = calculateRemainingBalance();

    doc.setFontSize(22);
    doc.text("Cash-Flow Report", 20, 20);

    doc.setFontSize(12);
    doc.text("Salary & Expense Tracker", 20, 30);

    doc.text(`Total Salary: ${formatMoney(salary * exchangeRate)}`, 20, 45);
    doc.text(`Total Expenses: ${formatMoney(totalExpenses * exchangeRate)}`, 20, 55);
    doc.text(`Remaining Balance: ${formatMoney(remainingBalance * exchangeRate)}`, 20, 65);

    doc.text("Expense Details:", 20, 82);

    let y = 92;

    expenses.forEach(function (expense, index) {
        doc.text(
            `${index + 1}. ${expense.name} - ${formatMoney(Number(expense.amount) * exchangeRate)}`,
            20,
            y
        );
        y += 10;
    });

    doc.save("cash-flow-report.pdf");
}


// Load saved data
loadData();
salaryInput.value = "";
renderAll();
