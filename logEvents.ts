import { format } from "date-fns";
import { v4 as uuid } from "uuid";

const formattedDate = format(new Date(), "yyyy-MM-dd\tHH:mm:ss");
const generatedUuid = uuid();

console.log(formattedDate);
console.log(generatedUuid);
