**boxer.ts**

This code provides a server-side implementation for a Teams App using TypeScript and Azure Functions. It features the primary function `boxer` which handles HTTP requests and retrieves boxer information based on a query parameter.

The function `boxer(req, context)`:
1. Retrieves the "question" parameter from the request.
2. Logs the question and sets up Axios for handling potential rate limits with up to 5 retries.
3. Sends a POST request to the Braid API to fetch relevant boxer data.
4. Processes the API response to extract necessary details and formats them into an array.
5. Returns this array in the HTTP response or handles errors and invalid requests appropriately.

Classes/Functions: `boxer`, `app.http`.

