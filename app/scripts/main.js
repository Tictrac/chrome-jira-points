$(function() {

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var columnContainerSelector = '#ghx-pool-column',
        headersSelector = '#ghx-column-headers .ghx-column',
        pointsClass = 'aui-badge',
        pointsSelector = '.' + pointsClass,
        debouncedFunction,
        observer,
        count = 0;

    // Set up the DOM observer
    debouncedFunction = debounce(checkForBoard, 50);
    observer = new MutationObserver(debouncedFunction);
    observer.observe(document, {
      subtree: true,
      attributes: true
    });

    /**
     * Check if the page contains a board, and generate
     * points if it does
     */
    function checkForBoard() {
        // If the page has columns, we can generate points
        if ($(columnContainerSelector).length) {
            // Trigger the generation of points
            generatePoints();
        }
    }

    /**
     * Generate the total points for each column;
     */
    function generatePoints() {
        var headers,
            header,
            column,
            points,
            total,
            value,
            headerPoints;

        // Get headers
        headers = $(headersSelector);

        // Loop over each header
        $.each(headers, function() {
            $header = $(this);

            // Get the column from the header ID
            column = $('li[data-column-id=' + $header.attr('data-id') + ']');

            // Get the points inside the column
            points = column.find(pointsSelector);

            // Total up the points in the column
            total = 0;
            points.each(function() {
                value = parseInt($(this).text());
                if (!isNaN(value)) {
                    total += value;
                }
            });

            // Add or update points
            headerPoints = $header.find(pointsSelector);
            if (headerPoints.length) {
                headerPoints.text(total);
            } else {
                $header.append($('<span />').addClass(pointsClass).html(total));
            }
        });
    }

    /**
     * Utility debounce function
     * @param  {Function} func
     * @param  {Integer} wait
     * @param  {Boolean} immediate
     * @return {Function}
     */
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
});
