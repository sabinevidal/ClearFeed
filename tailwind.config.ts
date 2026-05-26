import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background tokens
        cream: {
          50: '#f7f2e8',   // bg-gradient-start
          100: '#f5f0e6',  // bg-primary (main background)
          200: '#f0ead8',  // bg-gradient-end
          300: '#e0d9cc',
          400: '#d9d3c7',
        },
        brand: {
          dark: '#1a1a1a',       // text-primary
          body: '#2a2a2a',       // text-secondary (bubble descriptions)
          muted: '#999',         // text-muted (timestamps, secondary labels)
          detail: '#666',        // text-detail (expanded tip text)
          border: 'rgba(0,0,0,0.04)', // border-subtle
        },
        // Category colors for manipulation tactics
        category: {
          attention: '#E8A830',  // Golden amber
          emotional: '#E86B4A',  // Warm coral
          urgency: '#3B8FE8',   // Medium blue
          retention: '#6B5AC7',  // Muted purple
          visual: '#2EAAA0',    // Teal
          audio: '#C75AAF',     // Pink-purple
        },
        // UI colors
        bubble: {
          bg: 'rgba(255,255,255,0.82)',
          'bg-active': 'rgba(255,255,255,0.88)',
        },
        // Status colors (mapped from score badge)
        status: {
          safe: '#2e7d32',
          'safe-light': '#f0f7f0',
          warning: '#e65100',
          'warning-light': '#fff0f0',
        },
        accent: {
          gold: '#E8A830',
          'gold-light': '#fef3cd',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'SF Pro Display',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        card: '16px',
        video: '18px',
        bubble: '16px',
        pill: '20px',
        'score-pill': '28px',
      },
      spacing: {
        'header-y': '14px',
        'header-x': '32px',
        'content-x': '16px',
        'content-top': '12px',
        'content-bottom': '16px',
        'bubble-gap': '14px',
        'col-gap': '16px',
      },
      boxShadow: {
        bubble: '0 2px 16px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
        video: '0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
      },
      backdropBlur: {
        bubble: '16px',
      },
      animation: {
        'blob-drift': 'blobDrift 7s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'highlight-pulse': 'highlightPulse 2s ease-out',
      },
      keyframes: {
        blobDrift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(3%, -3%) scale(1.06)' },
          '66%': { transform: 'translate(-3%, 3%) scale(0.94)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.3)' },
        },
        highlightPulse: {
          '0%': { transform: 'scale(1)', borderColor: 'transparent' },
          '50%': { transform: 'scale(1.015)' },
          '100%': { transform: 'scale(1)', borderColor: 'transparent' },
        },
      },
      fontSize: {
        'product-name': ['17px', { fontWeight: '700', letterSpacing: '-0.3px' }],
        'detection-counter': ['13px', { fontWeight: '600' }],
        'score-badge': ['13px', { fontWeight: '600' }],
        'category-pill': ['10.5px', { fontWeight: '650', letterSpacing: '0.6px' }],
        'bubble-desc': ['13px', { fontWeight: '440' }],
        'bubble-detail': ['12.5px', { fontWeight: '400' }],
        'spot-label': ['10.5px', { fontWeight: '600', letterSpacing: '0.5px' }],
        'timeline-label': ['11px', { fontWeight: '500' }],
        'video-title': ['15px', { fontWeight: '600' }],
        'video-meta': ['12px', { fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};

export default config;
