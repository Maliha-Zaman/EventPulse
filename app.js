const express = require("express");
const app = express();
const bodyParser = require("body-parser"); // parse the body of HTTP request
const cookieParser = require("cookie-parser"); //parse cookies that are sent with HTTP request
const session = require("express-session");
const flash = require('express-flash')
const passport = require("passport");
require("./config/passport")(passport);
const User = require("./dataModels/User.model");


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret:"secret",
    resave: false,  // we can resave the session if nothing is change
    saveUninitialized: false,  //we can save empty value
  })
);


app.use(passport.initialize());
app.use(passport.session());

// To store image/files
app.use(express.static('./uploads'))



//Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const cors = require("cors");   //Cross-origin resource sharing (CORS) is a browser mechanism which
                                  //  enables controlled access to resources located outside of a given domain.
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
}));
app.get('/createEvent', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'createEvent.html'));
});
const routes = require("./routes/auth.routes");
app.use(routes);

const eventRoutes = require("./routes/event.routes");


app.use('/events', eventRoutes);
const ForgotPass = require("./routes/forgotPass.routes");
app.use(ForgotPass);




const ensureAuthenticated = require("./middlewares/auth.middleware");
app.get("/welcome", ensureAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/views/homePage.html");
});
app.get("/create-event", ensureAuthenticated, (req, res) => {
  // Render your create event form or page here
  res.sendFile(__dirname + "/views/createEvent.html");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: '1040658690831-p0tpuhov94bkehjhtrgo5j4ab0kvj9lq.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/google/callback' 
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try {
       // const user = await User.findOne({ googleId: profile.id });
       let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          
          // User already exists, return the user
          return done(null, user);
        }

        // User doesn't exist, create a new user
        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          isOAuth: true,
         
        });

        await newUser.save();

        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
));


passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
  console.log(user)
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/google/callback',
passport.authenticate( 'google', {
  successRedirect: '/protected',
  failureRedirect: '/auth/failure'
})
);

app.get('/protected', isLoggedIn, (req, res) => {
  const htmlWithScript = `
    <script>
      alert('Registration successful');
      window.location.href = '/welcome'; // Change to your actual welcome page URL
    </script>
  `;
  res.send(htmlWithScript);
});

app.get('/auth/failure', (req, res) => {
  res.send('Failed to authenticate..');
});


//Connect to DB
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((error) => {
    console.log(error);
  });


module.exports = app;
