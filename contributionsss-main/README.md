# 🎨 GitHub Contribution Painter

A Node.js script that automates creating a large number of Git commits with specific, randomized dates. This can be used to "paint" your GitHub contribution graph for demonstration or experimental purposes.

> [!WARNING]
> **Disclaimer**: This project is for educational and experimental purposes only. Manipulating your contribution graph does not reflect real work and may be misleading. Use this script responsibly.

## ✨ Features

-   **Automated Commits**: Creates a specified number of commits automatically.
-   **Date Backdating**: Assigns a random date within a defined range to each commit.
-   **Customizable**: Easily configure the date range and the total number of commits.
-   **Simple Setup**: Requires only Node.js and a few dependencies to get started.

## ⚙️ How It Works

The script executes the following steps in a loop:

1.  **Generate a Random Date**: Picks a random date within the configured `startDate` and `endDate`.
2.  **Write to File**: Appends the generated date to a `data.json` file to ensure each commit has a change.
3.  **Stage and Commit**: Stages the `data.json` file and creates a commit, setting the commit date to the randomly generated date.
4.  **Repeat**: Continues this process until the desired number of commits has been created.
5.  **Push to Remote**: Pushes all the locally created commits to the remote GitHub repository.

## 📋 Prerequisites

-   [Node.js](https://nodejs.org/) installed on your machine.
-   A GitHub repository to which you have push access.

## 🚀 Getting Started

### 1. Set up your Git Repository

Clone the repository or ensure you are in an existing Git repository. Set the remote origin to your GitHub repository URL.

```bash
# For a new project, initialize git
git init

# Set the remote origin
git remote add origin <YOUR_REPOSITORY_URL>
```

### 2. Install Dependencies

Install the required npm packages.

```bash
npm install jsonfile moment simple-git random
```

### 3. Configure the Script (Optional)

Open the `index.js` file and adjust the following parameters to fit your needs:

-   `startDate`: The earliest date for a commit.
-   `endDate`: The latest date for a commit.
-   `makeCommits(1000)`: Change `1000` to the total number of commits you want to create.

### 4. Run the Script

Execute the script from your terminal.

```bash
node index.js
```

The script will begin creating commits locally. Once finished, it will automatically push them to your remote repository, and your contribution graph will be updated.
