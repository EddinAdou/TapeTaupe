const { app, BrowserWindow} = require('electron')

function createWindow(){
    const win = new BrowserWindow({
        width : 800,
        height : 600,
        webPreferences : {
            nodeIntegration : true
        }
    })
    app.whenReady().then(createWindow)
    win.loadFile('./index.htm')
}