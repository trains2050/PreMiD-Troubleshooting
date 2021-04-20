let current = 0
let url = new URL(document.location)
let params = url.searchParams
let main = document.getElementById("main")
let questions, strings, langCode
let yes = "Yes", no = "No"

localise(1)

function start(t) {
    let langCookie = document.cookie.split("lang=")[1]
    if (langCookie) langCookie = langCookie.split(";")[0]
    langCode = langCookie || window.navigator.language || "en"
    if (t > 1) langCode = window.navigator.language.split("-")[0] || "en"
    if (t > 2) langCode = "en"
    if (t > 3) { window.location.href = window.location.href.split('?')[0] }
    if (t > 4) {
        main.innerHTML = "Couldn't load troubleshooter."
        return console.error("Loading steps: Aborted.")
    }

    fetch(`./strings/${langCode}.json`)
        .then((response) => response.json())
        .then((data) => {
            questions = data.steps
            main.innerHTML = ""
            ask()
        })
        .catch(() => {
            console.log("Loading steps: Failed.")
            start(t + 1)
        })
}

function localise(t) {
    let langCookie = document.cookie.split("lang=")[1]
    if (langCookie) langCookie = langCookie.split(";")[0]
    langCode = langCookie || window.navigator.language || "en"
    if (t > 1) langCode = window.navigator.language.split("-")[0] || "en"
    if (t > 2) langCode = "en"
    if (t > 3) {
        start(1)
        return console.error("Loading strings: Aborted.")
    }

    fetch(`https://raw.githubusercontent.com/QkeleQ10/Localisation/master/strings/${langCode}.json`)
        .then((response) => response.json())
        .then((data) => {
            strings = data
            if (!strings) localise(t + 1)
            document.documentElement.lang = langCode
            document.querySelectorAll("*[data-i18n]").forEach(e => e.innerHTML = strings[e.dataset.i18n] || e.innerHTML)
            document.querySelectorAll(".i18n").forEach(e => e.innerHTML = strings[e.innerHTML] || e.innerHTML)
            yes = strings[yes] || yes
            no = strings[no] || no
            start(1)
        })
        .catch(() => {
            console.log("Loading strings: Failed.")
            localise(t + 1)
        })
}

function openlangpicker() {
    let e = document.getElementById("langbutton")
    let langs = [["en", "English"], ["nl", "Nederlands"], ["de", "Deutsch"], ["fr", "Français"], ["pt", "Português"], ["pl", "Polski"], ["ru", "Русский"], ["tr", "Türkçe"], ["id", "Bahasa Indonesia"], ["ms", "Bahasa Melayu"]]

    let p = document.getElementById("langpopup")
    p.classList.remove("hidden")
    document.querySelector(".popupbk").classList.remove("hidden")
    document.getElementById("langlist").innerHTML = ""

    langs.forEach((l) => {
        let b = document.createElement("a")
        b.id = l[0]
        if (langCode === l[0]) b.setAttribute("disabled", true)
        b.innerHTML = l[1]
        b.setAttribute("onclick", "picklang(this.id)")
        document.getElementById("langlist").appendChild(b)
    })
}

function picklang(lang) {
    document.cookie = `lang=${lang}`
    window.location.reload()
}


function cont(a, b) {
    let e = questions[current]
    b.parentElement.innerHTML = `> ${b.innerHTML}`
    main.innerHTML = "<b>" + main.innerHTML + "</b>"
    if (!params.has(current)) params.append(current, b.id)
    window.history.pushState({}, "", url)
    document.getElementById("reset").style.display = "unset"
    if (current >= 1) document.getElementById("back").style.display = "unset"
    if (a === "next") {
        current++
        ask()
    } else if (a === "s") {
        main.innerHTML += `<br>${e.s}`
    } else if (typeof a === "number") {
        current = a
        ask()
    } else {
        main.innerHTML += `<br>${a}`
    }
    window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth'
    })
}

function ask() {
    let e = questions[current]
    if (current === 0) main.innerHTML += `${e.p}<br>`
    else main.innerHTML += `<br>${e.p}<br>`

    let div = document.createElement("div")
    div.classList.add("buttons")
    main.appendChild(div)
    if (e.b) {
        e.b.forEach(b => {
            a = b.a || "next"
            t = b.t || "Button"
            div.innerHTML += `<a id='${t}' onclick='cont("${a}", this)'>${t}</a> `
        })
    } else {
        div.innerHTML = `<a id='${yes}' onclick='cont("next", this)'>${yes}</a> <a id='${no}' onclick='cont("s", this)'>${no}</a>`
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