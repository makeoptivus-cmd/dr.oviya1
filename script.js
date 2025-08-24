// --- Supabase Init ---
const SUPABASE_URL = "https://wzeiduiiesbaacqdyffc.supabase.co"; // replace
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6ZWlkdWlpZXNiYWFjcWR5ZmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNDAzNzYsImV4cCI6MjA3MTYxNjM3Nn0.Xq0v8AXWaRXtxbWiCzbGuE-zYK5ummxEgGI_sK5YstI";           // replace
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Star Rating ---
const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('ratingValue');
let currentRating = 0;

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
        star.style.color = index < rating ? '#fbbf24' : '#d1d5db';
    });
}

// Attach events after DOM ready
window.addEventListener("DOMContentLoaded", () => {
    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.dataset.rating);
            ratingValue.value = currentRating;
            updateStars();
        });
        star.addEventListener('mouseover', () => {
            highlightStars(parseInt(star.dataset.rating));
        });
    });
    document.getElementById('starRating').addEventListener('mouseleave', updateStars);
    loadReviews();
});

// --- Load Reviews ---
async function loadReviews() {
    const { data, error } = await client
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error loading reviews:", error);
        return;
    }

    const reviewsContainer = document.getElementById('reviewsContainer');
    reviewsContainer.innerHTML = "";

    data.forEach(r => {
        const starsHtml = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        const newReview = document.createElement('div');
        newReview.className = 'bg-gray-50 rounded-lg p-6 shadow-md fade-in';
        newReview.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h4 class="font-semibold text-lg text-gray-800">${r.name}</h4>
                <div class="flex text-yellow-400"><span>${starsHtml}</span></div>
            </div>
            <p class="text-gray-600 leading-relaxed">${r.message}</p>
            <p class="text-sm text-gray-400 mt-3">${new Date(r.created_at).toLocaleString()}</p>
        `;
        reviewsContainer.appendChild(newReview);
    });
}

// --- Submit Review ---
document.getElementById('reviewForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('patientName').value.trim();
    const rating = parseInt(document.getElementById('ratingValue').value);
    const message = document.getElementById('reviewMessage').value.trim();

    if (!rating) {
        alert('Please select a rating.');
        return;
    }

    const { error } = await client
        .from('reviews')
        .insert([{ name, rating, message }]);

    if (error) {
        console.error("Save failed:", error);
        alert("Error saving review");
        return;
    }

    this.reset();
    currentRating = 0;
    ratingValue.value = 0;
    updateStars();
    loadReviews();
});
