function doGet(e) {
  const month = e.parameter.month;
  if (!month) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Month parameter is required'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const monthData = getMonthData(month);
    return ContentService.createTextOutput(JSON.stringify(monthData))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getMonthData(month) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const monthSheet = ss.getSheetByName(month);
  
  if (!monthSheet) {
    throw new Error(`Sheet for ${month} not found`);
  }

  // Get monthly data (skip header row)
  const monthlyData = monthSheet.getRange(3, 1, monthSheet.getLastRow() - 2, 9).getValues()
    .filter(row => row[0]) // Filter out empty rows
    .map(row => ({
      empId: row[0].toString(),
      agentName: row[1],
      silver: Number(row[2]) || 0,
      gold: Number(row[3]) || 0,
      platinum: Number(row[4]) || 0,
      standard: Number(row[5]) || 0,
      target: Number(row[6]) || 0,
      achieved: Number(row[7]) || 0,
      remaining: Number(row[8]) || 0
    }));

  // Get daily data
  const dailyData = {};
  const sheets = ss.getSheets();
  const monthNumber = getMonthNumber(month);
  const yearPrefix = '2025'; // Update this as needed

  sheets.forEach(sheet => {
    const sheetName = sheet.getName();
    if (isDateSheet(sheetName, monthNumber, yearPrefix)) {
      const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 7).getValues()
        .filter(row => row[0]) // Filter out empty rows
        .map(row => ({
          empId: row[0].toString(),
          agentName: row[1],
          silver: Number(row[2]) || 0,
          gold: Number(row[3]) || 0,
          platinum: Number(row[4]) || 0,
          standard: Number(row[5]) || 0,
          total: Number(row[6]) || 0
        }));
      
      dailyData[sheetName] = data;
    }
  });

  return {
    monthly: monthlyData,
    daily: dailyData
  };
}

function getMonthNumber(month) {
  const months = {
    'January': '01',
    'February': '02',
    'March': '03',
    'April': '04',
    'May': '05',
    'June': '06',
    'July': '07',
    'August': '08',
    'September': '09',
    'October': '10',
    'November': '11',
    'December': '12'
  };
  return months[month];
}

function isDateSheet(sheetName, monthNumber, yearPrefix) {
  // Check if sheet name matches the format DD/MM/YYYY
  const dateRegex = new RegExp(`^\\d{2}/${monthNumber}/${yearPrefix}$`);
  return dateRegex.test(sheetName);
}