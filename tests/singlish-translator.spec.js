//ITPM Assignment 1 - IT23814288
 



const { test, expect } = require('@playwright/test');
const { readTestCases } = require('./test-data-reader');
const path = require('path');
const fs = require('fs');

// ============================================================
// CORRECT SELECTORS FOR SWIFT TRANSLATOR - CONFIRMED WORKING
// ============================================================
const SELECTORS = {
  // Input field - the textbox where you type Singlish
  inputField: { role: 'textbox', name: 'Input Your Singlish Text Here.' },
  
  // Output field - the div where Sinhala translation appears
  outputField: '.w-full.h-80.p-3.rounded-lg.ring-1.ring-slate-300.whitespace-pre-wrap',
};

// Path to Excel file
const EXCEL_FILE_PATH = path.join(__dirname, '../test-data/IT23814288.xlsx');

// Check if Excel file exists
if (!fs.existsSync(EXCEL_FILE_PATH)) {
  console.error(`ERROR: Excel file not found at: ${EXCEL_FILE_PATH}`);
  console.error('Please make sure your Excel file (IT23814288.xlsx) is in the test-data folder');
  process.exit(1);
}

// Read all test cases from Excel
let testCases = [];
try {
  testCases = readTestCases(EXCEL_FILE_PATH);
} catch (error) {
  console.error('ERROR reading Excel file:', error.message);
  process.exit(1);
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Clears the input field
 */
async function clearInput(page) {
  try {
    const inputField = page.getByRole('textbox', { name: SELECTORS.inputField.name });
    await inputField.clear();
    await page.waitForTimeout(300);
  } catch (error) {
    console.log('Note: Could not clear input field:', error.message);
  }
}

/**
 * Types text into the input field
 */
async function enterInput(page, text) {
  const inputField = page.getByRole('textbox', { name: SELECTORS.inputField.name });
  await inputField.fill(text);
}

/**
 * Waits for translation to complete (based on input length)
 */
async function waitForTranslation(inputLength) {
  let waitTime = 4000; // Default 2 seconds
  
  if (inputLength > 300) {
    waitTime = 7000; // Long input: 5 seconds
  } else if (inputLength > 100) {
    waitTime = 5000; // Medium input: 3 seconds
  } else if (inputLength === 0) {
    waitTime = 1000; // Empty input: 1 second
  }
  
  return waitTime;
}

/**
 * Gets the translated output from the page
 */
async function getOutput(page) {
  try {
    // Get the output div content
    const outputElement = page.locator(SELECTORS.outputField);
    
    // Wait for the element to be visible
    await outputElement.waitFor({ state: 'visible', timeout: 5000 });
    
    // Get the text content
    const outputText = await outputElement.textContent();
    
    return outputText ? outputText.trim() : '';
    
  } catch (error) {
    console.error('ERROR reading output:', error.message);
    return 'ERROR: Could not read output field';
  }
}

/**
 * Compares two Sinhala strings (handles potential Unicode variations)
 */
function compareSinhala(actual, expected) {
  // Normalize both strings
  const normalizedActual = actual.trim().replace(/\s+/g, ' ');
  const normalizedExpected = expected.trim().replace(/\s+/g, ' ');
  
  return normalizedActual === normalizedExpected;
}

// ============================================================
// TEST SUITE
// ============================================================

test.describe('Swift Translator - Singlish to Sinhala Automation', () => {
  
  // This runs before each test
  test.beforeEach(async ({ page }) => {
    // Navigate to the translator website
    await page.goto('https://www.swifttranslator.com/');
    
    // Wait for page to fully load
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for the input field to be visible
    const inputField = page.getByRole('textbox', { name: 'Input Your Singlish Text Here.' });
    await inputField.waitFor({ state: 'visible', timeout: 10000 });
    
    // Wait for output area to be visible
    const outputField = page.locator(SELECTORS.outputField);
    await outputField.waitFor({ state: 'visible', timeout: 10000 });
    
    // Additional wait to ensure all JavaScript has loaded
    await page.waitForTimeout(1000);
  });
  
  // ============================================================
  // Generate a test for each row in the Excel file
  // ============================================================
  
  for (const testCase of testCases) {
    const tcId = testCase['TC ID'];
    const testName = testCase['Test case name'];
    const inputText = testCase['Input'] || '';
    const expectedOutput = testCase['Expected output'] || '';
    const status = testCase['Status'] ? testCase['Status'].toLowerCase().trim() : '';
    const inputLength = inputText.length;
    
    // Determine test type from TC ID
    const isPositive = tcId.startsWith('Pos');
    const isNegative = tcId.startsWith('Neg');
    const isFunctional = tcId.includes('Fun');
    const isUI = tcId.includes('UI');
    
    // Create the test
    test(`${tcId}: ${testName}`, async ({ page }) => {
      console.log('\n' + '='.repeat(70));
      console.log(`TEST: ${tcId}`);
      console.log(`NAME: ${testName}`);
      console.log('='.repeat(70));
      
      try {
        //  Clear any existing input
        await clearInput(page);
        console.log('✓ Cleared input field');
        
        //  Enter the Singlish input
        if (inputText) {
          await enterInput(page, inputText);
          console.log(`✓ Entered input: "${inputText.substring(0, 50)}${inputText.length > 50 ? '...' : ''}"`);
        } else {
          console.log('ℹ Empty input (testing edge case)');
        }
        
        //  Wait for translation (real-time translation)
        const waitTime = await waitForTranslation(inputLength);
        await page.waitForTimeout(waitTime);
        console.log(`✓ Waited ${waitTime}ms for translation`);
        
        //  Get the actual output
        const actualOutput = await getOutput(page);
        console.log(`✓ Got output: "${actualOutput.substring(0, 50)}${actualOutput.length > 50 ? '...' : ''}"`);
        
        //Step 5: Log comparison
        console.log('\nCOMPARISON:');
        console.log(`Expected: ${expectedOutput}`);
        console.log(`Actual:   ${actualOutput}`);
        
        //  Verify results based on test type
        if (isPositive && isFunctional) {
          // POSITIVE FUNCTIONAL TESTS - Should match expected output
          const matches = compareSinhala(actualOutput, expectedOutput);
          
          if (matches) {
            console.log('✓ OUTPUT MATCHES - TEST PASSED');
          } else {
            console.log('✗ OUTPUT DOES NOT MATCH - TEST FAILED');
            console.log(`   Difference detected:`);
            console.log(`   Expected length: ${expectedOutput.length}`);
            console.log(`   Actual length: ${actualOutput.length}`);
            
            // Take screenshot of failure
            const screenshotDir = 'test-results/screenshots';
            if (!fs.existsSync(screenshotDir)) {
              fs.mkdirSync(screenshotDir, { recursive: true });
            }
            
            const screenshotPath = `${screenshotDir}/${tcId}.png`;
            await page.screenshot({ 
              path: screenshotPath,
              fullPage: true 
            });
            console.log(` Screenshot saved: ${screenshotPath}`);
          }
          
          // Assert (this will mark test as pass/fail in Playwright)
          expect(actualOutput).toBe(expectedOutput);
          
        } else if (isPositive && isUI) {
          // POSITIVE UI TESTS - Verify real-time behavior works
          console.log(' UI Test - Verifying real-time behavior');
          
          // Check that output exists (translation happened)
          if (inputText) {
            expect(actualOutput.length).toBeGreaterThan(0);
            console.log(' Real-time translation working - output appeared');
          } else {
            console.log(' Empty input - output behavior documented');
          }
          
        } else if (isNegative && isFunctional) {
          // NEGATIVE FUNCTIONAL TESTS - These should FAIL in Playwright
          // because they document system failures
          console.log(' Negative test - documenting system failure');
          console.log(`   System produced incorrect output: "${actualOutput.substring(0, 50)}${actualOutput.length > 50 ? '...' : ''}"`);
          console.log(`   Expected (correct) output would be: "${expectedOutput.substring(0, 50)}${expectedOutput.length > 50 ? '...' : ''}"`);
          
          // Take screenshot showing the failure
          const screenshotDir = 'test-results/screenshots';
          if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
          }
          
          const screenshotPath = `${screenshotDir}/${tcId}_system_failure.png`;
          await page.screenshot({ 
            path: screenshotPath,
            fullPage: true 
          });
          console.log(` Screenshot saved: ${screenshotPath}`);
          
          
          expect(actualOutput).toBe(expectedOutput);
          
        } else if (isNegative && isUI) {
          // NEGATIVE UI TESTS - Document problematic UI behavior
          console.log(' Negative UI test - documenting problematic behavior');
          console.log(`   System behavior: ${actualOutput || '(empty/no output)'}`);
          
          
          
        } else {
          // Fallback for any other test types
          console.log('ℹ Other test type - documenting behavior');
          console.log(`   System behavior: ${actualOutput || '(empty/no output)'}`);
        }
        
      } catch (error) {
        console.error(' TEST ERROR:', error.message);
        
        // Take screenshot on error
        try {
          const screenshotDir = 'test-results/screenshots';
          if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
          }
          
          const screenshotPath = `${screenshotDir}/${tcId}_error.png`;
          await page.screenshot({ 
            path: screenshotPath,
            fullPage: true 
          });
          console.log(` Screenshot saved: ${screenshotPath}`);
        } catch (screenshotError) {
          console.log('Could not save screenshot:', screenshotError.message);
        }
        
        // Re-throw error to mark test as failed
        throw error;
      }
      
      console.log('='.repeat(70) + '\n');
    });
  }
  
});