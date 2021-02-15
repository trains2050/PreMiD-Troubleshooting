const questions = [
  { prompt: "Have you installed the PreMiD extension and app?", solution: "Please install the PreMiD extension and app from <a href='https://premid.app/downloads'>our site</a>." },
  { prompt: "Are you using Discord's desktop app (not the website)?", solution: "Please switch to the desktop app, which you can download <a href='https://discord.com/download'>here</a>." },
  { prompt: "Are you using a modified version of Discord's desktop app (like BetterDiscord)?", solution: "Please switch to the official desktop app, which you can download <a href='https://discord.com/download'>here</a>.", swap: true },
  { prompt: "Have you enabled your Game Activity settings in Discord settings?", solution: "Please enable the option in Discord settings under Game Activity." },
  { prompt: "When you open the extension in your browser, do you see a yellow (!)?", solution: "Make sure the PreMiD application is running. If this doesn't work, try restarting your browser. Also make sure you haven't run Discord with administrator rights.<br>If these steps don't work, try reinstalling PreMiD <a href='https://premid.app/downloads'>here</a>.", swap: true }
]
let question = -1
let ts = document.getElementById("ts")
ask(ts)

function ask(t) {
  question++
  let e = questions[question]
  if (!e) return ts.innerHTML = `<b>${replaceA(ts.innerHTML, t.innerHTML)}</b>Your issue couldn't be diagnosed. Try explaining your issue in the #support channel in our Discord server.`
  if (!e.swap) ts.innerHTML = `<b>${replaceA(ts.innerHTML, t.innerHTML)}</b>${e.prompt}<br>> <a onclick="ask(this)">Yes</a><i> or </i><a onclick="solve(this)">No</a><br><br>`
  else ts.innerHTML = `<b>${replaceA(ts.innerHTML, t.innerHTML)}</b>${e.prompt}<br>> <a onclick="solve(this)">Yes</a><i> or </i><a onclick="ask(this)">No</a><br><br>`
}

function solve(t) {
  let e = questions[question]
  ts.innerHTML = `<b>${replaceA(ts.innerHTML, t.innerHTML)}</b>${e.solution}`
}

function replaceA(s, a) {
  let e = questions[question - 1]
  return s.replace(`<a onclick="ask(this)">Yes</a><i> or </i><a onclick="solve(this)">No</a>`, a + "<i>.</i>").replace(`<a onclick="solve(this)">Yes</a><i> or </i><a onclick="ask(this)">No</a>`, a + "<i style='opacity:0'>.</i>")
}