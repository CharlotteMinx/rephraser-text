# Text Rephraser - Gemini 2.0 flash wrapper

A desktop application for rephrasing text using the Gemini AI API. This application allows users to input text, select a rephrasing style, and get AI-generated rephrased text that's automatically copied to the clipboard.

## Features

- **Modern UI with Material UI**
  - Dark mode interface
  - Clean, responsive design
  - Open Sans font for better readability

- **Text Input and Processing**
  - Large text area for entering content
  - Four rephrasing styles: Developer, Friendly, Business, and Gen-Z
  - Integration with Gemini Flash 2.0 API

- **Settings Management**
  - API key configuration
  - Windows autostart option
  - Settings stored locally

- **System Integration**
  - Clipboard integration for easy copying of results
  - System notifications when text is rephrased
  - Windows autostart capability

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/text-rephraser.git
   cd text-rephraser
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Gemini API key to the `.env` file:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```
   - You can get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. Build the application:
   ```
   npm run build
   ```

5. Start the application:
   ```
   npm start
   ```

## Development

- Run in development mode (with DevTools and logging):
  ```
  npm run dev
  ```

- Run in production mode:
  ```
  npm start
  ```

- Build the application:
  ```
  npm run build
  ```

## Packaging

The application can be packaged for distribution on different platforms:

- Package for Windows:
  ```
  npm run package
  ```

- Package for macOS:
  ```
  npm run package-mac
  ```

- Package for Linux:
  ```
  npm run package-linux
  ```

The packaged applications will be available in the `release-builds` directory.

## Usage

1. **Input Text**: Type or paste text in the large input field
2. **Choose Style**: Select one of the four rephrasing styles:
   - Developer: Technical, code-friendly language
   - Friendly: Warm, approachable tone
   - Business: Professional, corporate style
   - Gen-Z: Modern slang and expressions
3. **Process**: The app will send the text to Gemini AI, process it, and copy the result to your clipboard
4. **Settings**: Access settings via the gear icon in the top-right corner to:
   - Update your Gemini API key
   - Enable/disable autostart with Windows

## Technologies Used

- Electron
- React
- Material UI
- Google Gemini AI API
- Webpack

## License

ISC

## Additional comments
- vibe coded this in an hour