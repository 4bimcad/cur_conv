        // Инициализация Select2 с отображением флагов
        $(document).ready(function() {
            function formatState(state) {
                if (!state.id) {
                    return state.text;
                }
                var flagUrl = $(state.element).data('flag');
                var $state = $(
                    '<span><img src="' + flagUrl + '" class="flag-icon" /> ' + state.text + '</span>'
                );
                return $state;
            };

            $('.currency-select').select2({
                templateResult: formatState,
                templateSelection: formatState,
                width: 'resolve'
            });

            // Запуск конвертации при изменении суммы
            $('#amount, #mainCurrency, #targetCurrency').on('input change', function() {
                convertCurrency();
            });

            // Загрузка данных из localStorage при загрузке страницы
            loadFromLocalStorage();
        });

        function formatNumber(num) {
            return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        async function convertCurrency() {
            const mainCurrency = document.getElementById('mainCurrency').value;
            const targetCurrency = document.getElementById('targetCurrency').value;
            const amount = parseFloat(document.getElementById('amount').value);

            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = 'Loading...';

            if (!mainCurrency || !targetCurrency || isNaN(amount) || amount <= 0) {
                resultDiv.innerHTML = 'Please enter valid currency and amount.';
                return;
            }

            const apiUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${mainCurrency}.json`;

            try {
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                // Логируем данные для проверки структуры
                console.log('Currency data:', data);

                // Извлечение курса целевой валюты
                const mainCurrencyData = data[mainCurrency];

                // Проверка наличия курса целевой валюты
                if (!mainCurrencyData || mainCurrencyData[targetCurrency] === undefined) {
                    throw new Error(`Rate data for ${targetCurrency.toUpperCase()} not found.`);
                }

                // Получаем курс целевой валюты
                const targetRate = mainCurrencyData[targetCurrency];
                const reverseRate = (1 / targetRate).toFixed(2);

                // Выполняем конвертацию
                const convertedAmount = amount * targetRate;

                resultDiv.innerHTML = `
                    <div class="conversion-result">${formatNumber(amount)} ${mainCurrency.toUpperCase()} = <span class="conversion-result2">${formatNumber(convertedAmount)} ${targetCurrency.toUpperCase()}</span></div>
                    <div class="conversion-info">1 ${mainCurrency.toUpperCase()} = ${formatNumber(targetRate)} ${targetCurrency.toUpperCase()}</div> 
                    <div class="conversion-info">1 ${targetCurrency.toUpperCase()} = ${formatNumber(reverseRate)} ${mainCurrency.toUpperCase()}</div>`;

                updateTimestamp();

                // Сохраняем данные в localStorage
                saveToLocalStorage();
            } catch (error) {
                resultDiv.innerHTML = `Error fetching currency data: ${error.message}`;
            }
        }

        function updateTimestamp() {
            const updateTimeElem = document.getElementById('update-time');
            updateTimeElem.innerHTML = 'Updated at: ' + new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
        }

        function saveToLocalStorage() {
            const mainCurrency = document.getElementById('mainCurrency').value;
            const targetCurrency = document.getElementById('targetCurrency').value;
            const amount = parseFloat(document.getElementById('amount').value);

            localStorage.setItem('mainCurrency', mainCurrency);
            localStorage.setItem('targetCurrency', targetCurrency);
            localStorage.setItem('amount', amount);
        }

        function loadFromLocalStorage() {
            const mainCurrency = localStorage.getItem('mainCurrency');
            const targetCurrency = localStorage.getItem('targetCurrency');
            const amount = localStorage.getItem('amount');

            if (mainCurrency) {
                document.getElementById('mainCurrency').value = mainCurrency;
                $('#mainCurrency').trigger('change'); // Обновить Select2
            }

            if (targetCurrency) {
                document.getElementById('targetCurrency').value = targetCurrency;
                $('#targetCurrency').trigger('change'); // Обновить Select2
            }

            if (amount) {
                document.getElementById('amount').value = amount;
                convertCurrency();
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('swap-btn').addEventListener('click', function() {
                swapCurrencies();
            });
        });
        