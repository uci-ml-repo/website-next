// @ts-check

/**
 * @type {import('tailwindcss').Config}
 */
const config = {
  darkMode: "class",
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/mdx-components.tsx",
  ],
  theme: {
    extend: {
      containers: {
        "2xs": "16rem",
        "3xs": "14rem",
      },
      typography: {
        DEFAULT: {
          css: {
            "code::before": {
              content: "",
            },
            "code::after": {
              content: "",
            },
            h1: {
              fontSize: "1.5rem",
              lineHeight: "2rem",
            },
            h2: {
              fontSize: "1.25rem",
              lineHeight: "1.75rem",
            },
            h3: {
              fontSize: "1.125rem",
              lineHeight: "1.75rem",
            },
          },
        },
      },
      boxShadow: {
        sidebar: "0px 0px 16px 8px rgba(0, 0, 0, 0.1) !important",
      },
      screens: {
        xxs: "340px",
        xs: "480px",
      },
      width: {
        "screen-lg": "1024px",
        "screen-xl": "1280px",
        "screen-2xl": "1536px",
      },
      height: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
      },
      letterSpacing: {
        snug: "-0.015em",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        uci: {
          blue: {
            DEFAULT: "hsl(var(--uci-blue))",
            foreground: "hsl(var(--uci-blue-foreground))",
          },
          gold: {
            DEFAULT: "hsl(var(--uci-gold))",
            foreground: "hsl(var(--uci-gold-foreground))",
          },
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          muted: "hsl(var(--destructive-muted))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        positive: {
          DEFAULT: "hsl(var(--positive))",
        },
        border: "hsl(var(--border))",
        input: {
          DEFAULT: "hsl(var(--input))",
          background: "hsl(var(--input-background))",
        },
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          accent: "hsl(var(--sidebar-accent))",
          border: "hsl(var(--sidebar-border))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
        },
        link: "hsl(var(--link))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2.5xl": "1.25rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};

export default config;
