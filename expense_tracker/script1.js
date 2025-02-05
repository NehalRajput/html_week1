$(document).ready(function() {
    let groups = loadData() || [];

    // Add Group Button
    $('#addGroupBtn').click(function() {
        const groupName = prompt('Enter Group Name:');
        if (groupName && !groups.some(group => group.name === groupName)) {
            const groupId = Date.now();  // Unique ID based on timestamp
            const newGroup = {
                id: groupId,
                name: groupName,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                expenses: []
            };
            groups.push(newGroup);
            saveData();
            renderGroups();
        } else {
            alert('Group name is either empty or already exists.');
        }
    });

    // Render Groups to the UI
    function renderGroups() {
        $('#groupList').empty();
        const searchQuery = $('#search').val().toLowerCase();  // Get the search query
        groups.filter(group => group.name.toLowerCase().includes(searchQuery)).forEach(group => {
            const groupHTML = `
                <div class="bg-white p-6 rounded-lg shadow-md mb-4">
                    <div class="flex justify-between">
                        <h3 class="font-semibold text-xl">${group.name}</h3>
                        <div class="space-x-2">
                            <button class="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700" onclick="openExpenseModal(${group.id})">Add Expense</button>
                            <button class="bg-yellow-600 text-white p-2 rounded-lg hover:bg-yellow-700" onclick="editGroup(${group.id})">Edit</button>
                            <button class="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700" onclick="deleteGroup(${group.id})">Delete</button>
                        </div>
                    </div>
                    <div class="mt-2 text-gray-500">Created At: ${new Date(group.createdAt).toLocaleString()}</div>
                    <div class="mt-2 text-gray-500">Updated At: ${new Date(group.updatedAt).toLocaleString()}</div>

                    <!-- Expenses Table -->
                    <div class="mt-4">
                        <h4 class="font-semibold text-lg">Expenses</h4>
                        <table class="w-full mt-2 table-auto border-collapse">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="border px-4 py-2 text-left">Expense Name</th>
                                    <th class="border px-4 py-2 text-right">Amount</th>
                                    <th class="border px-4 py-2 text-left">Date</th>
                                    <th class="border px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${group.expenses.length === 0 ? `
                                    <tr>
                                        <td colspan="4" class="text-center text-gray-500">No expenses added yet</td>
                                    </tr>` : group.expenses.map(exp => `
                                    <tr>
                                        <td class="border px-4 py-2">${exp.name}</td>
                                        <td class="border px-4 py-2 text-right">${exp.amount.toLocaleString()}</td>
                                        <td class="border px-4 py-2">${new Date(exp.date).toLocaleDateString()}</td>
                                        <td class="border px-4 py-2 text-center">
                                            <button class="bg-yellow-600 text-white p-2 rounded-lg hover:bg-yellow-700" onclick="editExpense(${exp.id}, ${group.id})">Edit</button>
                                            <button class="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 ml-2" onclick="confirmDeleteExpense(${exp.id}, ${group.id})">Delete</button>
                                        </td>
                                    </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-2 font-semibold">Total Group Expense: <span>${getTotalExpense(group.id).toLocaleString()}</span></div>
                </div>
            `;
            $('#groupList').append(groupHTML);
        });
    }

    // Edit Group
    window.editGroup = function(groupId) {
        const group = groups.find(group => group.id === groupId);
        const newName = prompt('Edit Group Name:', group.name);
        if (newName && newName !== group.name) {
            group.name = newName;
            group.updatedAt = new Date().toISOString();
            saveData();
            renderGroups();
        }
    };

    // Delete Group
    window.deleteGroup = function(groupId) {
        groups = groups.filter(group => group.id !== groupId);
        saveData();
        renderGroups();
    };

    // Open Modal for Adding Expense
    window.openExpenseModal = function(groupId) {
        $('#expenseModal').removeClass('hidden');
        $('#expenseForm').off('submit').on('submit', function(e) {
            e.preventDefault();
            addExpense(groupId);
        });
    };

    // Add Expense
    function addExpense(groupId) {
        const expenseName = $('#expenseName').val();
        const expenseAmount = parseFloat($('#expenseAmount').val());
        const expenseDate = $('#expenseDate').val();
        
        if (expenseName && expenseAmount && expenseDate) {
            const expenseId = Date.now();  // Unique ID for expense
            const newExpense = {
                id: expenseId,
                name: expenseName,
                amount: expenseAmount,
                date: expenseDate
            };
            
            const group = groups.find(group => group.id === groupId);
            group.expenses.push(newExpense);
            group.updatedAt = new Date().toISOString();
            saveData();
            renderGroups();
            updateDashboard();
            $('#expenseModal').addClass('hidden');
            $('#expenseForm')[0].reset();
        } else {
            alert('Please fill in all fields correctly.');
        }
    }

    // Edit Expense
    window.editExpense = function(expenseId, groupId) {
        const group = groups.find(group => group.id === groupId);
        const expense = group.expenses.find(exp => exp.id === expenseId);
        if (expense) {
            $('#expenseName').val(expense.name);
            $('#expenseAmount').val(expense.amount);
            $('#expenseDate').val(expense.date);
            $('#expenseModal').removeClass('hidden');
            $('#expenseForm').off('submit').on('submit', function(e) {
                e.preventDefault();
                expense.name = $('#expenseName').val();
                expense.amount = parseFloat($('#expenseAmount').val());
                expense.date = $('#expenseDate').val();
                group.updatedAt = new Date().toISOString();
                saveData();
                renderGroups();
                updateDashboard();
                $('#expenseModal').addClass('hidden');
                $('#expenseForm')[0].reset();
            });
        }
    };

    // Confirm and Delete Expense
    window.confirmDeleteExpense = function(expenseId, groupId) {
        if (confirm("Are you sure you want to delete this expense?")) {
            deleteExpense(expenseId, groupId);
        }
    };

    // Delete Expense
    function deleteExpense(expenseId, groupId) {
        const group = groups.find(group => group.id === groupId);
        group.expenses = group.expenses.filter(exp => exp.id !== expenseId);
        group.updatedAt = new Date().toISOString();
        saveData();
        renderGroups();
        updateDashboard();
    }

    // Update Dashboard with Latest Data
    function updateDashboard() {
        let totalThisMonth = 0;
        let highestSpending = 0;
        let totalAllTime = 0;

        groups.forEach(group => {
            group.expenses.forEach(expense => {
                const expenseDate = new Date(expense.date);
                const currentMonth = new Date().getMonth();
                totalAllTime += expense.amount;

                if (expenseDate.getMonth() === currentMonth) {
                    totalThisMonth += expense.amount;
                    highestSpending = Math.max(highestSpending, expense.amount);
                }
            });
        });

        $('#totalThisMonth').text(totalThisMonth.toLocaleString());
        $('#highestSpending').text(highestSpending.toLocaleString());
        $('#totalAllTime').text(totalAllTime.toLocaleString());
    }

    // Get Total Expense for a Group
    function getTotalExpense(groupId) {
        const group = groups.find(group => group.id === groupId);
        return group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }

    // Handle Search Input
    $('#search').on('input', function() {
        renderGroups();
    });

    // Load data from localStorage
    function loadData() {
        const storedData = localStorage.getItem('expenseTrackerData');
        return storedData ? JSON.parse(storedData) : null;
    }

    // Save data to localStorage
    function saveData() {
        localStorage.setItem('expenseTrackerData', JSON.stringify(groups));
    }

    // Initial Render
    renderGroups();
    updateDashboard();
});
