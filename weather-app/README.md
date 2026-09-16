# 🌤️ Atmosphere - Modern Glassmorphic Weather Dashboard

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)
![CSS3](https://img.shields.io/badge/CSS3-Glassmorphism-1572B6?style=flat-square&logo=css3)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A visually stunning, high-performance web application that delivers real-time weather tracking through a sleek **Glassmorphism UI**. Designed with interactive visual feedback, dynamic condition-based background video switching, and custom rainy glass-pane effects.

---

# 🌤️ Atmosphere - Modern Glassmorphic Weather Dashboard

A visually stunning, high-performance React web application that delivers real-time weather tracking, air quality monitoring, and multi-day forecasts through a sleek Glassmorphism UI. Built with condition-based dynamic video backgrounds, geolocation awareness, and persistent search history.

---

## ✨ Key Features

* **🎯 Geolocation Weather Tracking:** Automatically detects user coordinates via browser GPS on launch to fetch real-time local weather, featuring a quick-access target button to return to your current location anytime.
* **📍 Recent Searches & Favorites (LocalStorage):** Persists up to 5 recently searched cities using browser `localStorage` as glassmorphic quick-access chips with direct search and removal (`×`) options.
* **🌡️ Real-time Atmospheric Data:** Fetches live weather metrics including temperature, feels-like readings, humidity, and wind speed.
* **📊 Today's Highlights & Air Quality Index (AQI):** Displays comprehensive environmental metrics including Air Quality Index (Good to Very Poor status indicators), Sunrise/Sunset times, Visibility, and Surface Pressure.
* **📅 5-Day Weather Forecast:** Integrated multi-day forecast grid predicting upcoming conditions and temperature trends.
* **🔄 Imperial / Metric Unit Toggle:** Dynamic unit switching between Celsius (`°C`, `m/s`) and Fahrenheit (`°F`, `mph`) with instant re-fetching.
* **🎬 Dynamic Video Backgrounds:** Contextually renders distinct high-definition background videos (`rain.mp4`, `clear.mp4`) based on live weather API responses.
* **🎨 Custom Glassmorphism UI:** Frosted glass interface styled with backdrop blurs, subtle borders, and a custom multi-layered radial gradient overlay.
* **📱 Responsive Layout:** Built with dynamic viewports and media queries for smooth rendering across Desktop, Tablet, and Mobile devices.

---

## 🛠️ Tech Stack & Architecture

* **Frontend Framework:** React.js (Bootstrapped with Vite)
* **API Integration:** OpenWeatherMap REST API (Current Weather, 5-Day Forecast, Air Pollution APIs) via Axios
* **State Management:** React Hooks (`useState`, `useEffect`)
* **Persistence:** HTML5 LocalStorage API
* **Geolocation:** Web Geolocation API
* **Styling & Effects:** Pure CSS3 (Glassmorphism, Backdrop Filters, Flexbox/Grid, Keyframe Animations)
* **Version Control:** Git & GitHub

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine:

### Prerequisites

Make sure you have **Node.js** (v14.0 or higher) and **npm** installed on your system.

### Installation

