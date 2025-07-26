# user-management-fe-be
# User Management API  
*A secure and scalable user authentication and management solution built with Node.js and MongoDB.*

This backend system allows user registration, login, password management, and CRUD operations, with JWT authentication and registration email notifications using Nodemailer and Gmail App Passwords.

---

### 🔧 Core Features

- **JWT Authentication**
  - Register and Login endpoints
  - Token-based access for secure routes
  - Logout functionality

- **User Management**
  - Register users with email notification
  - Login with JWT token
  - Change password
  - Update or delete profile
  - Fetch individual user details
  - List users with pagination and filtering

- **Email Notifications**
  - Welcome email on registration
  - Email sending via Gmail App Password (secure method)

- **Security**
  - Encrypted passwords using bcrypt
  - JWT token verification
  - Input validation using `express-validator`

- **Error Handling & Logging**
  - Centralized response structure
  - Winston-based logging
  - Proper HTTP status codes and messages

- **Project Structure**
  - Clean MVC architecture
  - Environment-based configuration
  - Modular and scalable codebase

---


---

### 🌐 API Endpoints

#### 🔐 Auth Routes

| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| POST   | `/users/userRegister`     | Register new user + email |
| POST   | `/users/userLogin`        | Login and receive token   |
| PATCH  | `/users/changePassword`   | Change password           |
| GET    | `/users/getUserDetail`    | Get logged-in user info   |
| PUT    | `/users/updateUserDetail` | Update user info          |
| DELETE | `/users/deleteUser`       | Delete user account       |
| GET    | `/users/userLogOut`       | Logout and invalidate     |

---

### 🔐 .env Configuration
```env
NODE_ENV = localhost
PORT = 3000
DB_HOST = localhost
DB_NAME = user_management
DB_PORT = 27017
JWT_SECRET = abcd123
JWT_EXPIRE = 24h
LOGIN_BEARER = a1b2c3d4e5
IMAGE_ACCESS_URL = http://localhost:3000/
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16char_app_password



git clone https://github.com/your-repo/user-management-api.git
cd backend
npm install
node index.js

Swagger:
http://localhost:3000/api-docs


Frontend:
cd frontend
npm install
npm run dev
