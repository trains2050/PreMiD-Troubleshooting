let url = new URL(document.location)
let params = url.searchParams
let main = document.getElementById("main")
let questions, strings, languageCode, number, availableLanguages

// Set language
let languageCookie = document.cookie.split("language=")[1]
if (languageCookie) languageCookie = languageCookie.split(";")[0]
languageCode = languageCookie || window.navigator.language


// Fetch strings
fetch(`https://raw.githubusercontent.com/QkeleQ10/Localisation/master/strings/${languageCode || "en"}.json`)
    .then((response) => response.json())
    .then((data) => {

        strings = data
        if (!strings) {
            document.cookie = "language=en"
            main.innerHTML = "Language not available. Hang on..."
            setTimeout(() => window.location.reload(), 1000)
        }
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
        main.innerHTML = "Language not available. Hang on..."
        setTimeout(() => window.location.reload(), 1000)
        console.info("Error:")
        console.error(e)
    })



// Ask a question
function askQuestion() {
    let question = questions[number]

    // Add spacing and append question
    if (number == 0) main.innerHTML += `${strings.premidts[question[0]]}<br>`
    else main.innerHTML += `<br>${strings.premidts[question[0]]}<br>`

    // Append buttons
    let buttons = document.createElement("div")
    buttons.classList.add("buttons")
    main.appendChild(buttons)
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
    window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth'
    })
    if (params.has(number)) document.getElementById(`action${params.get(number)}`).click()
}


// Send a deadend response
function deadend(deadend, index, element) {

    // Stylise main and append deadend
    if (element?.parentElement) element.parentElement.innerHTML = `> ${element.innerHTML}`
    main.innerHTML = main.innerHTML.replace("<b>", "").replace("</b>", "")
    main.innerHTML = `<b>${main.innerHTML}</b><br>${strings.premidts[deadend]}`

    // Add to searchParams
    if (!params.has(number)) params.append(number, index)
    window.history.pushState({}, "", url)
    document.getElementById("reset").style.display = "unset"
    if (number >= 1) document.getElementById("previousQuestion").style.display = "unset"
}


// Send a followup response
function followup(followup, index, element) {

    // Stylise main
    element.parentElement.innerHTML = `> ${element.innerHTML}`
    main.innerHTML = main.innerHTML.replace("<b>", "").replace("</b>", "")
    main.innerHTML = `<b>${main.innerHTML}</b>`

    // Add to searchParams
    if (!params.has(number)) params.append(number, index)
    window.history.pushState({}, "", url)
    document.getElementById("reset").style.display = "unset"
    if (number >= 1) document.getElementById("previousQuestion").style.display = "unset"

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
                    p.classList.remove("hidden")
                    document.querySelector(".popupBackground").classList.remove("hidden")
                    document.getElementById("languageList").innerHTML = ""

                    languages.forEach((language) => {
                        let a = document.createElement("a")
                        a.id = language[0]
                        if (languageCode === language[0]) a.setAttribute("disabled", true)
                        a.innerHTML = language[1]
                        a.setAttribute("onclick", "selectLanguage(this.id)")
                        document.getElementById("languageList").appendChild(a)
                    })
                })
                .catch(() => {
                    console.log("Loading languages: Failed.")
                })
        })
        .catch(() => {
            console.log("Loading languages: Failed.")
        })
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
    window.location.reload()
}