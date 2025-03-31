# Node.js Authentication API with Role-Based Access Control (RBAC)

## 🚀 Project Overview
This project provides a well-structured Node.js backend with authentication and role-based access control using JWT. It uses **Sequelize ORM** for SQL database interaction and follows best practices with controllers, middleware, and routes.

---

## 📂 Project Structure
```
backend/
│── config/
│   ├── db.js          # Database connection
│   ├── env.js         # Environment variables config
│── controllers/
│   ├── authController.js  # Authentication logic
│   ├── userController.js  # Auth-related operations
│── middleware/
│   ├── authMiddleware.js  # JWT & Role-based auth
│── models/
│   ├── index.js       # ORM models initialization
│   ├── AuthModel.js        # Auth model
│── routes/
│   ├── authRoutes.js  # Auth-related routes
│   ├── userRoutes.js  # Auth-related routes
│── server.js          # Entry point
│── package.json
│── .env
```

---

## 🛠 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/node-auth-rbac.git
   cd node-auth-rbac
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure environment variables:
   ```ini
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=mydatabase
   JWT_SECRET=supersecretkey
   JWT_EXPIRES_IN=1h
   ```
4. Set up the database:
   ```bash
   npx sequelize db:migrate
   ```
5. Start the server:
   ```bash
   npm start
   ```

---

## 🔑 Authentication & Role-Based Access

### Auth Roles:
- **Auth** (default)
- **Admin**

### Token-Based Authentication:
- JWT is used to generate and verify authentication tokens.
- Tokens contain user `id` and `role`.

---

## 🔗 API Endpoints
| Method | Endpoint            | Description         | Auth Required |
|--------|--------------------|---------------------|--------------|
| `POST` | `/api/auth/signup`  | Register Auth      | ❌ No        |
| `POST` | `/api/auth/signin`  | Login Auth        | ❌ No        |
| `GET`  | `/api/user/profile` | Get Auth Profile  | ✅ Yes       |
| `GET`  | `/api/user/admin`   | Admin-Only Route  | ✅ Yes (Admin) |

---

## 🔹 Middleware
- `authMiddleware.js` → Checks JWT and validates user.
- `roleMiddleware.js` → Restricts access based on user role.

---

## 🎯 Next Steps
- Add password reset functionality.
- Implement email verification.
- Add unit and integration tests.

Feel free to contribute and improve the project! 🚀

