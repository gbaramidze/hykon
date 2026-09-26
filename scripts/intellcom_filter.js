$(document).ready(function() {

    updateButtonState();

    // ფასის და რიცხვობრივი სლაიდერის გამართვა
    $(".slider-range").each(function() {
        var $slider = $(this);
        var sliderId = $slider.attr('id').split('-')[2]; 
        var $minInput = $('.input-min[data-slider-id="' + sliderId + '"]');
        var $maxInput = $('.input-max[data-slider-id="' + sliderId + '"]');

        var $minHiddenInput = $('#min_' + sliderId);
        var $maxHiddenInput = $('#max_' + sliderId);

        var step = (sliderId == 'price') ? 0.001 : 1;
       
        var min = parseFloat($("[id^='range-slider-min-" + sliderId + "']").text(), 10) || 0;
        var max = parseFloat($("[id^='range-slider-max-" + sliderId + "']").text(), 10) || 0;
        
        // Initialize the slider
        $slider.slider({
            range: true,
            min: min,
            max: max,
            step: step,
            values: [
                parseFloat($minInput.val()) || min,
                parseFloat($maxInput.val()) || max
            ],
            slide: function(event, ui) {
                if (sliderId == 'price') {
                    $minInput.val(ui.values[0].toFixed(2));
                    $maxInput.val(ui.values[1].toFixed(2));
                    $minHiddenInput.val(ui.values[0].toFixed(2));
                    $maxHiddenInput.val(ui.values[1].toFixed(2));
                } else {
                    $minInput.val(ui.values[0]);
                    $maxInput.val(ui.values[1]);
                    $minHiddenInput.val(ui.values[0]);
                    $maxHiddenInput.val(ui.values[1]);
                }
                activateButton();
                
            }
        });

        
        $minInput.add($maxInput).on("input", function() {
            let minVal = parseFloat($minInput.val());
            let maxVal = parseFloat($maxInput.val());

            // შემოწმება მინიმალური მნიშვნელობა მეტი ხომ არაა მაქსიმალურზე
            if (minVal > maxVal) {
                minVal = maxVal;
                if(sliderId == 'price') {
                    
                    $minInput.val(minVal.toFixed(2));
                }else{
                    $minInput.val(minVal);
                }
            }

            // შემოწმება რეალურ მინიმალურ მნიშვნელობაზე ნაკლები ხომ არ არის არჩეული
            if(minVal < min) {
                if(sliderId == 'price') {
                    $minInput.val(min.toFixed(2));
                }else{
                    $minInput.val(min);
                }
            }

            // შემოწმება რეალურ მაქსიმალურ მნიშვნელობაზე ნაკლები ხომ არ არის არჩეული
            if(maxVal > max) {
                if(sliderId == 'price') {
                    $maxInput.val(max.toFixed(2));
                }else{
                    $maxInput.val(max);
                }
            }

            // Update the slider values
            if(sliderId == 'price') {
                $slider.slider("values", [parseFloat(minVal.toFixed(2)), parseFloat(maxVal.toFixed(2))]);
                $minHiddenInput.val(minVal.toFixed(2));
                $maxHiddenInput.val(maxVal.toFixed(2));
            }else{
                $slider.slider("values", [parseFloat(minVal), parseFloat(maxVal)]);
                $minHiddenInput.val(minVal);
                $maxHiddenInput.val(maxVal);
            }

        });
    });

    // დიაპაზონის ტიპის სლაიდერის გამართვა
    function initializeSlider(sliderId, labelId, minSelector, maxSelector, defaultValue) {
        var $slider = $(sliderId);
        var $label = $(labelId);

        var min = parseFloat($(minSelector).text(), 10) || 0;
        var max = parseFloat($(maxSelector).text(), 10) || 0;
        var value = parseFloat($label.val(), 10) || defaultValue;

        // Initialize the slider
        $slider.slider({
            range: "min",
            value: value,
            min: min,
            max: max,
            slide: function(event, ui) {
                $label.val(ui.value);
                validateSlider(ui.value, min, max, $slider, $label);
                activateButton();
            }
        });

        $label.on("input", function() {
            var value = parseFloat($(this).val(), 10);
            if (!isNaN(value)) {
                value = Math.max(min, Math.min(max, value));
                $slider.slider("value", value);
                $(this).val(value);
            }
        });
    }

    // დიაპაზონის სლაიდერის ვალიდაცია
    function validateSlider(value, min, max, $slider, $label) {
        if (value < min) {
            $slider.slider("value", min);
            $label.val(min);
        } else if (value > max) {
            $slider.slider("value", max);
            $label.val(max);
        }
    }

    // Initialize all min-price sliders
    $("[id^='min-price-slider']").each(function() {
        var id = $(this).attr("id");
        var index = id.split('-').pop(); // Extract the index from the ID
        initializeSlider("#" + id, "#min-price-label-" + index, "#min_min-" + index, "#min_max-" + index, 0);
    });

    // Initialize all max-price sliders
    $("[id^='max-price-slider']").each(function() {
        var id = $(this).attr("id");
        var index = id.split('-').pop(); // Extract the index from the ID
        initializeSlider("#" + id, "#max-price-label-" + index, "#max_min-" + index, "#max_max-" + index, 0);
    });
    
    $('#filter_form input').on('input', function() {
        activateButton();
    });
    

    // გაფილტვრის ღილაკის გააქტიურება
    function updateButtonState() {
        const $filterBtn = $('.filter-btn');

        if (localStorage.getItem('filter_button') == 1) {
            $filterBtn.removeClass('disabled').addClass('active').prop('disabled', false);
        } else {
            $filterBtn.removeClass('active').addClass('disabled').prop('disabled', true);
        }

        // Add hover effect
        $('.filter-btn-block .filter-btn').hover(
            function() {
                if (!$filterBtn.hasClass('disabled')) {
                    $(this).addClass('hover');
                }
            },
            function() {
                $(this).removeClass('hover');
            }
        );
    }

    // სთორიჯში ღილაკის აქტიურობის შენახვა 
    function activateButton() {
        localStorage.setItem('filter_button', 1);
        updateButtonState();
    }
    
});



