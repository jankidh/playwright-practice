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

   | Variable          | Description                                                      |
   | ----------------- | ---------------------------------------------------------------- |
   | `BASE_URL`        | URL of the application under test                                |
   | `USER_ID`         | Test account email address                                       |
   | `USER_SECRET_KEY` | Test account password (also used for new account signup)         |
   | `INBOX_URL`       | Mailinator inbox base URL for receiving verification code emails |

## Running Tests

| Command                                 | Description                                                              |
| --------------------------------------- | ------------------------------------------------------------------------ |
| `npm test`                              | Run all tests headlessly                                                 |
| `npm run headed`                        | Run all tests in a visible browser window                                |
| `npm run debug`                         | Run all tests in headed + debug mode (step-through)                      |
| `npm run debug -- tests/<file>.spec.js` | Debug any specific test file in headed + debug mode                      |
| `npm run debugTest`                     | Debug a specific test file (update the path in `package.json` as needed) |

## Project Structure

```
├── tests/
│   ├── loginTest.spec.js    # Login test cases
│   └── signupTest.spec.js   # Signup test cases
├── helpers/
│   ├── login.js             # Login and device verification actions
│   ├── signup.js            # Signup actions
│   └── mailinator/
│       ├── inbox.js         # Mailinator inbox interaction
│       └── newUsers.js      # New user email generation and account logging
├── pageElements/
│   ├── app/
│   │   ├── common.json      # Shared selectors (iframe, buttons, verification inputs)
│   │   ├── loginPopup.json  # Login form selectors
│   │   └── signupPopup.json # Signup form selectors
│   └── mailinator/
│       └── inboxPage.json   # Mailinator inbox selectors
├── constants.js             # Environment variable exports
├── playwright.config.js     # Playwright configuration
└── .env.template            # Environment variable template
```

## Test Cases

### signupTest.spec.js

- **Successful signup with verification code** — registers a new account with a generated Mailinator email, retrieves the activation code, and completes account verification.

### loginTest.spec.js

- **Successful login with verification code** — logs in with valid credentials, intercepts the verification code from the Mailinator inbox, and completes device registration.
- Empty email address validation
- Empty password validation
- Invalid credentials error message

## CI/CD

Tests run automatically on push and pull requests to `main` via GitHub Actions (`.github/workflows/playwright.yml`).

Environment variables are stored as GitHub Actions secrets/variables under the `test` environment. The HTML test report is uploaded as an artifact and retained for 30 days.
