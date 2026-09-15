# CaptionCraft

## AI-Powered Image Caption Generator for Social Media

CaptionCraft is a full-stack Java web application that uses the Google Gemini API to generate social media captions and relevant hashtags from an uploaded image. Users can select the target platform, caption style, language, caption length, emoji preference, and hashtag options before generating a caption.

The application combines a HTML/CSS/JavaScript frontend with a Java Servlet backend and Gemini AI integration.

## Overview

CaptionCraft simplifies the process of creating captions for social media posts. Instead of manually writing a caption for every image, users can upload an image, choose their preferences, and receive an AI-generated caption and hashtags.

The application also provides a social media-style preview and supports caption translation through the Gemini-powered backend.

## Features

- Image-based caption generation
- Social media platform selection
- Multiple caption styles:
  - Creative
  - Professional
  - Funny
  - Inspirational
  - Minimal
  - Trendy
- Multiple language options
- Adjustable caption length
- Optional emoji generation
- AI-generated hashtags
- Caption translation
- Social media post preview
- Copy generated caption
- Responsive web interface
- Secure environment-variable based API key configuration

## How It Works

```text
User
  |
  | Upload Image + Select Preferences
  v
Frontend
HTML / CSS / JavaScript
  |
  | HTTP POST
  v
CaptionServlet
Java Backend
  |
  | REST API Request
  v
Google Gemini API
  |
  | Generated Caption + Hashtags
  v
Java Backend
  |
  | Response
  v
Frontend
  |
  v
Social Media Preview
```

### Application Workflow

1. The user uploads an image through the web interface.
2. The user selects the social media platform and caption preferences.
3. The frontend collects the image and selected options.
4. The data is sent to the Java Servlet backend using an HTTP POST request.
5. The backend processes the request and creates a prompt for Gemini.
6. The Gemini API analyzes the provided image and request parameters.
7. The generated caption and hashtags are returned to the backend.
8. The backend sends the result back to the frontend.
9. The frontend displays the generated caption in the social media preview.
10. Users can copy or translate the generated caption.

## Technology Stack

| Technology | Purpose |
|---|---|
| Java 17 | Backend development |
| HTML5 | Frontend structure |
| CSS3 | Interface styling |
| JavaScript | Frontend logic and API communication |
| Jakarta Servlet 6.0 | Backend request handling |
| Apache Maven | Build and dependency management |
| Apache Tomcat 10.1 | Servlet container and web server |
| Google Gemini API | AI caption, hashtag, and translation generation |
| Java HTTP Client | Communication with the Gemini REST API |
| Jackson | JSON processing |
| Thumbnailator | Image processing |

## Project Architecture

CaptionCraft follows a client-server architecture.

```text
                  CaptionCraft
                       |
          +------------+------------+
          |                         |
       Frontend                  Backend
          |                         |
 HTML / CSS / JavaScript      Java Servlet
          |                         |
          +------------+------------+
                       |
                 HTTP Request
                       |
                       v
               Google Gemini API
                       |
                       v
              AI Generated Result
                       |
                       v
                   Frontend
                       |
                       v
                Social Preview
```

## Project Structure

```text
CaptionCraft/
|
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── example/
│       │           └── CaptionServlet.java
│       │
│       └── webapp/
│           ├── index.html
│           ├── script.js
│           └── style.css
│
├── .gitignore
├── pom.xml
└── README.md
```

### Main Components

#### CaptionServlet.java

The main backend component of CaptionCraft.

It is responsible for:

- Receiving image uploads through multipart requests
- Reading the selected caption options
- Processing the uploaded image
- Creating the Gemini request
- Communicating with the Gemini REST API
- Processing the API response
- Returning generated content to the frontend
- Handling caption translation

The servlet is mapped to:

```text
/CaptionServlet
```

#### index.html

Contains the main CaptionCraft user interface, including:

- Image upload
- Platform selection
- Caption style selection
- Language selection
- Caption length selection
- Emoji and hashtag options
- Caption generation
- Translation
- Social media preview

#### script.js

Controls the frontend functionality.

It handles:

- User interactions
- Form data collection
- Image submission
- Communication with the Java Servlet
- Displaying generated captions
- Updating the preview
- Copying and translating captions

#### style.css

Contains the application's visual styling, layout, responsive behavior, and user interface design.

#### pom.xml

Contains the Maven project configuration and required dependencies.

## API Key Configuration

The Gemini API key is not stored directly in the source code.

CaptionCraft reads the API key from an environment variable:

```java
private static final String GEMINI_API_KEY =
        System.getenv("GEMINI_API_KEY");
```

### Windows PowerShell

Set the API key for the current terminal session:

```powershell
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

You can verify that the variable is configured without displaying the key:

```powershell
if ($env:GEMINI_API_KEY) {
    "GEMINI_API_KEY is configured"
} else {
    "GEMINI_API_KEY is not configured"
}
```

Never commit an actual API key to GitHub.

## Requirements

Before running CaptionCraft, install:

- JDK 17 or compatible Java environment
- Apache Maven
- Apache Tomcat 10.1
- Google Gemini API key
- A modern web browser

Check Java:

```powershell
java -version
```

Check Maven:

```powershell
mvn -version
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Yogeethaanantharaman/CaptionCraft.git
```

### 2. Open the Project

```bash
cd CaptionCraft
```

### 3. Configure the Gemini API Key

For Windows PowerShell:

```powershell
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### 4. Build the Project

Run:

```bash
mvn clean package
```

Maven will generate the deployable WAR file inside:

```text
target/
```

The `target/` directory is generated during the build and is intentionally excluded from Git.

### 5. Deploy to Tomcat

Copy the generated WAR file from the `target/` directory into the Tomcat:

```text
webapps/
```

directory.

Start Apache Tomcat and open the deployed CaptionCraft application in your browser.

## Example Usage

1. Open CaptionCraft.
2. Upload an image.
3. Select the intended social media platform.
4. Select a caption style.
5. Choose the desired language.
6. Select the caption length.
7. Configure emoji and hashtag preferences.
8. Click the generate button.
9. Review the generated caption and hashtags.
10. Use the preview to check the appearance of the post.
11. Copy or translate the caption if required.

## Future Enhancements

- More platform-specific caption optimization
- Improved image understanding
- Personalized caption recommendations
- Caption quality scoring
- Caption history and saved drafts
- User accounts and personalized preferences
- Expanded multilingual support
- Additional social media preview templates
- Direct social media publishing
- Cloud deployment

## Security

CaptionCraft uses environment variables for API credentials instead of storing secrets in the source code.

The repository also excludes:

- API credentials
- `.env` files
- Maven-generated `target/` files

If an API key is accidentally exposed, it should be revoked and replaced immediately.

## Project Highlights

This project demonstrates practical experience with:

- Full-stack web development
- Java Servlet architecture
- Generative AI integration
- REST API integration
- Image upload and processing
- Multipart HTTP requests
- JSON processing
- Maven dependency management
- Apache Tomcat deployment
- Environment-based secret management
- Interactive frontend development

## Author

### Yogeetha Anantharaman

GitHub: https://github.com/Yogeethaanantharaman

Project Repository: https://github.com/Yogeethaanantharaman/CaptionCraft

## License

This project is developed for educational and project-development purposes.
