import type { NextConfig } from "next";

const imageHost = process.env.NEXT_PUBLIC_IMAGE_HOST || "commerce-product-images-a7x9.s3.eu-west-1.amazonaws.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d2lihcpe48nrxn.cloudfront.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: imageHost,
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;