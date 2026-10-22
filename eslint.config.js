import globals from "globals";

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "package-lock.json"
    ]
  },
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        THREE: "readonly"
      }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_", 
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-restricted-properties": [
        "error",
        {
          "property": "innerHTML",
          "message": "Strict interzis innerHTML (Zero-Trust DOM). Folosește textContent, createElement sau safeSetHTML cu DOMParser."
        },
        {
          "property": "outerHTML",
          "message": "Strict interzis outerHTML (Zero-Trust DOM)."
        },
        {
          "property": "style",
          "message": "Strict interzis element.style.* (Strict CSP style-src 'self'). Folosește classList sau atribute data-*."
        }
      ]
    }
  },
  {
    files: ["api/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_", 
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "no-eval": "error"
    }
  }
];
