// BIG todo: TOKEN validation


import validator from 'validator';


import express from 'express';
import type { Request, Response } from 'express';
// import readlineSync from 'readline-sync';

import path from 'path';
import fs, { stat } from 'fs';


import dotenv from 'dotenv';
dotenv.config();




// Is debugging
const isDebug = process.argv.includes('--debug'); // npm run dev -- --debug
const debugAsOutsider = process.argv.includes('--outsider');
// JS debug terminal




// Local Video path
const videoLocalPath = process.env.PATH_TO_VIDEO_FILE || ""; //  || 'C:\\Users\\Y\\Downloads\\'


// Main app (express)
const app = express();
const port = 3215;





import { initializeSecurity, evQuery, evValidationResult, evMatchedData, notArrayOrObject, badRequest } from './init.js';
import { screenshot } from './screenshot.js';
import { cacheMiddleware } from './cache.js';
initializeSecurity(app);
app.use(cacheMiddleware);




app.use(express.urlencoded({ extended: false }));
/*
这行是注册一个中间件，让 Express 能解析 HTML form 提交的数据。                                                                                                                                                                                    
    当浏览器提交 <form method="POST"> 时，数据格式是：                                                                         url=https%3A%2F%2Fexample.com                                                                                          
    这叫 application/x-www-form-urlencoded。没有这个中间件，req.body 会是 undefined。加了之后，Express 自动解析成：            req.body.url === "https://example.com"                                                                                                                                                                                                            
    extended: false 表示用 Node.js 内置的 querystring 解析，true 则用第三方的 qs 库（支持嵌套对象）。对于简单的 form 数据用
     false 就够了。
*/





app.listen(port, () => {

  console.log(`Listening on port ${port}`);
});


app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve('static', 'index.html'));
});

app.post("/submit", async (req: Request, res: Response) => {
  const url = req.body.url as string;
  const image = await screenshot(url);
  res.set('Content-Type', 'image/png').send(image);
});




app.get("/panel", (req: Request, res: Response) => {
  const cookies = req.headers['cookie'] ?? '';
  if (cookies.split(';').map(c => c.trim()).includes('admin=114514')) {
    return res.send('ctf{wo_shi_sha_bi}');
  }
  return res.status(403).send('Forbidden');
});

app.get("/login", (req: Request, res: Response) => {
  const host = req.headers['host'] ?? '';
  const isLocal = host === '127.0.0.1' || host === `127.0.0.1:${port}`;
  const hasForwardHeader =
    req.headers['x-forwarded-for'] !== undefined ||
    Object.keys(req.headers).some(h => h.toLowerCase().startsWith('cf-'));

  if (!isLocal || hasForwardHeader || debugAsOutsider) {
    return res.status(403).send('Forbidden: This is an internal tool');
  }

  res.set('Set-Cookie', 'admin=114514');
  res.send('<a href="/panel">Redirect</a>');
});

app.get("/static/:file", (req: Request, res: Response) => {
  const file = req.params['file'];

  if (!file || typeof file !== 'string' || file.includes('..')) {
    return badRequest(res, new Error('Invalid path'));
  }

  const staticDir = path.resolve('static');
  console.log(staticDir);
  const filePath = path.resolve(staticDir, file);

  // 二次确认解析后路径仍在 static 目录内（防止编码绕过）
  if (!filePath.startsWith(staticDir + path.sep)) {
    return badRequest(res, new Error('Invalid path'));
  }

  res.sendFile(filePath);
});





// ----------------------------------------- 404 -----------------------------------------------

// Handler
app.use((req: Request, res: Response) => {
  res.status(404).send(
    `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
        <title>Error response</title>
    </head>
    <body>
        <h1>Error response</h1>
        <p>Error code: 404</p>
        <p>I ate this page for dinner.</p>
        <p>Hey, maybe you should see this meme:</p>

        <img src="http://127.0.0.1:${port}/static/meme1.png"/>
        <img src="http://127.0.0.1:${port}/static/meme2.png"/>
        <img src="http://127.0.0.1:${port}/static/meme3.png"/>
        <img src="http://127.0.0.1:${port}/static/meme4.png"/>
        <img src="http://127.0.0.1:${port}/static/meme5.png"/>
</body>
</html>
`); // fake python3 http.server
});
