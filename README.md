# LoveGuide AI

A couples therapy web application powered by AI that helps partners communicate effectively and build stronger relationships.

## Features

- Private conversations with AI for each partner
- Emotional support and relationship guidance
- Constructive communication suggestions
- Secure sharing of insights between partners
- Progress tracking and pattern recognition
- Modern, responsive user interface

## Installation

1. Clone the repository:
```bash
git clone https://github.com/oren001/loveguide-ai.git
cd loveguide-ai
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
python app.py
```

5. Open your browser and navigate to:
```
http://localhost:8000
```

## Usage

1. Select your profile (Partner 1 or Partner 2)
2. Start a conversation with LoveGuide AI
3. Share your thoughts and feelings
4. Receive personalized guidance and support
5. Choose to share insights with your partner when ready

## Development

The application is built with:
- Backend: Flask (Python)
- Frontend: HTML, CSS, JavaScript
- Storage: JSON file-based (can be extended to use a database)

### Project Structure

```
loveguide-ai/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── static/            # Static files
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── loveguide.js
│   └── index.html
└── data/              # Message storage (created automatically)
    └── messages.json
```

## Security Note

This is a development version. For production:
- Implement proper user authentication
- Use a secure database instead of file storage
- Add HTTPS
- Implement proper session management
- Add rate limiting and other security measures

## License

MIT License - feel free to use and modify as needed.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and feature requests, please use the GitHub issue tracker.