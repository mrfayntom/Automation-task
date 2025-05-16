# Startup App — Lightweight JavaScript Modules

This project provides a modular, high-performance foundation for startup applications using pure JavaScript. It focuses on simplicity, speed, and scalability, with no external dependencies.

Included Modules:

- Core Application Logic
- Custom Sorting Algorithms
- Basic Testing Framework

Designed for developers prioritizing lightweight builds over heavy frameworks, and aiming for rapid prototyping or production-ready deployment.

---

## Project Structure

# File One — Automated Download Organizer

## Overview

**folder-sorter** is a lightweight Node.js script that monitors the user's Downloads folder in real time and automatically sorts new files into categorized subfolders. It supports common file types including images, videos, archives, and executables.

The script also maintains a log of moved files, recording details such as the filename, date, and size, stored in a JSON log file for easy reference.

---

## Features

- Real-time monitoring of the Downloads directory using `chokidar`.
- Automatic categorization and movement of files based on file extensions.
- Creation of destination folders if they do not exist.
- Persistent logging of moved files with timestamp and file size.
- Notifications on watcher startup using `node-notifier`.
- Error handling during file operations.

---

## Directory Structure

# Video Sorter — Automated Video File Organizer

## Overview

**Video Sorter** is a Node.js script designed to help organize video files in a specified directory by grouping files with similar titles into appropriately named folders. The script cleans and analyzes filenames to detect common words and creates folders dynamically to keep the video collection structured and easy to navigate.

---

## Features

- Cleans video filenames by removing special characters and bracketed content.
- Groups files with similar titles based on common words.
- Creates folders named after the common title for each group.
- Moves grouped video files into their respective folders.
- Automatically runs every 30 minutes to maintain order in the target directory.

---

## Directory Structure Example

# Image Sorter — Real-Time Image Organizer by Date

## Overview

**Image Sorter** is a Node.js script that monitors a specified folder in real time and automatically moves newly added image files into subfolders named by their date of addition. This ensures that images are organized chronologically, making it easier to locate files based on when they were downloaded or saved.

---

## Features

- Watches a target folder continuously for new image files.
- Automatically creates date-based folders in the format `DD-MMM-YYYY`.
- Moves new files into their corresponding date folder immediately after detection.
- Handles folder creation dynamically.
- Uses `chokidar` for efficient and reliable file system watching.

---

## Directory Structure Example

# Merge.js — Unified File Organizer for Downloads Folder

## Overview

`merge.js` is a comprehensive Node.js script designed to automate file management in the user’s Downloads directory. It integrates multiple functionalities including:

- Real-time sorting of files by category (images, videos, archives, executables).
- Date-based organization of image files into subfolders.
- Periodic grouping and sorting of video files based on filename similarity.
- Logging of moved files with details for record-keeping.
- Desktop notifications to indicate the watcher status.

This script optimizes download folder maintenance, making it ideal for startup projects requiring lightweight and efficient file management automation.

---

## Key Features

### 1. **Real-Time File Categorization**
- Monitors the Downloads folder using `chokidar`.
- Categorizes files based on extension into predefined groups: images, videos, rar files, and executables.
- Moves files immediately into respective subfolders (Images, Video, Rar, Exe).

### 2. **Image Files Date Sorting**
- Images are further organized into subfolders named by the current date (e.g., `16-May-2025`).
- Automatically creates date folders if they do not exist.
- Ensures chronological organization of images for better file management.

### 3. **Video Files Grouping and Sorting**
- Every 30 minutes, scans the videos folder.
- Groups videos by analyzing common keywords in filenames.
- Moves grouped files into folders named after their common title.
- Dynamically creates folders if necessary.

### 4. **File Operation Logging**
- Records moved files’ names, sizes (in KB), and timestamps into a JSON log file located in the user’s Documents folder.
- Provides a persistent record of file management activities.

### 5. **Notifications**
- Uses desktop notifications (`node-notifier`) to indicate the watcher activation status.

---

## Installation and Usage

1. Ensure Node.js is installed (version 12 or above recommended).

2. Install dependencies by running:

   ```bash
   npm install chokidar node-notifier
   ```
# Notice Regarding Recent Exam Performance

This document outlines a formal explanation regarding the recent examination results, highlighting the discrepancies between expected and actual marks across various subjects. It also addresses the challenges faced in the evaluation process, including third-party checking by CBSE and financial limitations preventing rechecking.

## Key Points

- Overall marks fell below the 80% threshold.
- Evaluation was conducted by a third-party agency for the first time.
- Subject-wise score details with comparison to expectations:
  - Informatics Practices (IP): Expected 95+, Scored 91
  - Physics: Expected 90+, Scored 80
  - Chemistry: Expected 75+, Scored 67
  - English: Expected 90+, Scored 73
  - Mathematics: Expected 85+, Scored 51
- Rechecking is not feasible due to high associated costs.
- Improvement Exam will be attempted in Mathematics with a goal of scoring 90+.
- Only one subject improvement is allowed for 12th-grade students.
- Step marking is not applicable.
- Expresses concern over lack of attention to students’ issues.

## Purpose

The notice serves to clarify the reasons behind the lower-than-expected performance and to communicate the current plan moving forward, focusing on improvement exams and academic dedication.

## Usage

This notice can be shared with family, educators, or relevant school authorities to provide transparency and context regarding academic results.

