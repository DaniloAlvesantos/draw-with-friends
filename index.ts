import { serve } from "bun";

const server = serve({
  port: 3000,
  fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response(Bun.file("./index.html"), {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }
    return new Response("Hello World");
  },
});

console.log(`Server running at http://localhost:${server.port}/`);
