import { addCallback, runCallbacks, applyFilters, setting } from "@factor/tools"
import { getPath } from "@factor/tools/paths"
import destroyer from "destroyer"
import express from "express"
import fs from "fs-extra"
import log from "@factor/tools/logger"
import LRU from "lru-cache"
import { createBundleRenderer } from "vue-server-renderer"

import { developmentServer } from "./server-dev"
import { handleServerError, getPort, getServerInfo, logServerReady } from "./util"
import { loadMiddleware } from "./middleware"

let __listening
let __renderer
let __application
addCallback("create-server", _ => createRenderServer(_))
addCallback("close-server", () => closeServer())

export function createRenderServer({ port }) {
  process.env.PORT = getPort(port)

  if (process.env.NODE_ENV == "development") {
    developmentServer(renderConfig => {
      createRenderer(renderConfig)

      if (!__listening) createServer()
    })
  } else {
    createRenderer({
      template: fs.readFileSync(setting("app.templatePath"), "utf-8"),
      bundle: require(getPath("server-bundle")),
      clientManifest: require(getPath("client-manifest"))
    })

    createServer()
  }

  return
}

export function createServer(options) {
  const { port = null } = options || {}

  process.env.PORT = getPort(port)

  __application = express()

  loadMiddleware(__application)

  __application.get("*", (request, response) => renderRequest(request, response))

  __listening = __application.listen(process.env.PORT, () => logServerReady())

  prepareListener()

  addCallback("restart-server", async () => {
    log.server("restarting server", { color: "yellow" })
    __listening.destroy()
    await runCallbacks("rebuild-server-app")
    createServer(options)
  })
}

function createRenderer({ bundle, template, clientManifest }) {
  // Allow for changing default options when rendering
  // particularly important for testing
  const options = applyFilters("server-renderer-options", {
    cache: new LRU({ max: 1000, maxAge: 1000 * 60 * 15 }),
    runInNewContext: false,
    directives: applyFilters("server-directives", {}),
    template,
    clientManifest
  })

  __renderer = createBundleRenderer(bundle, options)
}

export async function renderRequest(request, response) {
  response.setHeader("Content-Type", "text/html")
  response.setHeader("Server", getServerInfo())

  try {
    const html = await renderRoute(request.url)
    response.send(html)
  } catch (error) {
    handleServerError(request, response, error)
  }
}

// SSR - Renders a route (url) to HTML.
export async function renderRoute(url = "") {
  if (!__renderer) return "no renderer"

  return await __renderer.renderToString({ url })
}

function prepareListener() {
  __listening.destroy = destroyer(__listening)
}

export async function closeServer() {
  if (__listening) __listening.destroy()
}
