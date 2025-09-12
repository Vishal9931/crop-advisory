const BASE_URL = "http://localhost:5000"; // backend API (future use)

// Temporary storage (until backend route is added)
let posts = [
  {
    name: "👨‍🌾 Ramesh Kumar",
    question: "My wheat leaves are turning yellow. What should I do?",
    reply: "💡 Expert: Apply Urea 50kg/acre and ensure proper irrigation."
  },
  {
    name: "👩‍🌾 Sunita Devi",
    question: "When is the best time to sow mustard crop?",
    reply: "💡 Expert: Best sowing period is mid-October to early November."
  }
];

// 📌 Render all posts
function renderPosts() {
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  posts.forEach(post => {
    const div = document.createElement("div");
    div.classList.add("post");

    div.innerHTML = `
      <h4>${post.name}</h4>
      <p>${post.question}</p>
      ${post.image ? `<img src="${post.image}" alt="question image" style="max-width:200px;margin-top:5px;">` : ""}
      ${post.reply ? `<div class="reply">${post.reply}</div>` : ""}
    `;
    postsDiv.appendChild(div);
  });
}

// 📝 Post a new question
function postQuestion() {
  const text = document.getElementById("questionText").value.trim();
  const imageInput = document.getElementById("questionImage");

  if (!text) {
    alert("Please enter a question!");
    return;
  }

  let newPost = {
    name: "👨‍🌾 You", // Later replace with logged-in farmer’s name
    question: text,
    reply: null
  };

  // If image uploaded → show it
  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      newPost.image = e.target.result;
      posts.unshift(newPost);
      renderPosts();
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    posts.unshift(newPost);
    renderPosts();
  }

  // Clear form
  document.getElementById("questionForm").reset();
}

// Initial render
document.addEventListener("DOMContentLoaded", renderPosts);
