const webpack = require("webpack");
module.exports = {
	env: {
		NEXT_PUBLIC_API_URL:
			process.env.NODE_ENV === "production"
				? "https://your-production-url.com/api"
				: "http://localhost:8000/api",
	}
};
