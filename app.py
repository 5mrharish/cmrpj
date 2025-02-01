from flask import Flask, render_template, jsonify, session, redirect, url_for, request, render_template_string
import folium

app = Flask(__name__)
  # Required for sessions

@app.route('/')
def home():
    current_user = session.get('user')
    return render_template_string("""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Home</title>
        </head>
        <body>
            <h1>Welcome {{ current_user or 'Guest' }}</h1>
            {% if current_user %}
                <a href="{{ url_for('logout') }}">Logout</a>
            {% else %}
                <form action="{{ url_for('login') }}" method="post">
                    <input type="text" name="username" placeholder="Enter your username">
                    <button type="submit">Login</button>
                </form>
            {% endif %}
        </body>
        </html>
    """, current_user=current_user)

@app.route('/login', methods=['POST'])
def login():
    data = request.form
    session['user'] = data.get('username')
    return redirect(url_for('home'))

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))

@app.route('/map')
def map_view():
    lat, lon = 17.6128, 78.4803
    map_object = folium.Map(location=[lat, lon], zoom_start=15)
    folium.Marker([lat, lon], popup="Medchal, Hyderabad").add_to(map_object)
    map_html = map_object._repr_html_()
    
    return render_template_string("""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>GPS Map</title>
        </head>
        <body>
            <h1>GPS Map</h1>
            <div>{{ map_html|safe }}</div>
            <p><a href="/">Back to Home</a></p>
        </body>
        </html>
    """, map_html=map_html)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
