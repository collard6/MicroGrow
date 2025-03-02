# MicroGrow Tracker

A comprehensive management system for microgreen growers. Track varieties, trays, schedules, inventory, and quality metrics to optimize your microgreen production.

## Features

- **Variety Management**: Store detailed information about each microgreen variety, including growing specifications, expected yields, and pricing.
- **Tray Tracking**: Monitor each tray from seeding to harvest with detailed status tracking.
- **Production Scheduling**: Automated planning tools to maintain continuous production.
- **Inventory Management**: Track seeds, supplies, and schedule reorders.
- **Quality Control**: Monitor and improve the quality of your microgreens.
- **Analytics & Reporting**: Gain insights into your operation with detailed reports.
- **Marketplace**: Connect with buyers and sell your microgreens (optional feature).
- **Mobile App**: Access the system from your phone while in the growing area.

## Technology Stack

- **Frontend**: React, Redux, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (or Docker for containerized setup)
- npm or yarn

### Installation

#### Option 1: Local Development

1. Clone the repository
   ```
   git clone https://github.com/yourusername/microgrow-tracker.git
   cd microgrow-tracker
   ```

2. Install dependencies
   ```
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables
   ```
   # In the server directory, create a .env file with the following variables
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/microgrow-tracker
   JWT_SECRET=your_secret_key_here
   ```

4. Start the development servers
   ```
   # In the root directory
   npm run dev
   ```

#### Option 2: Docker Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/microgrow-tracker.git
   cd microgrow-tracker
   ```

2. Start the Docker containers
   ```
   docker-compose up -d
   ```

3. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
microgrow-tracker/
├── client/                  # Frontend React application
│   ├── public/              # Static assets
│   └── src/                 # React source code
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
│       ├── context/         # React contexts
│       ├── utils/           # Utility functions
│       └── styles/          # CSS and styling
│
├── server/                  # Backend Node.js/Express application
│   ├── controllers/         # Route controllers
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   └── utils/               # Utility functions
│
├── mobile/                  # React Native mobile app
│
└── docker-compose.yml       # Docker configuration
```

## API Documentation

The API documentation is available at `/api/docs` when running the server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The microgreen growing community for inspiration and feedback
- All open source libraries and tools used in this project
