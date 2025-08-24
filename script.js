<script src="https://unpkg.com/@supabase/supabase-js"></script>
<script>
  const SUPABASE_URL = "https://wzeiduiiesbaacqdyffc.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6ZWlkdWlpZXNiYWFjcWR5ZmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNDAzNzYsImV4cCI6MjA3MTYxNjM3Nn0.Xq0v8AXWaRXtxbWiCzbGuE-zYK5ummxEgGI_sK5YstI";
  const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Save review
  async function saveReview() {
    const name = document.getElementById("name").value;
    const rating = parseInt(document.getElementById("rating").value);
    const message = document.getElementById("message").value;

    const { data, error } = await client
      .from("reviews")
      .insert([{ name, rating, message }]);

    if (error) {
      console.error("Insert error:", error);
      alert("Error saving review: " + error.message);
    } else {
      console.log("Saved:", data);
      alert("Review saved!");
      loadReviews();
    }
  }

  // Load reviews
  async function loadReviews() {
    const { data, error } = await client
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Select error:", error);
      return;
    }

    const list = document.getElementById("reviews");
    list.innerHTML = "";
    data.forEach(r => {
      const li = document.createElement("li");
      li.textContent = `${r.name} (${r.rating}/5): ${r.message}`;
      list.appendChild(li);
    });
  }

  // load reviews when page loads
  document.addEventListener("DOMContentLoaded", loadReviews);
</script>
