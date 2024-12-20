**boxer.ts**

**Important Functions:**
- `boxer`

**Summary:**
- The code provides a starter kit for implementing server-side logic for a Teams App using TypeScript and Azure Functions, with reference to Azure Functions documentation for a complete developer guide.
  
- It defines the `boxer` function that handles HTTP requests and extracts the "question" parameter from the request query or body.
  
- It utilizes the `axios` library with retry capabilities for making HTTP requests to the external Braid API.

- The function queries an external API with the extracted question and processes the API response by mapping the results into a formatted array of items.

- It returns an HTTP response containing the processed boxer information or an error status if the request is invalid or an internal error occurs.

- The `app.http` method registers the `boxer` function to handle HTTP GET requests without requiring authentication.

