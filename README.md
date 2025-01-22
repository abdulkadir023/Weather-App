# WeatherNow App

WeatherNow is a responsive web application that provides real-time weather updates for any city using the OpenWeatherMap API. It dynamically displays weather conditions, temperature, and location with visually appealing design elements.

## Features

- **Real-Time Weather Data**: Fetches accurate weather information from the OpenWeatherMap API.
- **Responsive Design**: Optimized for devices of all screen sizes using Bootstrap and CSS.
- **Dynamic Icons**: Displays weather conditions with appropriate icons.
- **User-Friendly Interface**: Designed with gradient backgrounds and custom fonts for an engaging user experience.

## Technologies Used

- **Frontend**:
  - HTML5
  - CSS3
  - Bootstrap 5
- **API Integration**:
  - OpenWeatherMap API

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/weather-now.git
   ```

2. Navigate to the project directory:

   ```bash
   cd weather-now
   ```

3. Open the `index.html` file in your browser:
   ```bash
   open index.html
   ```

## Usage

1. Enter the name of the city in the input field.
2. Click the "Search" button.
3. View the real-time weather updates for the selected city.

## API Key Configuration

This application requires an API key from OpenWeatherMap. Follow these steps to configure it:

1. Sign up or log in to [OpenWeatherMap](https://openweathermap.org/).
2. Obtain your API key from the dashboard.
3. Replace `YOUR_API_KEY` in the JavaScript file with your actual API key:
   ```javascript
   const apiKey = "YOUR_API_KEY";
   ```

## Screenshots

![Desktop](./public/Desktop.png)
![Mobile](./public/mobile.png)

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the API.
- [Bootstrap](https://getbootstrap.com/) for responsive design.
- Inspiration from various online resources and weather apps.
