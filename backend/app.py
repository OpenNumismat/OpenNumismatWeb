from flask import Flask, send_from_directory

# Initializing flask app
app = Flask(__name__, static_url_path='/')


@app.route('/', defaults={'path': ''})
def catch_all(path):
    return send_from_directory('static', 'index.html')


# Running app
if __name__ == '__main__':
    app.run(debug=True)
