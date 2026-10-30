// Runs before hydration, ahead of client modules such as Framer Motion.
// Framer Motion caches requestAnimationFrame at import time, and <Lapse>
// only patches the clock when it mounts. The install entry has to run
// synchronously and first. The production branch is dead and must not pull
// the package into the production bundle.
if (process.env.NODE_ENV !== "production") {
  require("@aiforui/lapse/install");
}
