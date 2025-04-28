// Like, Comment, View system for index page
if (document.querySelector('.gallery')) {
  document.querySelectorAll('.card').forEach(card => {
    const likeButton = card.querySelector('.like-button');
    const likeCount = card.querySelector('.like-count');
    const submitComment = card.querySelector('.submit-comment');
    const commentInput = card.querySelector('.comment-input');
    const commentList = card.querySelector('.comment-list');
    const viewCount = card.querySelector('.view-count');

    // Like button
    likeButton.addEventListener('click', () => {
      likeCount.textContent = parseInt(likeCount.textContent) + 1;
    });

    // Comment button
    submitComment.addEventListener('click', () => {
      if (commentInput.value.trim() !== "") {
        const newComment = document.createElement('div');
        newComment.className = 'single-comment';
        newComment.textContent = commentInput.value;
        commentList.appendChild(newComment);
        commentInput.value = "";
      }
    });

    // Random views
    viewCount.textContent = Math.floor(Math.random() * 1000) + 100;
  });
}

// Admin panel features
if (document.getElementById('clear-likes')) {
  document.getElementById('clear-likes').addEventListener('click', () => {
    document.querySelectorAll('.like-count').forEach(like => {
      like.textContent = "0";
    });
    alert("All likes cleared!");
  });

  document.getElementById('clear-comments').addEventListener('click', () => {
    document.querySelectorAll('.comment-list').forEach(list => {
      list.innerHTML = "";
    });
    alert("All comments cleared!");
  });

  document.getElementById('refresh-views').addEventListener('click', () => {
    document.querySelectorAll('.view-count').forEach(view => {
      view.textContent = Math.floor(Math.random() * 1000) + 100;
    });
    alert("Views randomized!");
  });
}
