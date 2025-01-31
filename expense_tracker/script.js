$(document).ready(function () {
    let groups = JSON.parse(localStorage.getItem('groups')) || [];
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    function updateDashboard() {
        let totalExpense = 0;
        let totalThisMonth = 0;
        let highestSpendingGroup = { name: 'None', total: 0 };

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        $('#group-list').empty();
        groups.forEach(group => {
            let groupExpense = 0;
            expenses.forEach(expense => {
                if (expense.group === group.name) {
                    let expenseAmount = parseFloat(expense.amount);
                    groupExpense += expenseAmount;
                    totalExpense += expenseAmount;

                    let expenseDate = new Date(expense.date);
                    if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
                        totalThisMonth += expenseAmount;
                    }
                }
            });

            if (groupExpense > highestSpendingGroup.total) {
                highestSpendingGroup = { name: group.name, total: groupExpense };
            }

            let deleteButton = groupExpense === 0 ? `<button class="delete-group" data-group="${group.name}">Delete</button>` : "";
            $('#group-list').append(`<li>${group.name}: ${groupExpense.toFixed(2)} ${deleteButton}</li>`);
        });

        $('#total-expenses').text(totalExpense.toFixed(2));
        $('#total-expenses-month').text(totalThisMonth.toFixed(2));
        $('#highest-spending').text(`${highestSpendingGroup.name} (${highestSpendingGroup.total.toFixed(2)})`);
    }

    function loadGroupSelect() {
        $('#group-select').empty();
        groups.forEach(group => {
            $('#group-select').append(`<option value="${group.name}">${group.name}</option>`);
        });
    }

    $('#add-group').click(function () {
        const groupName = $('#group-name').val().trim();
        if (groupName) {
            groups.push({ name: groupName });
            localStorage.setItem('groups', JSON.stringify(groups));

            $('#group-name').val('');
            updateDashboard();
            loadGroupSelect();
        }
    });

    $(document).on('click', '.delete-group', function () {
        const groupName = $(this).data('group');
        groups = groups.filter(group => group.name !== groupName);
        localStorage.setItem('groups', JSON.stringify(groups));

        updateDashboard();
        loadGroupSelect();
    });

    $('#add-expense').click(function () {
        const groupName = $('#group-select').val();
        const expenseName = $('#expense-name').val().trim();
        const expenseAmount = parseFloat($('#expense-amount').val());
        const expenseDate = $('#expense-date').val();

        if (groupName && expenseName && expenseAmount && expenseDate) {
            const newExpense = { group: groupName, name: expenseName, amount: expenseAmount, date: expenseDate };
            expenses.push(newExpense);
            localStorage.setItem('expenses', JSON.stringify(expenses));

            $('#expense-name').val('');
            $('#expense-amount').val('');
            $('#expense-date').val('');
            updateDashboard();

            if ($('#group-expense-details').is(':visible')) {
                reloadExpenseTable();
            }
        }
    });

    $(document).on('click', '.delete-expense', function () {
        const expenseKey = $(this).data('expense');

        expenses = expenses.filter(expense => `${expense.name}-${expense.date}` !== expenseKey);
        localStorage.setItem('expenses', JSON.stringify(expenses));

        updateDashboard();
        reloadExpenseTable();
    });

    $('#toggle-group-expenses').click(function () {
        const $tableContainer = $('#group-expense-details');

        if ($tableContainer.is(':hidden')) {
            reloadExpenseTable();
        }

        $tableContainer.toggle();
    });

    function reloadExpenseTable() {
        const $tableContainer = $('#group-expense-details');
        $tableContainer.empty();
        
        const table = $('<table></table>');
        const tableHeader = `
            <thead>
                <tr style="background-color: #2c5282; color: white;">
                    <th>Group</th>
                    <th>Expense Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
        `;
        const tableBody = $('<tbody></tbody>');

        groups.forEach(group => {
            let groupExpense = 0;
            let hasExpenses = false;

            expenses.forEach(expense => {
                if (expense.group === group.name) {
                    hasExpenses = true;
                    groupExpense += parseFloat(expense.amount);

                    const row = `
                        <tr data-expense="${expense.name}-${expense.date}">
                            <td>${expense.group}</td>
                            <td>${expense.name}</td>
                            <td>${expense.amount.toFixed(2)}</td>
                            <td>${expense.date}</td>
                            <td><button class="delete-expense" data-expense="${expense.name}-${expense.date}">Delete</button></td>
                        </tr>
                    `;
                    tableBody.append(row);
                }
            });

            if (hasExpenses) {
                const totalRow = `
                    <tr style="font-weight: bold; background-color: #e2e8f0;">
                        <td colspan="3">Total for ${group.name}</td>
                        <td colspan="2">${groupExpense.toFixed(2)}</td>
                    </tr>
                `;
                tableBody.append(totalRow);
            }
        });

        table.append(tableHeader).append(tableBody);
        $tableContainer.append(table);
    }

    loadGroupSelect();
    updateDashboard();
});
