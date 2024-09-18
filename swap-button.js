function swapCurrencies() {
    const mainCurrency = document.getElementById('mainCurrency').value;
    const targetCurrency = document.getElementById('targetCurrency').value;

    document.getElementById('mainCurrency').value = targetCurrency;
    document.getElementById('targetCurrency').value = mainCurrency;

    $('#mainCurrency').trigger('change'); // Обновить Select2
    $('#targetCurrency').trigger('change'); // Обновить Select2

    convertCurrency();
}
