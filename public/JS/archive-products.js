document.querySelectorAll('.filter-header').forEach((header, index) => {
    const group = header.parentElement;
    if(index === 0 || index === 1) {
        group.classList.add('active');
    }
    header.addEventListener('click', () => {
        group.classList.toggle('active');
    });
});


const minPriceSlider = document.getElementById('minPrice');
const maxPriceSlider = document.getElementById('maxPrice');
const minPriceValue = document.getElementById('minPriceValue');
const maxPriceValue = document.getElementById('maxPriceValue');

function formatPrice(value) {
    return `$${parseInt(value).toLocaleString()}`;
}

function updatePriceValues() {
    let minVal = parseInt(minPriceSlider.value);
    let maxVal = parseInt(maxPriceSlider.value);

    if (minVal > maxVal) {
        [minVal, maxVal] = [maxVal, minVal]; // swap if crossed
    }

    minPriceValue.textContent = formatPrice(minVal);
    maxPriceValue.textContent = formatPrice(maxVal);
}

minPriceSlider.addEventListener('input', updatePriceValues);
maxPriceSlider.addEventListener('input', updatePriceValues);

updatePriceValues(); // initialize on load