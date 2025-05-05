document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".card").forEach(card => {
    const id = card.getAttribute("data-id");

    // Load Likes
    const likeCount = card.querySelector(".like-count");
    likeCount.textContent = localStorage.getItem(`like_${id}`) || "0";

    // Load Views
    const viewCount = card.querySelector(".view-count");
    const views = parseInt(localStorage.getItem(`view_${id}`) || "0") + 1;
    localStorage.setItem(`view_${id}`, views);
    viewCount.textContent = views;

    // Like button
    card.querySelector(".like-button").addEventListener("click", () => {
      let likes = parseInt(localStorage.getItem(`like_${id}`) || "0") + 1;
      localStorage.setItem(`like_${id}`, likes);
      likeCount.textContent = likes;
    });

    // Load Comments
    const commentList = card.querySelector(".comment-list");
    const savedComments = JSON.parse(localStorage.getItem(`comments_${id}`)) || [];
    savedComments.forEach(text => {
      const c = document.createElement("div");
      c.textContent = text;
      commentList.appendChild(c);
    });

    // Post Comment
    card.querySelector(".submit-comment").addEventListener("click", () => {
      const input = card.querySelector(".comment-input");
      const value = input.value.trim();
      if (value !== "") {
        const comment = document.createElement("div");
        comment.textContent = value;
        commentList.appendChild(comment);

        savedComments.push(value);
        localStorage.setItem(`comments_${id}`, JSON.stringify(savedComments));
        input.value = "";
      }
    });
  });
});
