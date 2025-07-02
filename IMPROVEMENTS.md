# Future Improvements

This document outlines potential improvements for the application.

## Session and Message Handling

### Backend

- Implement a user session store to persist conversation history for each user.
- Optimize message delivery by sending only the latest AI-generated message to the frontend, rather than the complete message history.

### Frontend

- Manage conversation history using a local state (e.g., a `messages` array).
- When a user sends a new message, transmit only that message to the backend to reduce payload size.

## External API Dependencies

- The response from the `https://glama.ai/api/mcp/v1/instances` endpoint is currently mocked in `lib/mocks/instances.json`. This is because the live API is not providing the required token for the SSE connection. This mock should be removed once the API is functional.
