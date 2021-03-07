const questions = [
  { p: "Have you installed both the PreMiD extension and application?", s: "Please install the PreMiD extension and app from <a href='https://premid.app/downloads'>our site</a>." },
  { p: "How are you using Discord?", s: "Please switch to the desktop app, which you can download <a href='https://discord.com/download'>here</a>.", b: [{ t: "Via the desktop app" }, { t: "On my phone or tablet", a: "PreMiD does not work on mobile devices yet!" }, { t: "In my browser", a: "s" }] },
  { p: "Are you using a modified version of Discord's desktop app (like BetterDiscord)?", s: "Please switch to the official desktop app, which you can download <a href='https://discord.com/download'>here</a>.", b: [{ t: "Yes", a: "s" }, { t: "No" }] },
  { p: "Have you enabled your Game Activity settings in Discord settings?", s: "Please enable the option in Discord settings under Game Activity." },
  { p: "When you open the extension in your browser, do you see a yellow (!)?", s: "Make sure the PreMiD application is running. If this doesn't work, try restarting your browser. Also make sure you haven't run Discord with administrator rights.<br>If these steps don't work, try reinstalling PreMiD <a href='https://premid.app/downloads'>here</a>.", b: [{ t: "Yes", a: "s" }, { t: "No" }] },
  { p: "Try opening <a href='https://premid.app'>our main site</a>. Does it display a presence for that?", s: "Make sure you've installed the presence for the site you want it to display for. If a presence doesn't work, please explain the issue in the #support channel in our Discord server.", b: [{ t: "Yes", a: "s" }, { t: "No" }] },
  { p: "What browser are you using?", s: "Please go to 'brave://settings/shields' and disable 'Trackers & ads blocking'.", b: [{ t: "Microsoft Edge" }, { t: "Google Chrome" }, { t: "Mozilla Firefox" }, { t: "Brave", a: "s" }, { t: "Another Chromium browser" }, { t: "Another non-Chromium browser", a: "PreMiD might not work on your browser (yet). Please join our Discord server and check!" }] },
  { p: "This troubleshooter couldn't diagnose your issue. Try explaining your issue in the #support channel in our Discord server.", b: [] }
]
let current = 0
let ts = document.getElementById("ts")
let url = new URL(document.location)
let params = url.searchParams

ask()

function cont(a, b) {
  let e = questions[current]
  b.parentElement.innerHTML = `> ${b.innerHTML}`
  ts.innerHTML = "<b>" + ts.innerHTML + "</b>"
  if (!params.has(current)) params.append(current, b.id)
  window.history.pushState({}, "", url)
  document.getElementById("reset").style.display = "unset"
  if (current >= 1) document.getElementById("back").style.display = "unset"
  if (a === "next") {
    current++
    ask()
  } else if (a === "s") {
    ts.innerHTML += `<br>${e.s}`
  } else if (typeof a === "number") {
    current = a
    ask()
  } else {
    ts.innerHTML += `<br>${a}`
  }
  window.scrollTo({
    top: document.body.scrollHeight,
    left: 0,
    behavior: 'smooth'
  })
}

function ask() {
  let e = questions[current]
  if (current === 0) ts.innerHTML += `${e.p}<br>`
  else ts.innerHTML += `<br>${e.p}<br>`

  let div = document.createElement("div")
  div.classList.add("buttons")
  ts.appendChild(div)
  if (e.b) {
    e.b.forEach(b => {
      a = b.a || "next"
      t = b.t || "Button"
      div.innerHTML += `<a id='${t}' onclick='cont("${a}", this)'>${t}</a> `
    })
  } else {
    div.innerHTML = `<a id='Yes' onclick='cont("next", this)'>Yes</a> <a id='No' onclick='cont("s", this)'>No</a>`
  }
  window.scrollTo({
    top: document.body.scrollHeight,
    left: 0,
    behavior: 'smooth'
  })
  if (params.has(current)) {
    document.getElementById(params.get(current)).click()
  }
}

function back() {
  let ps = []
  for (const [key] of params) ps.push(key)
  params.delete(ps[ps.length - 1])
  window.history.pushState({}, "", url)
  window.location.reload()
}