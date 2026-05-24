# Playwright Practice

End-to-end test suite for login flows, built with [Playwright](https://playwright.dev/).

## Prerequisites

- Node.js (LTS)
- A [Mailinator](https://www.mailinator.com/) inbox configured as the test email recipient

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

3. Create a `.env` file from the template and fill in your values:

   ```bash
   cp .env.template .env
   ```

   | Variable          | Description                                                    |
   | ----------------- | -------------------------------------------------------------- |
   | `BASE_URL`        | URL of the application under test                              |
   | `USER_ID`         | Test account email address                                     |
   | `USER_SECRET_KEY` | Test account password                                          |
   | `INBOX_URL`       | Mailinator inbox URL for receiving the verification code email |

## Running Tests

| Command             | Description                               |
| ------------------- | ----------------------------------------- |
| `npm test`          | Run all tests headlessly                  |
| `npm run headed`    | Run all tests in a visible browser window |
| `npm run debug`     | Run in headed + debug mode (step-through) |
| `npm run debugTest` | Debug the login test file specifically    |

## Project Structure

```
├── tests/
│   └── loginTest.spec.js   # Login test cases
├── helpers/
│   ├── loginHelper.js       # Login and device verification actions
│   └── inboxHelper.js       # Mailinator inbox interaction
├── constants.js             # Environment variable exports
├── playwright.config.js     # Playwright configuration
└── .env.template            # Environment variable template
```

## Test Cases

### Active

Example of a test case within a test suite loginTest.spec.js

- **Successful login with verification code** — logs in with valid credentials, intercepts the verification code from the Mailinator inbox, and completes device registration.

### Commented Out (require live environment)

- Empty email address validation
- Empty password validation
- Invalid credentials error message

## CI/CD

Tests run automatically on push and pull requests to `main` via GitHub Actions (`.github/workflows/playwright.yml`).

Environment variables are stored as GitHub Actions secrets/variables under the `test` environment. The HTML test report is uploaded as an artifact and retained for 30 days.
