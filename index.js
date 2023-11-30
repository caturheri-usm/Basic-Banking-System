require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Sentry = require("@sentry/node");
const { ProfilingIntegration } = require("@sentry/profiling-node");
const port = process.env.PORT || 3000;
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");
const swaggerDocument = require("./swagger.json");
const routers = require("./routes");
const passport = require("./utils/passport");

app.use(morgan("combined"));

app.use(flash());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./app/view"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

Sentry.init({
  dsn: "https://3196b674dbb3fb07836f293e01339d4c@o4506297970130944.ingest.sentry.io/4506297982713856",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());

app.use(Sentry.Handlers.tracingHandler());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", routers);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app
