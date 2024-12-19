# Cascade

Cascade is an Edge browser extension that uses Braid API calls to summarize and classify web pages. It serves as a technology demonstrator for enterprise use cases, such as ticket summarization systems where you can automatically analyze and categorize content before closing tickets.

## Features

- 🔍 Automatically summarizes web page content
- 🏷️ Classifies pages into relevant categories
- 🌐 Works as a Microsoft Edge browser extension
- 🚀 Demonstrates enterprise-ready AI capabilities
- 🔒 Integrates with Braid API for secure processing

## Installation

1. Clone this repository
2. Open Microsoft Edge and navigate to `edge://extensions/`
3. Enable "Developer mode" in the bottom-left corner
4. Click "Load unpacked" and select the project directory

## Usage

1. Click the Cascade icon in your browser toolbar while on any webpage
2. View the generated summary and classifications
3. Use the insights to quickly understand page content and context

## Development

### Prerequisites

- Microsoft Edge browser
- Edge Developer Mode enabled
- Braid API access credentials

### Setup

1. Clone the repository:
```
git clone https://github.com/yourusername/cascade.git
```

2. Install dependencies:
```bash
npm install
```

3. Configure your Braid API credentials in the extension settings

### Building

```bash
npm run build
```

## Technical Architecture

Cascade leverages the Braid API to process webpage content through:
- Content extraction
- Natural language processing
- Classification algorithms
- Summary generation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## **Licence**
GNU AFFERO GENERAL PUBLIC LICENSE.

This is intentionally a restrictive licence. The source is  available for non-commercial use (subject to the licence terms as listed, which enable use for learning, self study etc). Commercial use either must abide by the licence terms, which are strong, or a separate licence that enables more normal commercial use & distribution is available from Braid. Contact us for more details mailto:info@braidtech.io.

## Acknowledgments

- Built with Braid API
- Developed for Microsoft Edge

## Support

For support, please open an issue in the GitHub repository.