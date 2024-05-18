import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
  env: {
    TWAK_SECRET_KEY:
      "f547c3ba983919c3d51b979fb911cf2715f8f586ef933825c62dbd90614e6aaa99d15b286935be523a33aad7f7303247",
    SENDER_MAIL: "pachouriaman679@gmail.com",
    SENDER_PASS: "hafd kftw eqwl lkzu",
    RECEIVER_MAIL: "ampachouri09@gmail.com",
  },
});
