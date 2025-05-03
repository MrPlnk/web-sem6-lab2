from flask import Flask, render_template, url_for, jsonify, request
import psycopg2
import os

app = Flask(__name__)

def get_db_connection():
    return psycopg2.connect(
        dbname=os.environ.get("POSTGRES_DB"),
        user=os.environ.get("POSTGRES_USER"),
        password=os.environ.get("POSTGRES_PASSWORD"),
        host=os.environ.get("DB_HOST", "db"),  # "db" — имя сервиса в docker-compose
        port=os.environ.get("DB_PORT", 5432)
    )

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/report")
def report():
    return render_template("report.html")

@app.route('/add_comment', methods=['POST'])
def add_comment():
    comment = request.json.get('comment')
    if comment:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute('INSERT INTO comments (text) VALUES (%s)', (comment,))
                conn.commit()
        return jsonify({'status': 'success', 'message': 'Комментарий добавлен!'})
    return jsonify({'status': 'error', 'message': 'Комментарий пустой'})

@app.route('/get_comments', methods=['GET'])
def get_comments():
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute('SELECT id, text FROM comments')
            comments = cursor.fetchall()
    return jsonify(comments)

@app.route('/delete_comment', methods=['POST'])
def delete_comment():
    comment_id = request.json.get('id')
    if comment_id is not None:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute('DELETE FROM comments WHERE id = %s', (comment_id,))
                conn.commit()
                if cursor.rowcount > 0:
                    return jsonify({'status': 'success', 'message': 'Комментарий удалён!'})
                else:
                    return jsonify({'status': 'error', 'message': 'Комментарий не найден.'})
    return jsonify({'status': 'error', 'message': 'ID комментария не передан.'})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
