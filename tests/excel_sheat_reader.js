
 //Test Data Reader for Excel Files
 //Reads test cases from the Excel template
 

const XLSX = require('xlsx');
const path = require('path');

/**
 * Reads test cases from Excel file
 * @param {string} excelPath - Path to the Excel file
 * @returns {Array} Array of test case objects
 */
function readTestCases(excelPath) {
  console.log(`Reading test cases from: ${excelPath}`);
  
  // Read the Excel file
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert sheet to 2D array
  const data = XLSX.utils.sheet_to_json(worksheet, { 
    header: 1,
    defval: '' 
  });
  
  // Find the header row (the row that contains "TC ID")
  let headerRowIndex = -1;
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row && row.some(cell => cell === 'TC ID')) {
      headerRowIndex = i;
      break;
    }
  }
  
  if (headerRowIndex === -1) {
    throw new Error('Could not find header row containing "TC ID" in the Excel file');
  }
  
  console.log(`Found header row at index: ${headerRowIndex}`);
  
  // Extract headers
  const headers = data[headerRowIndex];
  const testCases = [];
  
  // Parse each row after the header
  for (let i = headerRowIndex + 1; i < data.length; i++) {
    const row = data[i];
    
    // Skip empty rows
    if (!row || row.length === 0 || !row.some(cell => cell)) {
      continue;
    }
    
    // Create test case object
    const testCase = {};
    headers.forEach((header, index) => {
      if (header) {
        testCase[header.trim()] = row[index] ? String(row[index]).trim() : '';
      }
    });
    
    // Only include rows that have a TC ID
    if (testCase['TC ID'] && testCase['TC ID'] !== '') {
      testCases.push(testCase);
    }
  }
  
  console.log(`Successfully read ${testCases.length} test cases`);
  
  // Log test case distribution
  const posFun = testCases.filter(tc => tc['TC ID'].startsWith('Pos_Fun')).length;
  const negFun = testCases.filter(tc => tc['TC ID'].startsWith('Neg_Fun')).length;
  const posUI = testCases.filter(tc => tc['TC ID'].startsWith('Pos_UI')).length;
  const negUI = testCases.filter(tc => tc['TC ID'].startsWith('Neg_UI')).length;
  
  console.log('Test case distribution:');
  console.log(`  - Positive Functional: ${posFun}`);
  console.log(`  - Negative Functional: ${negFun}`);
  console.log(`  - Positive UI: ${posUI}`);
  console.log(`  - Negative UI: ${negUI}`);
  
  return testCases;
}

/**
 * Filters test cases by type
 * @param {Array} testCases - All test cases
 * @param {string} type - Type filter 
 * @returns {Array} Filtered test cases
 */
function filterTestCasesByType(testCases, type) {
  return testCases.filter(tc => tc['TC ID'].startsWith(type));
}

/**
 * Gets a single test case by ID
 * @param {Array} testCases - All test cases
 * @param {string} tcId - Test case ID
 * @returns {Object|null} Test case object or null if not found
 */
function getTestCaseById(testCases, tcId) {
  return testCases.find(tc => tc['TC ID'] === tcId) || null;
}

module.exports = {
  readTestCases,
  filterTestCasesByType,
  getTestCaseById
};
