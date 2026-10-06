# Cash-Flow - Sprint 02

## Project Objective

Build a functional Salary and Expense Tracker using Vanilla JavaScript.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage
- Chart.js
- jsPDF
- Frankfurter API

## Features

### Phase 1

- Total Salary input
- Expense Name input
- Expense Amount input
- Dynamic expense list
- Total expense calculation
- Remaining balance calculation
- Input validation

### Phase 2

- LocalStorage persistence
- Dynamic delete operation
- Chart.js Pie Chart
- Real-time balance updates

### Phase 3

- PDF report generation
- INR to USD currency conversion
- Low balance warning

## JavaScript Concepts Used

- Variables
- Arrays
- Objects
- Functions
- DOM Manipulation
- Event Listeners
- Array reduce()
- Array filter()
- LocalStorage
- JSON.stringify()
- JSON.parse()
- Async/Await
- Fetch API

## Important Calculations

Total Expenses:

```javascript
const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
);