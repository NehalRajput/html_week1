let expenses = [];
let totalAmount = 0;

$(document).ready(function () {
    const categorySelect = $('#category-select');
    const amountInput = $('#amount-input');
    const dateInput = $('#date-input');
    const addBtn = $('#add-btn');
    const expensesTableBody = $('#expenses-table-body');
    const totalAmountCell = $('#total-amount');

    addBtn.click(function () {
        const category = categorySelect.val();
        const amount = Number(amountInput.val());
        const date = dateInput.val();

        if (category === '') {
            alert('Please select a category');
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid number');
            return;
        }
        if (date === '') {
            alert('Please select the date');
            return;
        }

        const expense = { category, amount, date };
        expenses.push(expense);
        totalAmount += amount;
        totalAmountCell.text(totalAmount);

        const newRow = $('<tr>');
        newRow.append(`<td>${expense.category}</td>`);
        newRow.append(`<td>${expense.amount}</td>`);
        newRow.append(`<td>${expense.date}</td>`);

        const deleteCell = $('<td>');
        const deleteBtn = $('<button>').text('Delete').addClass('delete-btn');

        deleteBtn.click(function () {
            expenses.splice(expenses.indexOf(expense), 1);
            totalAmount -= expense.amount;
            totalAmountCell.text(totalAmount);
            newRow.remove();
        });

        deleteCell.append(deleteBtn);
        newRow.append(deleteCell);
        expensesTableBody.append(newRow);
    });
});
