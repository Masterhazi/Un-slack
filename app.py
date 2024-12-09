from flask import Flask, request, jsonify
import mysql.connector
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = Flask(__name__)

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv('MYSQL_HOST'),
        user=os.getenv('MYSQL_USER'),
        password=os.getenv('MYSQL_PASSWORD'),
        database=os.getenv('MYSQL_DATABASE'),
        port=os.getenv('MYSQL_PORT'),
        ssl_ca=os.getenv('MYSQL_SSL_CA')
    )

def ensure_tasks_table_exists():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        quadrant ENUM('DO', 'SCHEDULE', 'DELEGATE', 'ELIMINATE') NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        completed_at DATETIME DEFAULT NULL
    )
    """)
    connection.commit()
    cursor.close()
    connection.close()

@app.route('/tasks', methods=['GET'])
def get_tasks():
    ensure_tasks_table_exists()
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tasks")
        tasks = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(tasks)
    except Exception as e:
        app.logger.error(f"Error retrieving tasks: {str(e)}")
        return str(e), 500

@app.route('/tasks', methods=['PUT'])
def add_task():
    data = request.get_json()
    ensure_tasks_table_exists()
    app.logger.info(f"Received data: {data}")
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("INSERT INTO tasks (title, quadrant) VALUES (%s, %s)", (data['title'], data['quadrant']))
        connection.commit()
        cursor.close()
        connection.close()
        return '', 201
    except Exception as e:
        app.logger.error(f"Error adding task: {str(e)}")
        return str(e), 500

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    ensure_tasks_table_exists()
    app.logger.info(f"Received data for update: {data}")
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        if data['completed']:
            cursor.execute("UPDATE tasks SET completed = %s, completed_at = %s WHERE id = %s", (data['completed'], datetime.now(), task_id))
        else:
            cursor.execute("UPDATE tasks SET completed = %s, completed_at = NULL WHERE id = %s", (data['completed'], task_id))
        connection.commit()
        cursor.close()
        connection.close()
        return '', 204
    except Exception as e:
        app.logger.error(f"Error updating task: {str(e)}")
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True)
