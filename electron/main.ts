import * as path from 'node:path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';

let mainWindow: BrowserWindow | null = null;

function getRendererEntry() {
  return path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`);
}

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 720,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : undefined,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
      spellcheck: false,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    await mainWindow.loadFile(getRendererEntry());
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function setupDesktopIpc() {
  ipcMain.handle('desktop:get-platform', () => process.platform);
  ipcMain.handle('desktop:get-version', () => app.getVersion());
  ipcMain.handle('desktop:open-external', async (_event, url: string) => {
    await shell.openExternal(url);
  });
  ipcMain.handle('desktop:window-minimize', () => {
    mainWindow?.minimize();
  });
  ipcMain.handle('desktop:window-maximize-toggle', () => {
    if (!mainWindow) {
      return false;
    }

    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
      return false;
    }

    mainWindow.maximize();
    return true;
  });
  ipcMain.handle('desktop:window-close', () => {
    mainWindow?.close();
  });
}

app.whenReady().then(async () => {
  setupDesktopIpc();
  await createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
