const express = require('express');

require('dotenv').config();
const connectDB = require('./config/db');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http'); // Needed to wrap Express
const authrouter = require('../src/UserRouter/auth/auth.index')
const adminRoutes = require('./UserRouter/Admin/admin.index')
const superRoutes = require('./UserRouter/super/super.admin.index')
const clientRoutes = require('./UserRouter/client/client.index')
const staffRoutes = require('./UserRouter/Staff/staff.index')

const cors = require('cors');

const verifyToken = require('./middleware/authmiddleware');
const authorizeRoles = require("./middleware/role.middleware");
const { initSocket } = require('./socket/socket');
const loginRoute = require('./login/LoginController')

const app = express();
connectDB();

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse form bodies
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use("/api/auth", authrouter);
// app.use("/api",verifyToken, authorizeRoles(["admin"]), loginRoute);
app.use("/api", loginRoute);

// app.use("/admin",  adminRoutes);
app.use("/super", verifyToken, authorizeRoles(["super_admin"]), superRoutes);
app.use("/admin", verifyToken, authorizeRoles(["super_admin","admin"]), adminRoutes);
app.use("/client", verifyToken, authorizeRoles(["super_admin","admin","client"]), clientRoutes);
app.use("/staff", verifyToken, authorizeRoles(["super_admin","admin","client","staff"]), staffRoutes);

const server = http.createServer(app);
initSocket(server)

// export default server;
server.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
