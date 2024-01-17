import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "fs";
import { promises as fsPromises, existsSync } from "fs";
import path from "path";

const generatedUuid = uuid();

const logEvents = async (message: string) => {
  const formattedDate = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;
  const logItem = ` ${formattedDate}\t${generatedUuid}\t${message}\n`;

  console.log(logItem);
  try {
    if (!existsSync(path.join(__dirname, "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "logs", "eventLog.txt"),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

export default logEvents;
