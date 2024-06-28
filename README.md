
# Frontend Login and Signup design with OTP verification and GOOGLE sign in feature

This project involves is a web application that allows users to sign up, log in, and reset their passwords with an OTP verification system. It also supports Google authentication for user sign-in. User data is securely stored in a PostgreSQL database.

## Features

- **User Registration**: Users can sign up with their email and password.
- **OTP Verification**: An OTP is sent to the user's email for verification during the sign-up and password reset processes.
- **User Login**: Users can log in using their email and password.
- **Google Sign-In**: Users can log in with their Google accounts.
- **Password Reset**: Users can reset their passwords by verifying their email with an OTP.
- **PostgreSQL Database**: User data is securely stored in a PostgreSQL database.

## Tech Stack

- **Frontend**: EJS, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: Passport.js (Local Strategy and Google OAuth2 Strategy)
- **Email Service**: SendGrid
- **Environment Variables**: dotenv

## Setup and Installation

### Prerequisites

- Node.js
- PostgreSQL
- SendGrid account for sending OTP emails
- Google Developer account for OAuth2

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hasanpeal/Login-Signup-Page-Frontend.git
   cd CricGoal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```
   PG_USER=your_pg_user
   PG_HOST=your_pg_host
   PG_DATABASE=your_pg_database
   PG_PASSWORD=your_pg_password
   PG_PORT=your_pg_port
   SENDGRID_API_KEY=your_sendgrid_api_key
   SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Setup PostgreSQL**:
   Create a PostgreSQL database and set up the `auth` table:
   ```sql
   CREATE TABLE auth (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) NOT NULL,
     password VARCHAR(255) NOT NULL
   );
   ```

5. **Run the application**:
   ```bash
   npm start
   ```

6. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

## Usage

- **Sign Up**:
  - Navigate to the sign-up page and enter your email and password.
  - An OTP will be sent to your email for verification.
  - Enter the OTP to complete the registration process.

- **Sign In**:
  - Navigate to the login page and enter your email and password.
  - Alternatively, use the Google sign-in option.

- **Password Reset**:
  - Click on "Forget password" on the login page.
  - Enter your email to receive an OTP.
  - Enter the OTP and set a new password.

## File Structure

- `server.js`: Main server file that initializes the Express app and sets up routes and middleware.
- `views/`: Contains EJS templates for the frontend.
  - `main.ejs`: Main page template.
  - `login.ejs`: Login page template.
  - `signup.ejs`: Sign-up page template.
  - `dashboard.ejs`: Dashboard page template.
- `public/`: Contains static files (CSS, images, etc.).
- `.env`: Environment variables configuration file.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Bootstrap](https://getbootstrap.com/)
- [SendGrid](https://sendgrid.com/)
- [Passport.js](http://www.passportjs.org/)
- [Google OAuth2](https://developers.google.com/identity/protocols/oauth2)

