import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

// Set date range boundaries (YYYY-MM-DD  )
const startDate = moment("2025-08-24");
const endDate = moment("2025-09-21");

// Calculate total days in our date range
const totalDays = endDate.diff(startDate, "days");

const makeCommits = (n) => {
  if (n <= 0) {
    return simpleGit().push().catch(err => console.error("Push error:", err));
  }

  // Generate random day offset within the date range
  const dayOffset = random.int(0, totalDays);
  const commitDate = startDate.clone().add(dayOffset, "days").format();

  console.log(`Commit ${500 - n + 1}/500 - Date: ${commitDate}`);

  const data = { date: commitDate };
  
  jsonfile.writeFile(path, data, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    
    simpleGit().add([path]).commit(commitDate, { "--date": commitDate }, (commitErr) => {
      if (commitErr) {
        console.error("Commit error:", commitErr);
        return;
      }
      // Add small delay to avoid rate limiting
      setTimeout(() => makeCommits(n - 1), 100);
    });
  });
};

// Start the commit process with 1000 commits
makeCommits(500);