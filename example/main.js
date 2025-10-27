'use strict';

/* eslint-disable no-console */

const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require('../');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 340,
    height: 380,
    resizable: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Set this to your Client ID.
const clientId = '1133848954333827242';

// Only needed if you want to use spectate, join, or ask to join
DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date(); 
async function setActivity() {
  if (!rpc || !mainWindow) {
    return;
  }

  
  const boops = await mainWindow.webContents.executeJavaScript('window.boops');

  // You'll need to have snek_large and snek_small assets uploaded to
  // https://discord.com/developers/applications/<application_id>/rich-presence/assets
  rpc.setActivity({
    // Activity Structure example fields
    name: 'Snek Example',
    type: DiscordRPC.ActivityType.Listening,
    
    // createdAt should be a timestamp (ms) or Date
    createdAt: startTimestamp,
    applicationId: clientId,

    details: `booped ${boops} times`,
    state: 'in slither party',
    stateUrl: 'https://example.com/state',

    // Emoji for custom status (can be string or object)
    emoji: '🐍',

    // timestamps can be provided as Date or number (ms)
    timestamps: { start: startTimestamp },
 
    partyId: 'party123',
    partySize: 1,
    partyMax: 4,

    // assets: can pass either individual keys or an assets object
    assets: {
      largeImage: 'https://i.imgur.com/Q1wZugv.png',
      largeText: 'tea is delicious', 
    },

    instance: false, 

  });
}

rpc.on('ready', () => {
  setActivity();
  console.log('RPC ready');

  // activity can only be set every 15 seconds
  setInterval(() => {
    setActivity();
  }, 15e3);
});

rpc.login({ clientId }).catch(console.error);
