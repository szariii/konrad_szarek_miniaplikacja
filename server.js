var express = require("express")
var app = express()
const PORT = 3000;
var hbs = require('express-handlebars');
var path = require("path")
app.use(express.static('static'))
const bodyParser = require("body-parser");
const { report } = require("process");


flag = false
var tab = [
    { id: 1, login: "AAA", pass: "PASS1", wiek: 10, uczen: "checked", plec: "m" },
    { id: 2, login: "BBB", pass: "PASS2", wiek: 5, plec: "k" },
    { id: 3, login: "CCC", pass: "PASS3", wiek: 30, uczen: "checked", plec: "m" }
]

var id = 4

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    context = {}
    if (flag == true) {
        context.logout = "logout"
    }
    res.render('index.hbs', context)
})

app.get("/register", function (req, res) {
    context = {}
    calosc = []
    for (let i = 1; i < 116; i++) {
        let dana = {}
        dana.i = i
        dana.x = i
        calosc.push(dana)
    }
    context.dane = calosc
    if (flag == true) {
        context.logout = "logout"
    }
    res.render("register.hbs", context)
    //res.redirect ---> potrzeba
})

app.post("/rejestracja", function (req, res) {
    context = {}
    if (flag == true) {
        context.logout = "logout"
    }
    console.log(req.body)
    let dane = req.body
    dane.id = id
    id = id + 1
    tab.push(dane)
    console.log(tab)
    res.redirect("/login")
})

app.get("/login", function (req, res) {
    context = {}
    if (flag == true) {
        context.logout = "logout"
    }
    res.render("login.hbs", context)
})

app.post("/logowanie", function (req, res) {
    context = {}
    if (flag == true) {
        context.logout = "logout"
    }
    //console.log(req.body)
    loginy = []
    for (let i = 0; i < tab.length; i++) {
        console.log(tab[i].log)
        if (tab[i].login == req.body.login) {
            loginy.push(i)
        }
    }
    //console.log(loginy)
    for (let j = 0; j < loginy.length; j++) {
        if (tab[loginy[j]].pass == req.body.pass) {
            flag = true
            res.redirect("/admin")
        }
    }
    if (flag == false) {
        res.redirect("/logowanie")
    }
})

app.get("/admin", function (req, res) {
    context = {}
    if (flag == true) {
        context.logout = "logout"
    }

    if (flag == true) {
        res.render("admin_zalogowany.hbs", context)
    } else {
        res.render("admin_niezalogowany.hbs", context)
    }

})

app.get("/logout", function (req, res) {
    flag = false
    res.redirect("/login")
})

app.get("/sort", function (req, res) {
    context = {}
    context.dane = tab
    if (flag == true) {
        context.logout = "logout"
    }

    console.log(req.query.sortowanie)

    if (req.query.sortowanie == "up") {
        tab.sort(function (a, b) {
            return parseFloat(a.wiek) - parseFloat(b.wiek);
        });
    } else {
        tab.sort(function (a, b) {
            return parseFloat(a.wiek) - parseFloat(b.wiek);
        }).reverse();
    }

    //console.log(context)
    res.render("sort.hbs", context)
})

app.get("/gender", function (req, res) {
    context = {}
    context.dane = tab
    if (flag == true) {
        context.logout = "logout"
    }

    kobiety = []
    inni = []

    for (let i = 0; i < tab.length; i++) {
        if (tab[i].plec == "k") {
            kobiety.push(tab[i])
        } else {
            inni.push(tab[i])
        }
    }


    context.kobiety = kobiety
    context.inni = inni

    res.render("gender.hbs", context)
})

app.get("/show", function (req, res) {
    context = {}
    context.dane = tab
    if (flag == true) {
        context.logout = "logout"
    }

    tab.sort(function (a, b) {
        return parseFloat(a.wiek) - parseFloat(b.wiek);
    }).reverse();


    res.render("show.hbs", context)
})

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');

app.listen(process.env.PORT || PORT, function () {
    console.log("start serwera na porcie " + PORT)
})