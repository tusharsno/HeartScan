// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: true,
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	images: {
		formats: ['image/webp', 'image/avif'],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
}

export default nextConfig