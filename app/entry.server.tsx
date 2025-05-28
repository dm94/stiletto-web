import type { EntryContext, AppLoadContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { I18nextProvider } from "react-i18next";
import i18next from "./i18next.server";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "node:stream";

const ABORT_DELAY = 5_000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext
) {
  responseHeaders.set("Content-Type", "text/html");

  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
        i18next // Pass the main i18next instance
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
        i18next // Pass the main i18next instance
      );
}

async function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  i18nInstance: typeof i18next
) {
  responseHeaders.set("Content-Type", "text/html");

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18nInstance}>
        <RemixServer
          context={remixContext}
          url={request.url}
          abortDelay={ABORT_DELAY}
        />
      </I18nextProvider>,
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = new ReadableStream({
            start(controller) {
              body.on("data", (data) => {
                controller.enqueue(data);
              });
              body.on("end", () => {
                controller.close();
              });
              body.on("error", (error) => {
                controller.error(error);
              });
            },
          });

          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

async function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  i18nInstance: typeof i18next
) {
  responseHeaders.set("Content-Type", "text/html");

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18nInstance}>
        <RemixServer
          context={remixContext}
          url={request.url}
          abortDelay={ABORT_DELAY}
        />
      </I18nextProvider>,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = new ReadableStream({
            start(controller) {
              body.on("data", (data) => {
                controller.enqueue(data);
              });
              body.on("end", () => {
                controller.close();
              });
              body.on("error", (error) => {
                controller.error(error);
              });
            },
          });

          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}