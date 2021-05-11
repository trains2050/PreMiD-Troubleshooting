let url = new URL(document.location)
let params = url.searchParams
let main = document.getElementById("main")
let questions, strings, languageCode, number, availableLanguages, showTimer, hideTimer

// Set language
let languageCookie = document.cookie.split("language=")[1]
if (languageCookie) languageCookie = languageCookie.split(";")[0]
languageCode = languageCookie || window.navigator.language

function correctSectionMargins() {
    let first = document.querySelector("section:first-of-type"), last = document.querySelector("section:last-of-type")
    first.style.marginTop = `calc(50vh - ${first.clientHeight / 2}px)`
    last.style.marginBottom = `calc(50vh - ${last.clientHeight / 2}px)`
    document.querySelectorAll("section").forEach(e => {
        if (e != first) {
            e.style.marginTop = ""
        }
        if (e != last) {
            e.style.marginBottom = ""
        }
    })
    setTimeout(() => document.querySelector("section:not(.blur)").scrollIntoView({ block: "center", behavior: "smooth" }), 250)
}

correctSectionMargins()


// Fetch strings
fetch(`https://raw.githubusercontent.com/QkeleQ10/Localisation/master/strings/${languageCode || "en"}.json`)
    .then((response) => response.json())
    .then((data) => {

        strings = data
        if (!strings) throw "error"
        document.documentElement.lang = languageCode
        document.querySelectorAll("*[data-i18n]").forEach(e => e.innerHTML = strings[e.dataset.i18n] || e.innerHTML)
        document.querySelectorAll(".i18n").forEach(e => e.innerHTML = strings[e.innerHTML] || e.innerHTML)


        // Fetch questions
        fetch(`steps.json`)
            .then((response) => response.json())
            .then((data) => {
                questions = data
                main.innerHTML = ""
                number = 0
                askQuestion()
            })
            .catch(e => {
                console.error(e)
            })

    })
    .catch(e => {
        document.cookie = "language=en"
        main.innerHTML = `<section class="deadend startstate"><p>Language not available. Switching to English...</p></section><section class="deadend blur startstate"><p>If this is taking too long, let me know on Discord (QkeleQ10#8482).</p></section>`
        correctSectionMargins()
        setTimeout(() => window.location.reload(), 2000)
        console.info("Error:")
        console.error(e)
    })



// Ask a question
function askQuestion() {
    let question = questions[number]

    // Append question
    main.innerHTML += `<section><p>${strings.premidts[question[0]]}</p><div class="buttons"></div></section>`

    // Append buttons
    let buttons = document.querySelector("div.buttons")
    question[1].forEach((action, index, array) => {
        if (action.deadend) {
            buttons.innerHTML += `<a id="action${index}" onclick="deadend('${action.deadend}', ${index}, this)">${strings.premidts[action.text]}</a>`
        } /*else if (action.followup) {
            buttons.innerHTML += `a`
        }*/ else {
            buttons.innerHTML += `<a id="action${index}" onclick="followup(${number + 1}, ${index}, this)">${strings.premidts[action.text]}</a>`
        }
    })

    // Scroll down and continue if needed
    if (params.has(number)) document.getElementById(`action${params.get(number)}`).click()

    // Correct section margins
    correctSectionMargins()

    // Show correct buttons
    if (number <= 0) hide(document.getElementById("previousQuestion")); else show(document.getElementById("previousQuestion"))
    if (number <= 1) hide(document.getElementById("reset")); else show(document.getElementById("reset"))
}


// Send a deadend response
function deadend(deadend, index, element) {

    // Unfocus
    if (deadend !== "noDiagnosis") {
        element.parentElement.parentElement.classList.add("blur")
        element.parentElement.outerHTML = `<!--${element.parentElement.outerHTML}--><b>${element.innerHTML}</b>`
    }

    // Append deadend
    main.innerHTML += `<section class="deadend"><p>${strings.premidts[deadend]}</p></section><section class="deadend blur"><p>${(strings.copyTease || "<a onclick='copy(%deadend%)'>Copy result</a>").replace("%deadend%", `"${deadend}"`)}</p></section>`

    // Add to searchParams
    if (deadend !== "noDiagnosis") {
        if (!params.has(number)) params.append(number, index)
        window.history.pushState({}, "", url)
    }

    // Correct section margins
    correctSectionMargins()
}


// Send a followup response
function followup(followup, index, element) {

    // Unfocus
    element.parentElement.parentElement.classList.add("blur")
    element.parentElement.outerHTML = `<!--${element.parentElement.outerHTML}--><b>${element.innerHTML}</b>`

    // Add to searchParams
    if (!params.has(number)) params.append(number, index)
    window.history.pushState({}, "", url)

    // Start next question
    if (typeof followup === "number") number = followup || number + 1
    else number++
    if (questions[number]) askQuestion()
    else deadend("noDiagnosis", index, element)
}



// Open the language menu
function openLanguagePicker() {
    let languages = [["en", "English"]]

    fetch(`https://raw.githubusercontent.com/QkeleQ10/Localisation/master/availableLanguages.json`)
        .then((response) => { return response.json() })
        .then((availableLanguages) => {
            fetch(`https://raw.githubusercontent.com/QkeleQ10/Localisation/master/languageNames.json`)
                .then((response) => { return response.json() })
                .then((languageNames) => {
                    availableLanguages.data.sort((a, b) => b.data.words.approved - a.data.words.approved).forEach(e => {
                        if (e.data.translationProgress > 35) languages.push([e.data.languageId, languageNames[e.data.languageId] || `"${e.data.languageId}"`])
                    })

                    let p = document.getElementById("languagePicker")
                    show(p)
                    show(document.querySelector(".popupBackground"))
                    document.getElementById("languageList").innerHTML = ""

                    languages.forEach((l) => {
                        let b = document.createElement("button")
                        b.id = l[0]
                        if (languageCode === l[0]) b.setAttribute("disabled", true)
                        b.innerHTML = l[1]
                        b.setAttribute("onclick", "selectLanguage(this.id)")
                        document.getElementById("languageList").appendChild(b)
                    })
                })
                .catch((e) => {
                    console.log(e)
                })
        })
        .catch(() => {
            console.log("Loading languages: Failed.")
        })
}


// Open the copy menu
function copy(deadend) {
    show(document.getElementById("resultCopier"))
    show(document.querySelector(".popupBackground"))
    let e = document.getElementById("textToCopy")
    e.value = document.location.href
    if (deadend) e.value += ` (result: ${deadend})`
    e.select()
    document.execCommand('copy')
}


// Open the information menu
function information() {
    show(document.getElementById("information"))
    show(document.querySelector(".popupBackground"))
}


// Select a language and reload
function selectLanguage(language) {
    document.cookie = `language=${language}`
    window.location.reload()
}


// Go back one question
function previousQuestion() {
    let ps = []
    for (const [key] of params) ps.push(key)
    params.delete(ps[ps.length - 1])
    window.history.pushState({}, "", url)
    main.innerHTML = ""
    number = 0
    askQuestion()
}

function reset() {
    let ps = []
    for (const [key] of params) ps.push(key)
    ps.forEach(p => params.delete(p))
    window.history.pushState({}, "", url)
    main.innerHTML = ""
    number = 0
    askQuestion()
}

function show(element) {
    if (!element.classList.contains("hidden") && !element.classList.contains("hiding")) return
    if (element.classList.contains("hiding")) element.classList.remove("hiding")
    clearTimeout(hideTimer)
    element.classList.add("hiding")
    element.classList.remove("hidden")
    showTimer = setTimeout(() => {
        element.classList.remove("hiding")
    }, 250)
}

function hide(element) {
    if (element.classList.contains("hidden")) return
    if (element.classList.contains("hiding")) element.classList.remove("hiding")
    clearTimeout(showTimer)
    element.classList.add("hiding")
    hideTimer = setTimeout(() => {
        element.classList.add("hidden")
        element.classList.remove("hiding")
    }, 250)
}