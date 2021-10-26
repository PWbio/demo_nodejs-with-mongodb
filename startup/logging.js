const morgan = require("morgan");
const winston = require("winston"); // we will set up default logger here.
const { format } = winston;
const { combine, timestamp, prettyPrint, colorize, simple, json } = format;
require("winston-mongodb");
require("express-async-errors"); // handle errors for async code inside express routes: catch error and pass it to next()

module.exports = {
  initialize: function (app) {
    /**
     * @note logger for normal message, such as console.log()
     */

    this.defaultLogger = winston.createLogger({
      level: "info",
      transports: [
        // write to local file
        new winston.transports.File({
          filename: "logs/logger.log",
          format: combine(timestamp(), json()),
        }),
        // write to mongoDB
        new winston.transports.MongoDB({
          db: "mongodb://localhost/logger",
          level: "info",
          options: { useUnifiedTopology: true },
        }),
      ],
    });

    /**
     * @note For winston@3.3.3, we cannot solely catch 'uncaughtRejection'.
     * @note We will catch both 'uncaughtException' and 'uncaughtRejection' at one file.
     */

    // handle error from sync code outside express routes (uncaughtException)

    //   winston.exceptions.handle(
    //     new winston.transports.File({
    //       filename: "logs/exceptions.log",
    //     })
    //   );

    // handle error from async code outside express routes (uncaughtRejection)

    // [open issue] https://github.com/winstonjs/winston/issues/1834
    // "winston.rejections" is not a public property.

    //   winston.rejections.handle(
    //     new winston.transports.File({
    //       filename: "logs/rejections.log",
    //     })
    //   );

    // [open issue] https://github.com/winstonjs/winston/issues/1673
    // 'handleRejections' will write on 'handleExceptions' transport. Cannot solely catch 'handleRejections'

    winston.add(
      new winston.transports.File({
        filename: "logs/ExRej.log",
        level: "warn",
        format: combine(timestamp(), json()),
        handleExceptions: true,
        handleRejections: true,
      })
    );

    // Another work-around is to catch async rejection and pass it to exception

    //   process.on("unhandledRejection", (ex) => {
    //     throw new Error(ex);
    //   });

    /**
     * @note pass morgan output (HTTP request) to winston
     */

    this.httpLogger = winston.createLogger({
      level: "http",
      transports: [
        new winston.transports.File({
          filename: "logs/http.log",
          format: combine(timestamp(), json()),
        }),
      ],
    });

    app.use(
      morgan("tiny", {
        stream: { write: (message) => this.httpLogger.http(message.trim()) },
      })
    );

    /**
     * @note print to console in development mode
     */

    if (process.env.NODE_ENV !== "production") {
      const console = (level, handleError) =>
        new winston.transports.Console({
          level: level,
          format: combine(prettyPrint(), colorize(), simple()),
          handleExceptions: handleError,
          handleRejections: handleError,
        });

      winston.add(console("warn", true));
      this.httpLogger.add(console("http", false));
      this.defaultLogger.add(console("info", false));

      winston.addColors({ http: "yellow" });
    }

    return this;
  },
};
