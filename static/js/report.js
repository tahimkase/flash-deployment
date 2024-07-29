// Copy data from the main form to the report form before submitting
document.getElementById('report-form').addEventListener('submit', function (event) {
    const mainForm = document.getElementById('budget-form');
    const reportForm = document.getElementById('report-form');

    // Copy income
    reportForm.querySelector('input[name="income"]').value = mainForm.querySelector('input[name="income"]').value;

    // Clear previous hidden expense fields
    document.getElementById('hidden-expenses').innerHTML = '';

    // Copy expenses
    const expenseTypes = mainForm.querySelectorAll('input[name="expense_type[]"]');
    const expenseAmounts = mainForm.querySelectorAll('input[name="expense_amount[]"]');
    expenseTypes.forEach((typeInput, index) => {
        const amountInput = expenseAmounts[index];

        // Create hidden inputs for each expense type and amount
        const hiddenTypeInput = document.createElement('input');
        hiddenTypeInput.type = 'hidden';
        hiddenTypeInput.name = 'expense_type[]';
        hiddenTypeInput.value = typeInput.value;

        const hiddenAmountInput = document.createElement('input');
        hiddenAmountInput.type = 'hidden';
        hiddenAmountInput.name = 'expense_amount[]';
        hiddenAmountInput.value = amountInput.value;

        // Append hidden inputs to the report form
        document.getElementById('hidden-expenses').appendChild(hiddenTypeInput);
        document.getElementById('hidden-expenses').appendChild(hiddenAmountInput);
    });
});