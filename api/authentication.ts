const basicAuth = require("express-basic-auth");

export function useAuthentication(app) {
  const users = (process.env.AUTH_USERS ?? "")
    .split(",")
    .filter((user) => user.length > 0)
    .map((user) => ({
      name: user,
      password: process.env["AUTH_USER_" + user + "_PASSWORD"] ?? "",
    }));

  const usersWithoutPassword = users.filter((user) => !user.password);
  if (usersWithoutPassword.length > 0) {
    throw new Error(
      `Users without password: ${usersWithoutPassword
        .map((user) => user.name)
        .join(", ")}`
    );
  }

  if (users.length === 0) {
    console.warn(
      "No users defined in USERS environment variable, continuing without authentication"
    );
  } else {
    app.use(
      basicAuth({
        users: Object.fromEntries(
          users.map((user) => [user.name, user.password])
        ),
        challenge: true,
      })
    );
  }
}
