// Star rating functionality
const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('ratingValue');
let currentRating = 0;

stars.forEach(star => {
    star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.rating);
        ratingValue.value = currentRating;
        updateStars();
    });

    star.addEventListener('mouseover', () => {
        const hoverRating = parseInt(star.dataset.rating);
        highlightStars(hoverRating);
    });
});

document.getElementById('starRating').addEventListener('mouseleave', () => {
    updateStars();
});

function updateStars() {
    stars.forEach((star, index) => {
        if (index < currentRating) {
            star.classList.add('active');
            star.classList.remove('text-gray-300');
        } else {
            star.classList.remove('active');
            star.classList.add('text-gray-300');
        }
    });
}

function highlightStars(rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = '#fbbf24';
        } else {
            star.style.color = '#d1d5db';
        }
    });
}

// Review submission functionality
document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('patientName').value;
    const rating = parseInt(document.getElementById('ratingValue').value);
    const message = document.getElementById('reviewMessage').value;

    if (rating === 0) {
        alert('Please select a rating before submitting your review.');
        return;
    }

    // Create new review element
    const reviewsContainer = document.getElementById('reviewsContainer');
    const newReview = document.createElement('div');
    newReview.className = 'bg-gray-50 rounded-lg p-6 shadow-md fade-in';
    
    const starsHtml = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    
    newReview.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h4 class="font-semibold text-lg text-gray-800">${name}</h4>
            <div class="flex text-yellow-400">
                <span>${starsHtml}</span>
            </div>
        </div>
        <p class="text-gray-600 leading-relaxed">${message}</p>
        <p class="text-sm text-gray-400 mt-3">Just now</p>
    `;

    // Add new review at the top
    reviewsContainer.insertBefore(newReview, reviewsContainer.firstChild);

    // Reset form
    this.reset();
    currentRating = 0;
    ratingValue.value = 0;
    updateStars();

    // Show success message
    alert('Thank you for your review! It has been added successfully.');
});