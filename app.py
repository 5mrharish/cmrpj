from flask import Flask, render_template, jsonify, session, redirect, url_for, request
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Required for sessions

@app.route('/')
def home():
    current_user = session.get('user')
    return render_template('dashboard.html', current_user=current_user)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    session['user'] = data.get('username')
    return jsonify({'success': True})

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))

@app.route('/get_time')
def get_time():
    current_time = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    return jsonify({'datetime': current_time})

if __name__ == '__main__':
    app.run(host='0.0.0.0, port=500)
