# Swift Translator Automation - ITPM Assignment 1

**Student ID:** IT23814288  
**Name:** CHANDRASIRI S.H.U.G  
**Batch:** Y3.S1.WD.IT.03.01  
**Module:** IT3040 - IT Project Management  
**Assignment:** Assignment 1 - Software Testing Automation

---

## 📋 Project Overview

This project contains automated test cases for the **Swift Translator** web application, which translates Singlish (Sinhala written in English characters) to Sinhala script. The automation is implemented using **Playwright**, a modern end-to-end testing framework.

**Application Under Test:** [https://www.swifttranslator.com/](https://www.swifttranslator.com/)

---

## 🎯 Project Objectives

The main objectives of this automation project are to:

1. **Verify Translation Accuracy**: Test if the Swift Translator correctly converts Singlish input into Sinhala output
2. **Test Edge Cases**: Evaluate system behavior with unusual inputs, mixed languages, and formatting
3. **UI Validation**: Verify real-time translation functionality and user interface responsiveness
4. **Document System Behavior**: Record how the system handles both valid and invalid inputs

---

## 📊 Test Coverage

### Test Case Summary

| Category | Count | Description |
|----------|-------|-------------|
| **Positive Functional Tests** | 24 | Verify correct translation behavior |
| **Negative Functional Tests** | 10 | Test edge cases and error handling |
| **UI Tests** | 1 | Validate user interface behavior |
| **Total Test Cases** | **35** | Complete test suite |



---

## 🏗️ Project Structure

```
IT23814288-ITPM(IT3040)/
├── tests/                              # Test files directory
│   ├── main(singlish_translator).js     # Main test automation file (35 tests)
│   └── excel_sheat_reader.js             # Utility to read Excel test data
│
├── test-data/                          # Test data directory
│   └── IT23814288.xlsx                 # Test cases with inputs & expected outputs
│
├── test-results/                       # Test execution results (generated)
│   ├── screenshots/                    # Screenshots of failed tests
│   └── ...                            # Other test artifacts
│
├── playwright-report/                  # HTML test report (generated)
│
├── node_modules/                       # Dependencies (auto-generated)
│
├── playwright.config.js                # Playwright configuration
├── package.json                        # Project dependencies and scripts
├── package-lock.json                   # Locked dependency versions

```

---

## 🛠️ Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v16+ | JavaScript runtime |
| **Playwright** | v1.40.0 | Browser automation framework |
| **xlsx** | v0.18.5 | Excel file reading |
| **JavaScript** | ES6+ | Programming language |
| **Git** | Latest | Version control |

---

## 📦 Prerequisites

Before running this project, ensure you have the following installed:

1. **Node.js** (version 16 or higher)
   - Download from: [https://nodejs.org/](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (for cloning the repository)
   - Download from: [https://git-scm.com/](https://git-scm.com/)
   - Verify installation: `git --version`

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Udeep10-dev/IT23814288-ITPM-Assignment1.git
cd IT23814288-ITPM-Assignment1
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Playwright test framework
- xlsx library for reading Excel files
- All other required dependencies

### Step 3: Install Playwright Browsers

```bash
npx playwright install
```

This downloads the Chromium, Firefox, and WebKit browsers needed for testing.

**Note:** This step is crucial! Tests will not run without browser binaries.

---

## ▶️ Running the Tests

### Run All Tests

```bash
npm test
```

or

```bash
npx playwright test
```

### Run Tests with Browser Visible (Headed Mode)

```bash
npx playwright test --headed
```

This is useful for debugging - you can see the browser and watch tests execute in real-time.

### Run a Specific Test by ID

```bash
npx playwright test -g "Pos_Fun_0001"
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

This opens Playwright Inspector, allowing you to step through tests line by line.

### Run Tests in UI Mode (Interactive)

```bash
npx playwright test --ui
```

Opens an interactive UI where you can run tests, see results, and debug failures.

---

## 📈 Viewing Test Results

### View HTML Report

After running tests, generate and view the HTML report:

```bash
npx playwright show-report
```

This opens an interactive report in your browser showing:
- ✅ Passed tests
- ❌ Failed tests
- ⏱️ Execution time for each test
- 📸 Screenshots of failures
- 📹 Video recordings (if enabled)
- 📋 Detailed test logs

### Console Output

Test results are also displayed in the console with detailed logging:

```
======================================================================
TEST: Pos_Fun_0001
NAME: Simple sentence conversion
======================================================================
✓ Cleared input field
✓ Entered input: "mama pothak kiyavanavaa"
✓ Waited 2000ms for translation
✓ Got output: "මම පොතක් කියවනවා"

COMPARISON:
Expected: මම පොතක් කියවනවා
Actual:   මම පොතක් කියවනවා
✓ OUTPUT MATCHES - TEST PASSED
======================================================================
```

### Screenshots

Failed tests automatically save screenshots to:
```
test-results/screenshots/
```

Each failed test creates two screenshots:
- `{TEST_ID}.png` - Main failure screenshot
- `{TEST_ID}_error.png` - Additional error context

---



### Test Data Configuration

Test cases are read from `test-data/IT23814288.xlsx` with the following columns:

| Column | Description |
|--------|-------------|
| TC ID | Unique test identifier (e.g., Pos_Fun_0001) |
| Test case name | Brief description of the test |
| Input length type | S (≤30), M (31-299), or L (≥300) characters |
| Input | Singlish text to be translated |
| Expected output | Expected Sinhala translation |
| Actual output | Actual result (filled by automation) |
| Status | Pass/Fail status |
| Accuracy justification | Explanation of the result |
| What is covered by the test | Test coverage details |

---


---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue 1: Tests Fail with "Cannot find module '@playwright/test'"

**Solution:**
```bash
npm install
```

#### Issue 2: Tests Fail with "Executable doesn't exist"

**Solution:**
```bash
npx playwright install
```

#### Issue 3: Tests Timeout with "waiting for locator"

**Possible Causes:**
- Selectors are incorrect
- Website is slow to load
- Internet connection issues

**Solutions:**
1. Verify selectors using Playwright Inspector:
   ```bash
   npx playwright codegen https://www.swifttranslator.com/
   ```

2. Increase timeout in `playwright.config.js`:
   ```javascript
   timeout: 90000  // 90 seconds
   ```

3. Check internet connection

#### Issue 4: Excel File Not Found

**Error Message:** `ERROR: Excel file not found at: ...`

**Solution:**
Ensure your Excel file is located at:
```
test-data/IT23814288.xlsx
```

#### Issue 5: Translation Doesn't Match Expected Output

**Possible Causes:**
- Expected output in Excel has typos
- Swift Translator behavior changed
- Extra spaces in output

**Solutions:**
1. Check the screenshot in `test-results/screenshots/`
2. Verify expected output in Excel is correct
3. Update expected output if needed

---

## 📚 Additional Scripts

The `package.json` includes helpful npm scripts:

```json
{
  "test": "playwright test",
  "test:headed": "playwright test --headed",
  "test:debug": "playwright test --debug",
  "test:ui": "playwright test --ui",
  "report": "playwright show-report",
  "codegen": "playwright codegen https://www.swifttranslator.com/"
}
```

Usage:
```bash
npm run test:headed   # Run with visible browser
npm run report        # View HTML report
npm run codegen       # Find selectors interactively
```

---

## 📖 Learning Resources

### Playwright Documentation
- [Official Docs](https://playwright.dev/)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Best Practices](https://playwright.dev/docs/best-practices)



---

## 🤝 Contributing

This is an academic project for ITPM Assignment 1. Contributions are not accepted as this is individual coursework.

---

## 📄 License

This project is created for educational purposes as part of the IT3040 - IT Project Management course at SLIIT.

---

## 👤 Author

**Student ID:** IT23814288  
**Name:** CHANDRASIRI S.H.U.G  
**Batch:** Y3.S1.WD.IT.03.01  
**Institution:** Sri Lanka Institute of Information Technology (SLIIT)  
**Course:** BSc (Hons) in Information Technology - Year 3  
**Module:** IT3040 - IT Project Management  
**Assignment:** Assignment 1 - Software Testing Automation

---







