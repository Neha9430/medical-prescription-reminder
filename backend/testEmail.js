// testEmail.js

import { sendReminderEmail } from "./utils/emailService.js";

const test = async () => {
  await sendReminderEmail("nehamakashre70@gmail.com", "Crocin", "12:45 PM");
};

test();
