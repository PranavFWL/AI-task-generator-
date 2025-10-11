import type { NextConfig } from "next";
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['ai-agent-task-manager'],
  turbopack: {
    root: __dirname,
    resolveAlias: {
      '@parent': path.resolve(__dirname, '..'),
    },
  },
  webpack: (config, { isServer }) => {
    // Allow importing from parent src directory
    config.resolve.alias = {
      ...config.resolve.alias,
      '@parent': path.resolve(__dirname, '..'),
    };

    // Allow importing from outside the project root
    if (isServer) {
      config.externals = config.externals || [];
      // Don't bundle parent project - load it at runtime
      config.externals.push({
        '../dist/AIAgentSystem.js': 'commonjs ../dist/AIAgentSystem.js'
      });
    }

    return config;
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};

export default nextConfig;
