from flask import Flask, request, jsonify, render_template
import os
import base64
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    data = request.json
    isNiyamaLow = data["isNiyamaLow"]
    isKonsai = data["isKonsai"]
    countDummyBox = data["countDummyBox"]
    valSiire = data["valSiire"]
    valUkeire = data["valUkeire"]
    valOrder = data["valOrder"]
    valHinban = data["valHinban"]

    """
    images = data['images']
    qr_content = data['qrCode']

    # 現在のタイムスタンプを取得

    # 画像を保存
    for image in images:
        id = image["id"]
        img_data = image['data'].split(',')[1]
        img_data = base64.b64decode(img_data)
        file_path = os.path.join('./images', f'{timestamp}_{id}.jpg')
        with open(file_path, 'wb') as f:
            f.write(img_data)

    # QRコードの内容を保存
    if qr_content:
        qr_file_path = os.path.join('./images', f'{timestamp}_QR.txt')
        with open(qr_file_path, 'w') as f:
            f.write(qr_content)
    else:
        return jsonify({'error': 'QR content is missing.'}), 400
    """
    return jsonify({'message': 'Files successfully uploaded!'})

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=443,
        ssl_context=('server.crt', 'server.key'),
        debug=True
    )
