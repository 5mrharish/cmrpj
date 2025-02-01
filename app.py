from flask import Flask, render_template, render_template_string, jsonify, request
from datetime import datetime
import folium

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('dashboard.html')

@app.route('/get_time')
def get_time():
    try:
        current_time = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        return jsonify({'datetime': current_time})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/map')
def map_view():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)

    if lat is None or lon is None:
        return jsonify({'success': False, 'message': 'Please provide latitude and longitude as query parameters.'}), 400

    # Create a Folium map centered at the given coordinates
    map = folium.Map(location=[lat, lon], zoom_start=15)
    folium.Marker([lat, lon], popup="Current Location").add_to(map)

    # Generate the map HTML
    map_html = map._repr_html_()

    # Render the map HTML within a simple template
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
        </body>
        </html>
    """, map_html=map_html)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
