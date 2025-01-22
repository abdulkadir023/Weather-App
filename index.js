import express from "express";
import ejs from "ejs";
import pg from "pg";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

dotenv.config(); // Load environment variables

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

db.connect(); // Connect to database

app.get("/", (req, res) => {
  console.log("SUCCESS!!!");
  res.render("index.ejs");
});
app.get("/signUp", (req, res) => {
  res.render("signUp.ejs");
});

app.get("/login", (req, res) => {
  res.render("logIn.ejs");
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      res.status(403).json({ Error: "username and Password are required" });
    } else {
      // Retrieve the stored hash from the database

      const result = await db.query(
        `SELECT password FROM users WHERE username = $1`,
        [username]
      );

      console.log("result", result);

      if (result.rows.length === 0) {
        console.log("User not found");
      }

      const storedHash = result.rows[0].password;

      // Compare the input password with the stored hash
      const isMatch = await bcrypt.compare(password, storedHash);

      if (isMatch) {
        console.log("Login successful");

        function getUsernameFromusername(username) {
          const atIndex = username.indexOf("@");

          if (atIndex === -1) {
            return "invalid username addresses"; // Handle invalid username addresses
          }

          // Extract the username part
          const usernamePart = username.substring(0, atIndex);

          //console.log(usernamePart);

          // Remove any leading numbers or special characters
          const cleanedUsername = usernamePart.replace(/[^a-zA-Z0-9.]/g, "");

          console.log("cleanedUsername", cleanedUsername);

          return cleanedUsername;
        }

        const updatedUsername = getUsernameFromusername(username);

        res.render("weather.ejs", { updatedUsername: updatedUsername });
      } else {
        console.log("Login failed! You entered a Wrong Password!");
        res.redirect("/login");
        return;
      }
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ Error: "Errror Loging In " });
  }
});
app.post("/signup", async (req, res) => {
  const { username, password, confirm } = req.body;

  try {
    // Basic Validation and Error Handling
    if (!username || !password || !confirm) {
      return res.status(400).json({ Error: "All fields are required." });
    } else {
      const checkResult = await db.query(
        `SELECT * FROM users WHERE username = $1`,
        [username]
      );

      if (checkResult.length > 0) {
        res.send("User already exists.");
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
          `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`,
          [username, hashedPassword]
        );

        const user = result.rows[0];
        console.log("User registered successfully:", user);
      }
    }

    // Password Hashing algorithm

    console.log({
      username: username,
      password: password,
      confirm: confirm,
    });

    function getUsernameFromusername(username) {
      const atIndex = username.indexOf("@");

      if (atIndex === -1) {
        return "invalid username addresses"; // Handle invalid username addresses
      }

      // Extract the username part
      const usernamePart = username.substring(0, atIndex);

      //console.log(usernamePart);

      // Remove any leading numbers or special characters
      const cleanedUsername = usernamePart.replace(/[^a-zA-Z0-9.]/g, "");

      console.log("cleanedUsername", cleanedUsername);

      return cleanedUsername;
    }

    const updatedUsername = getUsernameFromusername(username);

    res.render("weather.ejs", {
      updatedUsername: updatedUsername,
    });
  } catch (error) {
    console.log(error);

    res.status(404).json({ Error: "Error inserting user" });
  }
});

app.get("/weather", (req, res) => {
  res.render("weather.ejs");
});
app.post("/api/weather", async (req, res) => {
  const { country, city } = req.body;

  //console.log({ country: country, city: city });

  // Logic to fetch data from Public API ( Weather API)

  const fetchWeather = async (city, country) => {
    const api_key = "2da5630e790668b46010123fa0704347";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${api_key}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        console.log(data); // Weather data
        return data;
      } else {
        console.log(data.message); // Error handling
        return null;
      }
    } catch (error) {
      console.error("Error fetching weather data", error);
    }
  };

  // Fetch the weather data and respond to the client
  try {
    const weatherData = await fetchWeather(city, country);

    if (weatherData) {
      // implement the logic to send the necessary data to the frontend

      res.render("displayWeather.ejs", { weather: weatherData });
    } else {
      res.render("error", { message: "Weather data not found." });
    }
  } catch (error) {
    res.render("error", {
      message: "An error occurred. Please try again later.",
    });
  }
});

app.listen(port, function () {
  console.log(`listening on http://localhost:${port}`);
});
