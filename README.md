# Pipedrive Integration - Sales & Customer Insights Tracker

**Pipedrive Integration - Sales & Customer Insights Tracker** is a Node.js application that integrates with the Pipedrive API to pull relevant sales data and produce a structured dataset for analysis and automation. It is designed to showcase skills in API integration, structured data handling, modular code organization, unit testing, and effective communication of work.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Clone the Repository](#1-clone-the-repository)
  - [Install Dependencies](#2-install-dependencies)
  - [Set Up Environment Variables](#3-set-up-environment-variables)
- [Usage](#usage)
  - [Running the Application](#running-the-application)
  - [Running Tests](#running-tests)
- [Dependencies](#dependencies)
- [Google Sheet](#google-sheet)

## Features

- Fetches active deals from Pipedrive
- Filters and structures sales data for insights & automation.
- Implements modular code for reusability and maintainability.
- Uses dotenv to secure API keys and sensitive data
- Supports unit testing to ensure reliability

## Prerequisites

Before running this application, make sure you have the following:

- [**Node.js** version 14.x or higher ](https://nodejs.org/en/aboutprevious-releases).
- [NPM 10.9.2](https://github.com/nodejs/node/releases/tag/v22.13.0)
- **PipeDrive API Key**
- **Google Sheets API Service Account** credentials.

## Installation

#### Clone repository

```bash
git clone git@github.com:VJBano/PipeDrive.git
```

#### Install Dependencies

```bash
  npm install
```

#### Set Up Environment Variables

- For windows(CMD)

```bash
    copy .env.local .env

```

- For Linux & macOS (Bash, Zsh, etc.)

```bash
    cp .env.local .env

```

## Usage

#### Running the Application

- run without Nodemon

  ```bash
  npm run start

  ```

- run with Nodemon

  ```bash
    npm run dev

  ```

#### Running the Test

```bash
   npm run test
```

or

```bash
    npm test
```

## Dependencies

#### Dependencies

- [axios](https://www.npmjs.com/package/axios)
- [csv-parser](https://www.npmjs.com/package/csv-parser)
- [csv-writer](https://www.npmjs.com/package/csv-writer)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [googleapis](https://www.npmjs.com/package/googleapis)

#### devDependencies

- [@babel/core](https://www.npmjs.com/package/@babel/core)
- [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env)
- [babel-jest](https://www.npmjs.com/package/babel-jest)
- [jest](https://www.npmjs.com/package/jest)

## Google Sheet

- google Sheets Intergration Link

```bash

```
