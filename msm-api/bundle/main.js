"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const { app } = require('electron');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    await app.listen(3000);
}
app.whenReady().then(() => {
    bootstrap();
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});
//# sourceMappingURL=main.js.map