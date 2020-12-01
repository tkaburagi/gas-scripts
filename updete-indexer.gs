var result = [];

function myFunction() {
    // Document setup
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() -1)
    var yesterdayString = Utilities.formatDate(currentDate,"JST","yyyy / MM / dd");
    var body = DocumentApp.openById("").getBody();
    var header = body.insertParagraph(0, "Updated Documents at " + yesterdayString);
    header.setHeading(DocumentApp.ParagraphHeading.HEADING1);

    // Retrieve Updated Docs
    var japanDrive = Drive.Teamdrives.get(getByName("Japan")).id;
    var japanFolder = DriveApp.getFolderById(japanDrive);
    var updatedDocuments = showFolderName(japanFolder);

    Logger.log(updatedDocuments.length);

    //Edit the Doc
    for(var i = 0; i < updatedDocuments.length; i++) {
        body.insertListItem(1, "").insertText(0, updatedDocuments[i].getName()).setLinkUrl(updatedDocuments[i].getUrl());
    }
}

function getByName(teamDriveName) {
    var teamDrives = Drive.Teamdrives.list({maxResults:100}).items;

    for (var i in teamDrives) {
        var teamDrive = teamDrives[i]
        if (teamDrive.name === teamDriveName) {
            return teamDrive.id
        }
    }
}

function showFolderName(root) {
    //Yesterday
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() -1)
    var yesterdayString = Utilities.formatDate(currentDate,"JST","yyyyMMdd");

    var folders = root.getFolders();

    while (folders.hasNext()) {
        var folder = folders.next();
        var files = folder.getFiles();
//    Logger.log(folder.getName()) ;
        while (files.hasNext()) {
            var file = files.next();
//      Logger.log("FILENAME:-> " + file.getName());
            var updateDate = Utilities.formatDate(file.getLastUpdated(),"JST","yyyyMMdd");
            if (updateDate === yesterdayString) {
                Logger.log("INSIDE:" + file.getName());
                result.push(file)
            }
        }
        showFolderName(folder);
    }
    return result;
}