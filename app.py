from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__, static_folder='static')
CORS(app)

# Path to the messages data file
MESSAGES_FILE = 'data/messages.json'

def ensure_data_directory():
    """Ensure the data directory exists"""
    os.makedirs(os.path.dirname(MESSAGES_FILE), exist_ok=True)

def load_messages():
    """Load messages from JSON file"""
    ensure_data_directory()
    try:
        if os.path.exists(MESSAGES_FILE):
            with open(MESSAGES_FILE, 'r') as f:
                return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        pass
    return []

def save_messages(messages):
    """Save messages to JSON file"""
    ensure_data_directory()
    with open(MESSAGES_FILE, 'w') as f:
        json.dump(messages, f)

@app.route('/')
def index():
    """Serve the main page"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/messages', methods=['GET'])
def get_messages():
    """Get all messages"""
    messages = load_messages()
    return jsonify(messages)

@app.route('/api/messages', methods=['POST'])
def add_message():
    """Add a new message"""
    data = request.json
    
    if not data or 'text' not in data or not data['text'].strip():
        return jsonify({"error": "Message text is required"}), 400
    
    if 'author' not in data or not data['author'].strip():
        return jsonify({"error": "Author is required"}), 400
    
    messages = load_messages()
    
    new_message = {
        'id': str(len(messages) + 1),
        'text': data['text'].strip(),
        'author': data['author'].strip(),
        'timestamp': datetime.now().isoformat(),
        'type': data.get('type', 'user')
    }
    
    # Add optional fields if they exist
    if 'suggestion' in data:
        new_message['suggestion'] = data['suggestion']
    
    if 'related_to' in data:
        new_message['related_to'] = data['related_to']
    
    messages.append(new_message)
    save_messages(messages)
    
    return jsonify(new_message), 201

@app.route('/api/shared', methods=['POST'])
def share_insight():
    """Share an insight with partner"""
    data = request.json
    
    if not data or 'content' not in data or not data['content'].strip():
        return jsonify({"error": "Content is required"}), 400
    
    if 'from' not in data or not data['from'].strip():
        return jsonify({"error": "Sender is required"}), 400
    
    if 'to' not in data or not data['to'].strip():
        return jsonify({"error": "Recipient is required"}), 400
    
    # In a real implementation, this would store the shared insight
    # and make it available to the partner
    
    return jsonify({"message": "Insight shared successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)