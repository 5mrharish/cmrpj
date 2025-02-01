from flask import Flask, render_template, render_template_string, jsonify
import folium

app = Flask(__name__)

@app.route('/')
def home():
   
    lat, lon = 17.6128, 78.4803  

    # Create a Folium map centered at the given coordinates
    map = folium.Map(location=[lat, lon], zoom_start=15)
    folium.Marker([lat, lon], popup="Medchal, Hyderabad").add_to(map)

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
