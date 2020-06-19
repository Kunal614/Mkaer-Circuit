var alert = require('alert-node');
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
var parser = bodyParser.urlencoded({ extended: false });


const admin = require('firebase-admin');

const firebase = require('firebase');

const serviceAccount = require("./serviceAccountKey.json");



var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: ""
});

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
const publicDirPath = path.join(__dirname, '../public');

const csrfMiddleware = csrf({ cookie: true });
const app = express();

app.use(express.static("./public"));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.static(publicDirPath));

app.use(bodyParser.json());

app.use(cookieParser());
app.use(csrfMiddleware);

app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});



app.get('/', function(req, res) {

    res.render('signup');
})


app.get('/login', (req, res) => {
    console.log("kunaldk");
    res.render('login')
})




app.get('/profile/:name', parser, (req, res) => {
    console.log(req.params.name);
    var userid = String(req.params.name);
    firebase.database().ref(userid).on('value', function(data, err) {
        console.log(data.val().Username);
        res.render('profile', { data: data.val() });
    });

})


app.get('/main/:id', parser, (req, res) => {
    var userid;
    console.log(req.params.id);
    console.log("called");
    const sessionCookie = req.cookies.session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */ )
        .then(() => {
            //console.log("sx");
            var name;
            var userid = String(req.params.id);
            firebase.database().ref(userid).on('value', function(data, err) {
                console.log(data.val().Username);
                name = data.val().Username;
                res.render('index', { name: name });
            })
        })
        .catch((error) => {
            console.log(error);
            res.redirect("/login");
        });

});

app.post("/sessionLogin", (req, res) => {
    const idToken = req.body.idToken.toString();

    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
            (sessionCookie) => {
                const options = { maxAge: expiresIn, httpOnly: true };
                res.cookie("session", sessionCookie, options);
                res.end(JSON.stringify({ status: "success" }));
            },
            (error) => {
                res.status(401).send("UNAUTHORIZED REQUEST!");
            }
        );
});


app.get("/Forget", parser, (req, res) => {

    res.render("Email")
});

app.get("/Send/:email", parser, (req, res) => {
    console.log("sx");
    email = String(req.params.email);

    admin.auth().getUserByEmail(email).then(user => {
            firebase.auth().sendPasswordResetEmail(email)
            alert("Email sent");
            res.redirect('/login');
        }).catch((err) => {
            alert("Email Not Exist");
            res.status(204).send();
        })
        //res.send("cd");
});

app.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/login");
});




app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
})
