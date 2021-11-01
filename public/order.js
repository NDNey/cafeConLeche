const ul = document.querySelector('.list-group')
const yell = document.querySelectorAll('.yell')
const synth = window.speechSynthesis;
const served = document.querySelectorAll(".served");
let data = {}

const prices = {
    americano: 2.25,
    espresso: 2.95,
    latte: 3.2,
    mocha: 3.45,
    cappuccino: 2.95,
    coldbrew: 2.9,
    large: 1.35,
    medium: 1.2,
    small: 1,
}



Array.from(served).forEach(function (element) {

    element.addEventListener('click', function (e) {
        let id = e.target.parentNode.parentNode.children[0].value
        fetch('served', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'id': id
            })
        })
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(data => {
                console.log(data)
                window.location.reload(true)
            })
    });
});





document.querySelectorAll('.pos').forEach(e => e.addEventListener('click', options => {
    document.querySelectorAll('.options').forEach(e => e.classList.add("hidden"))
    let cls = options.target.classList
    let li = `<li class="title list-group-item list-group-item-primary">${options.target.innerText}</li>`
    switch (true) {
        case cls.contains("coffee"):
            document.querySelector('#coffee').classList.remove("hidden")
            ul.innerHTML += li
            break;
        case cls.contains("milk"):
            document.querySelector('#milk').classList.remove("hidden")
            ul.innerHTML += li
            break;
        case cls.contains("add-ons"):
            document.querySelector('#sugar').classList.remove("hidden")
            ul.innerHTML += li
            break;
        case cls.contains("size"):
            document.querySelector('#size').classList.remove("hidden")
            ul.innerHTML += li
            break;
    }
}))

document.querySelectorAll('.fourth').forEach(el => el.addEventListener('click', list => {
    let choice = list.target.innerText
    let keeper = true
    document.querySelectorAll('li').forEach(el => {
        let listItem = el.innerText.slice(0, el.innerText.length - 2)
        if (listItem == choice) {
            el.children[0].innerText++
            keeper = false
        }
    })

    if (keeper) {
        let li = `<li class="list-group-item d-flex justify-content-between align-items-center">${choice}<span class="badge badge-primary badge-pill">${1}</span></li>`
        ul.innerHTML += li
    }
}
))

document.querySelector('#submit').addEventListener('click', getData => {
    let title = ''
    let customerName = document.querySelector('#name').value
    data.customerName = customerName
    document.querySelectorAll('li').forEach(el => {

        if (el.classList.contains("title")) {
            title = el.innerText.toLowerCase().replace('-', '')
            if (!data.hasOwnProperty(title)) {
                data[title] = []
            }
        } else {
            data[title].push(el.innerText)
        }
    })

    fetch('order', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(data => {
            console.log(data)
            window.location.reload(true)
        })
});




yell.forEach(e => e.addEventListener('click', el => {
    const parent = el.target.parentNode.parentNode.parentNode
    const name = parent.children[1].innerText
    const drink = parent.children[2].children[0].children[0].children[0].innerText.replace(/\d/g, '')
    let yellThis = new SpeechSynthesisUtterance(`${name}, your ${drink} is Ready`);
    synth.speak(yellThis);
}))




document.querySelector('#print').addEventListener('click',()=>{
    let total = 0
    document.querySelectorAll('.receipt__list-row').forEach(e => {
        let order = e.children[0].innerText.toLowerCase().replace(/\d|\s/g, '').split(',')
        let price = (prices[order[0]] * prices[order[1]]).toFixed(2)
        e.children[1].innerText = price
        total += Number(price)
    })
    document.querySelector('.total').innerText = total.toFixed(2)
   
 document.querySelector('#receipt').classList.remove("hidden")
}) 

 