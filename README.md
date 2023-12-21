# Loquitur

Loquitur is a web application that allows users to upload videos or download them from [BigBlueButton](https://github.com/bigbluebutton). It enables users to view transcriptions of these videos and interact with them using the Ollama AI tool for asking questions about the video content.

## Requirements

- Python 3.10
- [WhisperX](https://github.com/m-bain/whisperX)
- NVM or Node 20
- [Ollama](https://github.com/jmorganca/ollama) (Optional, only for AI chat)

## Installation

First, ensure that you have requirements installed in your environment. Then, follow these steps to install Loquitur:

```bash
# Install moviepy, a dependency for video processing. Use the same virtualenv as WhisperX
pip install moviepy==1.0.3

# Copy the sample environment file and configure it
cp .env.sample .env
# Remember to edit the .env file with your specific settings

# Install Node.js and npm dependencies
nvm install
npm install
```

## Running the Application

To run Loquitur, start both the frontend and the API server:

```bash
# Start the frontend interface
npm start

# Start the API server
npm run start:api
```

## Upcoming Features (TODO)

- Implement chat shortcuts for ease of use.
- Add functionality to download videos with subtitles.
- Enable audio file uploads.
- Introduce a feature for uploading skeleton data.

## Technology Stack

- Nx
- Angular 17
- Ollama
- Fastify
- Open props
- TRPC
- Zod
- Tanstack
- Fuse.js
- RxAngular
- AngularMaterial
