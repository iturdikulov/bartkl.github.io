/* Rendering of Excalidraw images.

On each page navigation, all Excalidraw images are drawn, i.e. all image
elements with sources ending with `.excalidraw` are replaced with ones
that point to the corresponding image depending on the light or dark mode
setting.

Similarly, Excalidraw images are redrawn whenever the user toggles between
light and dark mode using the component provided by Quartz.
*/

function getUserPreferredColorScheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
}

function getTheme() {
  return localStorage.getItem("theme") ?? getUserPreferredColorScheme()
}

function draw(el, theme: "light" | "dark") {
  if (el.localName == "img") {
    let img = document.createElement("img")
    img.src = `${el.src}.${theme}.svg`
    el.replaceWith(img)
  }
 return el
}

function drawAll(e) {
  let theme = getTheme()
  Object.values(document.getElementsByTagName("article")[0]
                        .getElementsByTagName("img")).forEach(img => {
    if (img.src.endsWith(".excalidraw")) {
      draw(img, theme)
    }
  })
}


function redraw(img, targetTheme: "light" | "dark") {
  let srcParts = img.src.split(".")
  srcParts.splice(-2, 1, targetTheme)
  img.src = srcParts.join(".")

  return img
}

function redrawAll(e) {
  let targetTheme = getTheme()  // NOTE: Dependent on `Darkmode` component handler already having changed this value.
  let currentTheme = targetTheme == "dark" ? "light" : "dark"

  Object.values(document.getElementsByTagName("article")[0]
                        .getElementsByTagName("img")).forEach(img => {
    if (img.src.endsWith(`.excalidraw.${currentTheme}.svg`)) {
      redraw(img, targetTheme)
    }
  })
}

document.addEventListener("nav", (e) => {
  drawAll(e)

  const toggleSwitch = document.querySelector("#darkmode-toggle") as HTMLInputElement
  toggleSwitch.addEventListener("change", redrawAll)
  window.addCleanup(() => toggleSwitch.removeEventListener("change", redrawAll))
})
