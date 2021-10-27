const morgan = require("morgan");
const winston = require("winston"); // we will set up default logger here.
const { format } = winston;
const { combine, timestamp, prettyPrint, colorize, simple, json } = format;
require("winston-mongodb");
require("express-async-errors"); // handle errors for async code inside express routes: catch error and pass it to next()
const isDev = require("../startup/devState");

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
     * handle errors outside middleware (method 1, used)
     * @approach catch 'uncaughtException' and 'uncaughtRejection' in one file.
     * @note For winston@3.3.3, we cannot solely catch 'uncaughtRejection'.
     * @openIssue https://github.com/winstonjs/winston/issues/1673
     * @openIssue 'handleRejections' will write on 'handleExceptions' transport. Cannot solely catch 'handleRejections'
     */
    winston.add(
      new winston.transports.File({
        filename: "logs/ExRej.log",
        level: "warn",
        format: combine(timestamp(), json()),
        handleExceptions: true,
        handleRejections: true,
      })
    );

    /**
     * handle errors outside middleware (method 2, clean code, but not work due to bug in winston@3.3.3)
     * @approach catch 'uncaughtException' and 'uncaughtRejection' in separate files.
     * @openIssue https://github.com/winstonjs/winston/issues/1834
     * @openIssue "winston.rejections" is not exposed as a public property.
     */
    // handle error from sync code outside express routes (uncaughtException)
    //   winston.exceptions.handle(
    //     new winston.transports.File({
    //       filename: "logs/exceptions.log",
    //     })
    //   );

    // handle error from async code outside express routes (uncaughtRejection)
    //   winston.rejections.handle(
    //     new winston.transports.File({
    //       filename: "logs/rejections.log",
    //     })
    //   );

    /**
     * handle errors outside middleware (method 3, work but not ideal)
     * @approach catch 'uncaughtRejection', throw an error, and catch as 'uncaughtException'.
     */
    //   process.on("unhandledRejection", (ex) => {
    //     throw new Error(ex);
    //   });

    /**
     * @note pass morgan output (HTTP request) to winston
     */

    this.httpLogger = winston.createLogger({
      level: "verbose",
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

    if (isDev) {
      const console = (level, handleError) =>
        new winston.transports.Console({
          level: level,
          format: combine(prettyPrint(), colorize(), simple()),
          handleExceptions: handleError,
          handleRejections: handleError,
        });

      winston.add(console("warn", true));
      this.httpLogger.add(console("verbose", false));
      this.defaultLogger.add(console("info", false));

      winston.addColors({ http: "yellow" });
    }

    return this;
  },
};
