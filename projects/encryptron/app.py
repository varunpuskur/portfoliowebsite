from flask import Flask, render_template, request, send_file, redirect, url_for
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import os
import io

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/encrypt', methods=['GET', 'POST'])
def encrypt():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file part', 400
        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400
        if file:
            password = request.form['password']
            try:
                encrypted_data = encrypt_file(file, password)
                return send_file(
                    io.BytesIO(encrypted_data),
                    mimetype='application/octet-stream',
                    as_attachment=True,
                    download_name=file.filename + '.enc'
                )
            except Exception as e:
                return f'Encryption failed: {str(e)}', 500
    return render_template('encrypt.html')

@app.route('/decrypt', methods=['GET', 'POST'])
def decrypt():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file part', 400
        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400
        if file:
            password = request.form['password']
            try:
                decrypted_data, original_filename = decrypt_file(file, password)
                decrypted_filename = f"{os.path.splitext(original_filename)[0]}_decrypted{os.path.splitext(original_filename)[1]}"
                return send_file(
                    io.BytesIO(decrypted_data),
                    mimetype='application/octet-stream',
                    as_attachment=True,
                    download_name=decrypted_filename
                )
            except ValueError as e:
                return f'Decryption failed: {str(e)}', 400
            except Exception as e:
                return f'An error occurred: {str(e)}', 500
    return render_template('decrypt.html')

def derive_key(password, salt):
    return PBKDF2(password, salt, dkLen=32, count=100000)

def encrypt_file(file, password):
    salt = get_random_bytes(16)
    key = derive_key(password.encode(), salt)
    cipher = AES.new(key, AES.MODE_GCM)
    
    plaintext = file.read()
    
    ciphertext, tag = cipher.encrypt_and_digest(plaintext)
    
    return salt + cipher.nonce + tag + ciphertext

def decrypt_file(file, password):
    data = file.read()
    salt = data[:16]
    nonce = data[16:32]
    tag = data[32:48]
    ciphertext = data[48:]
    
    key = derive_key(password.encode(), salt)
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    
    try:
        plaintext = cipher.decrypt_and_verify(ciphertext, tag)
    except ValueError:
        raise ValueError("Incorrect decryption")
    
    original_filename = os.path.splitext(file.filename)[0]  # Remove .enc extension
    return plaintext, original_filename

if __name__ == '__main__':
    app.run(debug=True)