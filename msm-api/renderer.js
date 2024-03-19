// renderer.js

const { ipcRenderer } = require('electron');

document.getElementById('stopServerBtn').addEventListener('click', () => {
    ipcRenderer.send('stopServer');
});

document.getElementById('restartServerBtn').addEventListener('click', () => {
    ipcRenderer.send('restartServer');
});
