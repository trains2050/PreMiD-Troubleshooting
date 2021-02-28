const questions = [
  { p: "Have you installed the PreMiD extension and app?", s: "Please install the PreMiD extension and app from <a href='https://premid.app/downloads'>our site</a>." },
  { p: "Are you using Discord's desktop app (not the website)?", s: "Please switch to the desktop app, which you can download <a href='https://discord.com/download'>here</a>." },
  { p: "Are you using a modified version of Discord's desktop app (like BetterDiscord)?", s: "Please switch to the official desktop app, which you can download <a href='https://discord.com/download'>here</a>.", b: [{ t: "Yes", a: "s" }, { t: "No" }] },
  { p: "Have you enabled your Game Activity settings in Discord settings?", s: "Please enable the option in Discord settings under Game Activity." },
  { p: "When you open the extension in your browser, do you see a yellow (!)?", s: "Make sure the PreMiD application is running. If this doesn't work, try restarting your browser. Also make sure you haven't run Discord with administrator rights.<br>If these steps don't work, try reinstalling PreMiD <a href='https://premid.app/downloads'>here</a>.", b: [{ t: "Yes", a: "s" }, { t: "No" }] },
  { p: "Your issue couldn't be diagnosed. Try explaining your issue in the #support channel in our Discord server.", b: [] }
]
let current = 0
let ts = document.getElementById("ts")

ask()

function cont(a, b) {
  let e = questions[current]
  b.parentElement.innerHTML = b.innerHTML
  ts.innerHTML = "<b>" + ts.innerHTML + "</b>"
  if (a === "next") {
    current++
    ask()
  } else if (a === "s") {
    ts.innerHTML += e.s
  } else if (typeof a === "number") {
    current = a
    ask()
  } else {
    ts.innerHTML += a
  }
}

function ask() {
  let e = questions[current]
  ts.innerHTML += `${e.p}<br>`

  let div = document.createElement("div")
  div.classList.add("buttons")
  ts.appendChild(div)
  if (e.b) {
    e.b.forEach(b => {
      a = b.a || "next"
      t = b.t || "Button"
      div.innerHTML += `<a onclick="cont('${a}', this)">${t}</a> `
    })
  } else {
    div.innerHTML = `<a onclick="cont('next', this)">Yes</a> <a onclick="cont('s', this)">No</a>`
  }
}