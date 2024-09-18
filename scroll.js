$(document).ready(function() {
    // Инициализация Select2
    $('.currency-select').select2({
        width: 'resolve'
    });

    // Дополнительная функция для обеспечения прокрутки
    function ensureScroll() {
        $('.select2-results__options').each(function() {
            $(this).css({
                'max-height': '200px',
                'overflow-y': 'auto'
            });
        });
    }

    // Обработчик событий для обеспечения прокрутки
    $('.currency-select').on('select2:open', function() {
        ensureScroll();
    });
});