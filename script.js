// 🔑 Supabase credentials (replace with yours!)
const SUPABASE_URL = "https://wzeiduiiesbaacqdyffc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6ZWlkdWlpZXNiYWFjcWR5ZmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNDAzNzYsImV4cCI6MjA3MTYxNjM3Nn0.Xq0v8AXWaRXtxbWiCzbGuE-zYK5ummxEgGI_sK5YstI";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ⭐ Star rating functionality
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
    highlightStars(parseInt(star.dataset.rating));
  });
});

document.getElementById('starRating').addEventListener('mouseleave', () => {
  updateStars();
});

function updateStars() {
  stars.forEach((star, index) => {
    if (index < currentRating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

function highlightStars(rating) {
  stars.forEach((star, index) => {
    star.style.color = index < rating ? '#fbbf24' : '#d1d5db';
  });
}

// 📩 Handle review submission
document.getElementById('reviewForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const name = document.getElementById('patientName').value;
  const rating = parseInt(document.getElementById('ratingValue').value);
  const message = document.getElementById('reviewMessage').value;

  if (rating === 0) {
    alert('Please select a rating before submitting your review.');
    return;
  }

  // Save to Supabase
  const { error } = await supabaseClient
    .from('reviews')
    .insert([{ name, rating, message }]);

  if (error) {
    console.error(error);
    alert('Error saving your review!');
    return;
  }

  addReviewToPage(name, rating, message, "Just now");

  this.reset();
  currentRating = 0;
  ratingValue.value = 0;
  updateStars();
});

// ✅ Add review to page
function addReviewToPage(name, rating, message, time) {
  const reviewsContainer = document.getElementById('reviewsContainer');
  const newReview = document.createElement('div');
  newReview.className = 'bg-gray-50 rounded-lg p-3 shadow-md fade-in';
  
  const starsHtml = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  newReview.innerHTML = `
    <div class="flex items-center justify-between mb-2">
      <h4 class="font-semibold">${name}</h4>
      <div class="flex text-yellow-400">
        <span>${starsHtml}</span>
      </div>
    </div>
    <p>${message}</p>
    <p class="text-sm text-gray-400">${time}</p>
  `;

  reviewsContainer.insertBefore(newReview, reviewsContainer.firstChild);
}

// 🚀 Load existing reviews from Supabase
async function loadReviews() {
  const { data, error } = await supabaseClient
    .from('reviews')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(r => {
    addReviewToPage(r.name, r.rating, r.message, "Earlier");
  });
}

loadReviews();
