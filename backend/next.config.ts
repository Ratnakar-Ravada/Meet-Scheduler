module.exports = {
  async headers() {
    return [
      {
        source: "/api/auth/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "http://localhost:8080" }, // Allow requests from the frontend
          { key: "Access-Control-Allow-Credentials", value: "true" }, // Allow credentials
        ]
      }
    ];
  }
};

