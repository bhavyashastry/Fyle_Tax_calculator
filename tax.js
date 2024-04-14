document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('taxForm');
    const modal = document.getElementById('resultModal');
    const closeModal = document.querySelector('.close');
    const output = document.getElementById('output');
    const resetButton = document.getElementById('resetForm');

    // Add event listeners for input fields to validate as the user types
    const inputFields = document.querySelectorAll('.form-control');
    inputFields.forEach(field => {
        field.addEventListener('input', function () {
            validateInput(this);
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        hideErrorIcons();
        validateInputs(); // Validate input before calculation
    });

    resetButton.addEventListener('click', function () {
        form.reset(); // Reset the form fields
        output.innerHTML = ''; // Clear any previous output
        hideErrorIcons(); // Hide error icons on reset
    });

    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    function validateInput(input) {
        const inputValue = input.value.trim();
        const errorId = input.id + 'Error';

        if (!inputValue) {
            displayErrorIcon(input, errorId, 'This field is mandatory. Please enter a value.');
        } else if (!isValidNumber(inputValue)) {
            displayErrorIcon(input, errorId, 'Invalid input! Only numeric values allowed.');
        } else {
            hideErrorIcon(errorId);
        }
    }

    function validateInputs() {
        const grossIncomeInput = document.getElementById('grossIncome');
        const extraIncomeInput = document.getElementById('extraIncome');
        const deductionsInput = document.getElementById('deductions');
        const ageGroupSelect = document.getElementById('ageGroup');

        validateInput(grossIncomeInput);
        validateInput(extraIncomeInput);
        validateInput(deductionsInput);

        if (ageGroupSelect.value === '') {
            displayErrorIcon(ageGroupSelect, 'ageGroupError', 'Please select an age group.');
        } else {
            hideErrorIcon('ageGroupError');
        }

        const hasError = document.querySelector('.invalid-input') !== null;

        if (!hasError) {
            calculateTax(parseFloat(grossIncomeInput.value.trim()), parseFloat(extraIncomeInput.value.trim()), ageGroupSelect.value, parseFloat(deductionsInput.value.trim()));
        }
    }

    function isValidNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    function calculateTax(grossIncome, extraIncome, ageGroup, deductions) {
        const overallIncome = grossIncome + extraIncome - deductions;
        let tax = 0;

        if (overallIncome > 800000) {
            if (ageGroup === 'below40') {
                tax = 0.3 * (overallIncome - 800000);
            } else if (ageGroup === '40to60') {
                tax = 0.4 * (overallIncome - 800000);
            } else if (ageGroup === 'above60') {
                tax = 0.1 * (overallIncome - 800000);
            }
        }

        const netIncome = overallIncome - tax;

        // Prepare content for the modal
        output.innerHTML = `
            <h2></h2>
            <p>Your overall income after tax deductions:</p>
            <p>${netIncome.toFixed(2)}</p>
            <p>Tax Paid:</p>
            <p>${tax.toFixed(2)}</p>
        `;

        // Show the modal
        modal.style.display = 'block';
    }

    function displayErrorIcon(input, errorId, errorMessage) {
        input.classList.add('invalid-input');
        const errorIcon = document.getElementById(errorId);
        if (errorIcon) {
            errorIcon.style.display = 'inline';
            errorIcon.title = errorMessage;
        }
    }

    function hideErrorIcon(errorId) {
        const errorIcon = document.getElementById(errorId);
        if (errorIcon) {
            errorIcon.style.display = 'none';
            errorIcon.title = '';
        }
    }

    function hideErrorIcons() {
        const errorIcons = document.querySelectorAll('.error-icon');
        errorIcons.forEach(icon => {
            icon.style.display = 'none';
            icon.title = '';
        });

        const invalidInputs = document.querySelectorAll('.invalid-input');
        invalidInputs.forEach(input => {
            input.classList.remove('invalid-input');
        });
    }
});
