// scripts.js

// Function to initialize the pie chart
function initChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    window.myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [], // Initialize with empty labels
            datasets: [{
                label: 'Expense Distribution',
                data: [], // Initialize with empty data
                backgroundColor: [], // Initialize with empty colors
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20,
                        boxWidth: 10,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            let label = tooltipItem.label || '';
                            let value = tooltipItem.raw || 0;
                            return `${label}: $${value}`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Budget Pie Chart',
                    font: {
                        size: 18
                    }
                }
            }
        }
    });
}

// Function to add a new expense entry
function addExpense() {
    const expensesContainer = document.getElementById('expenses');
    const newDiv = document.createElement('div');
    newDiv.className = 'expense-entry';
    newDiv.innerHTML = `
        <input type="text" name="expense_type[]" placeholder="Expense Type" required>
        <input type="number" name="expense_amount[]" placeholder="Amount" required>
        <button type="button" class="btn-delete" onclick="deleteExpense(this)"><i class="fas fa-trash-alt"></i> Delete</button>
    `;
    expensesContainer.appendChild(newDiv);
    updateChart(); // Update the chart every time a new expense is added
}

// Function to delete an expense entry
function deleteExpense(element) {
    element.parentNode.remove();
    updateChart(); // Update the chart every time an expense is removed
}

// Function to update the pie chart with new data
function updateChart() {
    const expenses = document.querySelectorAll('#expenses input[type="number"]');
    const types = document.querySelectorAll('#expenses input[type="text"]');
    const totalExpenses = Array.from(expenses).reduce((acc, input) => acc + Number(input.value), 0);

    const data = Array.from(expenses).map(input => Number(input.value));
    const labels = Array.from(types).map(input => input.value);

    window.myPieChart.data.labels = labels;
    window.myPieChart.data.datasets[0].data = data;
    window.myPieChart.data.datasets.forEach(dataset => {
        dataset.backgroundColor = labels.map(() => getRandomColor()); // Apply random colors
    });

    window.myPieChart.options.plugins.tooltip.callbacks.label = function(tooltipItem) {
        return `${tooltipItem.label}: $${tooltipItem.raw}`;
    };
    window.myPieChart.options.plugins.title.text = `Total Expenses: $${totalExpenses.toFixed(2)}`;

    window.myPieChart.update();

    // Update savings display
    const income = parseFloat(document.querySelector('input[name="income"]').value) || 0;
    const savings = income - totalExpenses;
    document.getElementById('savings').innerText = `${savings.toFixed(2)}`;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Ensure the chart initializes when the document is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initChart();

    // Load data from local storage if available
    const savedData = JSON.parse(localStorage.getItem('budgetData')) || {};
    if (savedData.income) {
        document.querySelector('input[name="income"]').value = savedData.income;
    }
    if (savedData.expenses) {
        savedData.expenses.forEach(expense => {
            addExpense();
            const lastExpense = document.querySelector('#expenses .expense-entry:last-child');
            lastExpense.querySelector('input[name="expense_type[]"]').value = expense.type;
            lastExpense.querySelector('input[name="expense_amount[]"]').value = expense.amount;
        });
    }
    updateChart();
});

// Save data to local storage before page unload
window.addEventListener('beforeunload', function() {
    const income = document.querySelector('input[name="income"]').value;
    const expenses = Array.from(document.querySelectorAll('#expenses .expense-entry')).map(entry => {
        return {
            type: entry.querySelector('input[name="expense_type[]"]').value,
            amount: entry.querySelector('input[name="expense_amount[]"]').value
        };
    });
    const budgetData = { income, expenses };
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
});



function toggleMenu() {
    var menu = document.getElementById('menu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}


// Optional: Function to toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}
















