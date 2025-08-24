// Initialize Supabase
const SUPABASE_URL = "https://wzeiduiiesbaacqdyffc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6ZWlkdWlpZXNiYWFjcWR5ZmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNDAzNzYsImV4cCI6MjA3MTYxNjM3Nn0.Xq0v8AXWaRXtxbWiCzbGuE-zYK5ummxEgGI_sK5YstI";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Load reviews on page load
async function loadReviews() {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error loading reviews:", error);
        return;
    }

    const reviewsContainer = document.getElementById('reviewsContainer');
    reviewsContainer.innerHTML = ""; // clear placeholder

    data.forEach(r => {
        const starsHtml = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        const newReview = document.createElement('div');
        newReview.className = 'bg-gray-50 rounded-lg p-6 shadow-md fade-in';
        newReview.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h4 class="font-semibold text-lg text-gray-800">${r.name}</h4>
                <div class="flex text-yellow-400">
                    <span>${starsHtml}</span>
                </div>
            </div>
            <p class="text-gray-600 leading-relaxed">${r.message}</p>
            <p class="text-sm text-gray-400 mt-3">${new Date(r.created_at).toLocaleString()}</p>
        `;
        reviewsContainer.appendChild(newReview);
    });
}

// Submit review to Supabase
document.getElementById('reviewForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('patientName').value;
    const rating = parseInt(document.getElementById('ratingValue').value);
    const message = document.getElementById('reviewMessage').value;

    if (rating === 0) {
        alert('Please select a rating before submitting your review.');
        return;
    }

    const { error } = await supabase
        .from('reviews')
        .insert([{ name, rating, message }]);

    if (error) {
        console.error("Error saving review:", error);
        alert("Error saving review. Try again.");
        return;
    }

    // Reload reviews
    loadReviews();

    // Reset form
    this.reset();
    currentRating = 0;
    ratingValue.value = 0;
    updateStars();
    alert('Thank you for your review!');
});

// Call on page load
window.addEventListener("DOMContentLoaded", loadReviews);

