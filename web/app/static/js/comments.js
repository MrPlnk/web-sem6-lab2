document.getElementById('add-comment-button').addEventListener('click', function () {
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value.trim();

    if (commentText === '') {
        alert('Комментарий не может быть пустым.');
        return;
    }

    fetch('/add_comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: commentText }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const commentsList = document.querySelector('.comments-list');
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            commentDiv.dataset.id = data.comment_id;
            commentDiv.innerHTML = `
                <p>${commentText}</p>
                <button class="delete-comment">Удалить</button>
            `;
            commentDiv.querySelector('.delete-comment').addEventListener('click', function () {
                deleteComment(data.comment_id, commentDiv);
            });
            commentsList.appendChild(commentDiv);
            commentInput.value = '';
        } else {
            alert('Ошибка: ' + data.message);
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Загрузка комментариев при загрузке страницы
    fetch('/get_comments')
        .then(response => response.json())
        .then(comments => {
            const commentsList = document.querySelector('.comments-list');
            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment';
                commentDiv.dataset.id = comment[0];
                commentDiv.innerHTML = `
                    <p>${comment[1]}</p>
                    <button class="delete-comment">Удалить</button>
                `;

                commentDiv.querySelector('.delete-comment').addEventListener('click', function () {
                    deleteComment(comment[0], commentDiv);
                });

                commentsList.appendChild(commentDiv);
            });
        });

    // Функция для удаления комментария
    function deleteComment(commentId, commentElement) {
        fetch('/delete_comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: commentId }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                commentElement.remove();
            } else {
                alert('Ошибка: ' + data.message);
            }
        });
    }
});
