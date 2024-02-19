from flask import Flask, request, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix
from dotenv import load_dotenv
from flask_cors import CORS
import os
import requests
app = Flask(__name__)
CORS(app)  # enable CORS for all routes
# ProxyFix is a middleware that sets certain HTTP headers that are useful in proxy setups
app.wsgi_app = ProxyFix(app.wsgi_app)

load_dotenv()

USER_SERVICE_URL = os.getenv('USER_SERVICE_URL')
CART_SERVICE_URL = os.getenv('CART_SERVICE_URL')
PRODUCT_SERVICE_URL = os.getenv('PRODUCT_SERVICE_URL')


@app.route('/user', defaults={'path': ''}, methods=['GET', 'POST'])
@app.route('/user/<path:path>', methods=['GET', 'POST'])
def user_proxy(path):
        response = requests.request(
            method=request.method,
            url=request.url.replace(request.host_url, USER_SERVICE_URL),
            headers={key: value for (key, value) in request.headers if key != 'Host'},
            data=request.get_data(),
            cookies=request.cookies,
            allow_redirects=False)
        json_response = response.json()
        return jsonify(json_response), response.status_code


@app.route('/cart', defaults={'path': ''}, methods=['GET', 'POST'])
@app.route('/cart/<path:path>', methods=['GET', 'POST'])
def client_proxy(path):
    response = requests.request(
        method=request.method,
        url=request.url.replace(request.host_url, CART_SERVICE_URL),
        headers={key: value for (key, value) in request.headers if key != 'Host'},
        data=request.get_data(),
        cookies=request.cookies,
        allow_redirects=False)
    return jsonify(response.json()), response.status_code

# This code block defines a route for the '/product' endpoint with optional path parameter.
# It handles both GET and POST requests.
@app.route('/product', defaults={'path': ''}, methods=['GET', 'POST'])
@app.route('/product/<path:path>', methods=['GET', 'POST'])
def product_proxy(path):
    # Sends a request to the PRODUCT_SERVICE_URL by replacing the host URL in the request URL.
    # It includes the method, headers, data, cookies, and disables redirects.
    response = requests.request(
        method=request.method,
        url=request.url.replace(request.host_url, PRODUCT_SERVICE_URL),
        headers={key: value for (key, value) in request.headers if key != 'Host'},
        data=request.get_data(),
        cookies=request.cookies,
        allow_redirects=False)
    # Returns the JSON response and the status code.
    return jsonify(response.json()), response.status_code

@app.route('/', methods=['GET'])
def home():
    return jsonify({'msg': 'No endpoint specified'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.getenv('FLASK_RUN_PORT'))
