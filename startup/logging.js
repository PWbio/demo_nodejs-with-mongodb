// we will set up default logger here.
const winston = require("winston");
const { format } = winston;
const { combine, timestamp, prettyPrint, colorize, simple, json } = format;
require("winston-mongodb");

// handle errors for async code inside express routes: catch error and pass it to next()
require("express-async-errors");

module.exports = function () {
  // write to local file
  winston.add(
    new winston.transports.File({
      filename: "logs/logfile.log",
      level: "info",
      format: combine(timestamp(), json()),
    })
  );

  // write to mongoDB
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/logger",
      level: "info",
      options: { useUnifiedTopology: true },
    })
  );

  // print to console in development mode
  if (process.env.NODE_ENV !== "production") {
    winston.add(
      new winston.transports.Console({
        level: "info",
        format: combine(prettyPrint(), colorize(), simple()),
        handleExceptions: true,
        handleRejections: true,
      })
    );
  }

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
      level: "info",
      format: combine(timestamp(), json()),
      handleExceptions: true,
      handleRejections: true,
    })
  );

  // Another work-around is to catch async rejection and pass it to exception

  //   process.on("unhandledRejection", (ex) => {
  //     throw new Error(ex);
  //   });
};
