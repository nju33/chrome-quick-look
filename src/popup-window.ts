import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import { DEFAULT_VALUES } from './constants'
import { Options } from './interfaces'

async function createPopup(
  url: string,
  options: Options
): Promise<O.Option<chrome.windows.Window>> {
  return await new Promise((resolve) => {
    chrome.windows.create(
      {
        url,
        type: 'popup',
        width: options.inheritPreviousWindowSize
          ? options.previousWindowSize?.width ?? options.width
          : options.width,
        height: options.inheritPreviousWindowSize
          ? options.previousWindowSize?.height ?? options.height
          : options.height
      },
      (window) => resolve(O.fromNullable(window))
    )
  })
}

export type QuickLook = (url: string) => Promise<void>

export function init(): { quickLook: QuickLook } {
  const quickLook: QuickLook = async (url) => {
    const options = await new Promise<Options>((resolve) => {
      chrome.storage.local.get(null, (options) => {
        resolve(options as Options)
      })
    })
    const maybePopup = await createPopup(url, { ...DEFAULT_VALUES, ...options })

    if (options.inheritPreviousWindowSize) {
      // @ts-expect-error
      chrome.windows.onBoundsChanged.addListener(
        (window: { height: number; id: number; width: number }) => {
          pipe(
            maybePopup,
            O.map((popup) => {
              if (popup.id === window.id) {
                chrome.storage.local.set({
                  previousWindowSize: {
                    width: window.width,
                    height: window.height
                  }
                })
              }
            })
          )
        }
      )
    }

    chrome.windows.onFocusChanged.addListener((_id) => {
      pipe(
        maybePopup,
        O.map((popup) => {
          chrome.windows.remove(popup.id)
        })
      )
    })
  }

  return { quickLook }
}
