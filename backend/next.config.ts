module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*", // Covers both `/api/auth/:path*` and `/api/meet`
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.FRONTEND_URL || "*",
          },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/backend/api/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/api/:path*",
        destination: "/backend/api/:path*",
        permanent: true,
      },
    ];
  },
  output: "standalone",
};
