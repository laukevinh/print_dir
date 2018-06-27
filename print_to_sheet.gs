/**
 * Given the name of a root folder, this app prints
 * your directory structure to Google Spreadsheets.
 *
 * @param {Object} mimetype The file color based on the 
 *      mimetype.
 */

function getFileColor(mimetype) {
  if (mimetype == "application/pdf")
    return "#e06666"; // red
  if (mimetype == "application/vnd.google-apps.document")
    return "#8db3e2"; // blue
  if (mimetype == "application/vnd.google-apps.presentation")
    return "#fabf8f"; // orange
  if (mimetype == "application/vnd.google-apps.spreadsheet")
    return "#c2d69b"; // green
  if (mimetype == "image/jpeg")
    return "#d99594"; // red
  if (mimetype == "image/png")
    return "#d99594"; // red
  return "white";
}

/**
* Prints folders and files recursively by level order
* traversal. 
*
* @param {Object} folderIter The folder iterator 
* @param {Object} fileIter The file iterator, initially
*      null and as new folders are traversed, files added
* @param {Object} sheet The sheet from which to output results
* @param {integer} row Row of the output
* @param {integer} col Column of the output
*/
function print(folderIter, fileIter, sheet, row, col) {
  // track number of items printed this iteration
  var count=0;
      
  // print folders
  while (folderIter.hasNext()) {
    var self = folderIter.next();
    sheet.getRange(row+count, col)
         .setValue(self.getName())
         .setBackground("#bfbfbf");
    var numChildren = print(self.getFolders(), self.getFiles(), sheet, row+count, col+1);
    // fill in color and set border style
    sheet.getRange(row+count, col, numChildren, 1)
         .setBackground("#bfbfbf")
         .setBorder(true, true, true, true, false, false);
    count = count + numChildren;
  }
                                      
  // print files
  if (fileIter != null) {
  var start = count;
  while (fileIter.hasNext()) {
    var self = fileIter.next();
    var bgColor = getFileColor(self.getMimeType());
    sheet.getRange(row+count, col)
         .setValue(self.getName())
         .setBackground(bgColor);
    count++;
  }
  // set border style
  if (count > start)
    sheet.getRange(row+start, col, count-start, 1)
         .setBorder(true, true, true, true, false, false);
  }
                                                             
  // return max(1, count), since 0 or 1 child still requires
  // next output to go on next row.
  if (count < 1) 
    return 1;
  return count;
}

/**
* Formats the sheet at end of routine.
*
* @param {Object} sheet The sheet from which to output results
*/
function formatSheet(sheet) {
  sheet.setHiddenGridlines(true);
  var lastColPos = sheet.getLastColumn();
  var lastRowPos = sheet.getLastRow();
  sheet.autoResizeColumns(1, lastColPos);
  sheet.getRange(1, 1, lastRowPos, lastColPos).setHorizontalAlignment("left");
}

/**
 * Main program driver. Edit the search query and title 
 * for different output name.
 */
function main() {
  var folderIter = DriveApp.searchFolders('title = "FBA"');

  // create new output file
  var ss = SpreadsheetApp.create("Layout_FBA");
  var sheet = ss.getSheets()[0];

  // init
  print(folderIter, null, sheet, 1, 1);
  formatSheet(sheet);
}
