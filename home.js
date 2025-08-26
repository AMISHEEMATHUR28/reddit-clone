const overlay = document.getElementById("overlay");
const addPostButton = document.querySelector(".add-post-button");
const closeButton = document.getElementById("close-button");
const submitButtonPopup = document.getElementById("submit-post-popup");
const postTitleInputPopup = document.getElementById("post-title-popup");
const postContentInputPopup = document.getElementById("post-content-popup");
const postImageInputPopup = document.getElementById("post-image-popup");
const postsContainer = document.getElementById("posts");

let currentEditedPost = null;

// ================== EVENT LISTENERS ================== //
addPostButton.addEventListener("click", () => {
  // Clear popup inputs
  postTitleInputPopup.value = "";
  postContentInputPopup.value = "";
  postImageInputPopup.value = "";
  submitButtonPopup.textContent = "Submit";
  submitButtonPopup.removeEventListener("click", saveEditedPost);
  submitButtonPopup.addEventListener("click", createPostPopup);

  overlay.style.display = "flex";
});

closeButton.addEventListener("click", () => {
  overlay.style.display = "none";
});

submitButtonPopup.addEventListener("click", createPostPopup);

// ================== CREATE POST ================== //
function createPostPopup() {
  const title = postTitleInputPopup.value;
  const content = postContentInputPopup.value;
  const imageFile = postImageInputPopup.files[0];

  if (title && content) {
    const postElement = document.createElement("div");
    postElement.className = "post";
    postElement.innerHTML = `
      <div class="newpost">
        <h3 class="post-title">${title}</h3><hr>
        <p class="post-content">${content}</p>
        ${
          imageFile
            ? `<img src="${URL.createObjectURL(
                imageFile
              )}" alt="Post Image" style="max-width: 100%;">`
            : ""
        }
        <div class="votes">
          <span class="upvote"><i class="fa-solid fa-up-long" style="color: white;"></i></span>
          <span class="vote-count">0</span>
          <span class="downvote"><i class="fa-solid fa-down-long" style="color: white;"></i></span>
          <button class="edit-button" title="Edit"><i class="fa-solid fa-pen-to-square fa-xl" style="color: white;"></i></button>
          <button class="delete-button" title="Delete"><i class="fa-regular fa-trash-can fa-xl" style="color: white;"></i></button>
        </div>
      </div>
    `;

    // Add event listeners
    addVoteListeners(postElement);

    const editButton = postElement.querySelector(".edit-button");
    editButton.addEventListener("click", () => {
      currentEditedPost = postElement;
      editPost(postElement);
    });

    const deleteButton = postElement.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
      postsContainer.removeChild(postElement);
    });

    // Add new post to the top
    postsContainer.insertBefore(postElement, postsContainer.firstChild);

    // Hide overlay
    overlay.style.display = "none";
  }
}

// ================== VOTING LOGIC ================== //
function addVoteListeners(postElement) {
  const upvoteButton = postElement.querySelector(".upvote");
  const downvoteButton = postElement.querySelector(".downvote");
  const voteCountSpan = postElement.querySelector(".vote-count");

  upvoteButton.addEventListener("click", () => {
    let currentCount = parseInt(voteCountSpan.textContent);
    currentCount++; // always increment
    voteCountSpan.textContent = currentCount;
    reorderPosts();
  });

  downvoteButton.addEventListener("click", () => {
    let currentCount = parseInt(voteCountSpan.textContent);
    currentCount--; // always decrement
    voteCountSpan.textContent = currentCount;
    reorderPosts();
  });
}

// Attach voting to already existing static posts
document.querySelectorAll(".post").forEach((post) => {
  addVoteListeners(post);
});

// ================== REORDER POSTS ================== //
function reorderPosts() {
  const postElements = Array.from(document.querySelectorAll(".post"));
  postElements.sort((a, b) => {
    const aVoteCount = parseInt(a.querySelector(".vote-count").textContent);
    const bVoteCount = parseInt(b.querySelector(".vote-count").textContent);
    return bVoteCount - aVoteCount;
  });

  postElements.forEach((post) => {
    postsContainer.removeChild(post);
    postsContainer.appendChild(post);
  });
}

// ================== EDIT POST ================== //
function saveEditedPost() {
  if (currentEditedPost) {
    const title = postTitleInputPopup.value;
    const content = postContentInputPopup.value;

    if (title && content) {
      const postTitle = currentEditedPost.querySelector(".post-title");
      const postContent = currentEditedPost.querySelector(".post-content");

      postTitle.textContent = title;
      postContent.textContent = content;

      // Reset submit button
      submitButtonPopup.textContent = "Submit";
      submitButtonPopup.removeEventListener("click", saveEditedPost);
      submitButtonPopup.addEventListener("click", createPostPopup);

      overlay.style.display = "none";
      currentEditedPost = null;
    }
  }
}

function editPost(postElement) {
  overlay.style.display = "flex";

  const postTitle = postElement.querySelector(".post-title").textContent;
  const postContent = postElement.querySelector(".post-content").textContent;

  postTitleInputPopup.value = postTitle;
  postContentInputPopup.value = postContent;

  submitButtonPopup.textContent = "Save";
  submitButtonPopup.removeEventListener("click", createPostPopup);
  submitButtonPopup.addEventListener("click", saveEditedPost);
}

// ================== MOBILE MENU ================== //
function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
