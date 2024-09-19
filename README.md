# TheWall

TheWall is a web application for managing a wall of screens.
It can show web pages, images, and videos on multiple screens at the same time.
Layouts can be created and changed on the fly using a drag-and-drop web interface.

The output is displayed by Firefox running in fullscreen mode.
To use a grid of screens, NVidia Mosaic or AMD Eyefinity is advised to be used to create a single large display.

## Usage

TheWall is a web application built with Nuxt.
To run the application, you need to have Node.js and NPM installed.

To run the application for development, follow these steps:
```
npm install
npm run dev
```

Due to CSP and Frame-Options headers, by default, you can't embed all external websites.
To circumvent this, you need to install the browser extension, provided in the `extension` folder.
This extension will remove the headers from the response, allowing you to embed any website.

In standard versions of Firefox, to install the extension, open `about:debugging` in Firefox, click on `This Firefox`, and then `Load Temporary Add-on`.

To install the extension permanently, the Developer Edition of Firefox is required.
To use unsigned extensions in the Developer Edition of Firefox, you need to set the `xpinstall.signatures.required` preference to `false` in `about:config`.
Afterwards you can create a zip file of the extension folder and change the extension's file extension to `.xpi`.
This extension can then be installed by dragging the file into the Firefox window.

The wall computer can access the rendered wall by visiting `http://SERVER_IP:3000/WALL_ID`.
You will be asked to start fullscreen mode by clicking on the screen.

If you installed the extension, you will be redirected to the extension options page if TheWall is running on a different origin than http://localhost:3000.
As a security measure, you need to set the origin of the server on the options page.

The control computer can access the control panel by visiting `http://SERVER_IP:3000/WALL_ID/control`.

Where `SERVER_IP` is the IP address of the server running the application, and `WALL_ID` is the ID of the wall you want to access.

## Security Considerations

Ensure that the server running TheWall is thrusted and not accessible by unauthorized users.
TheWall does support basic authentication by creating a `users.json` file in the root of the project.
The file should contain a array of objects with the following structure:
```json
[
  {
    "username": "admin",
    "password": "password"
  }
]
```

It is advised to run the application behind a reverse proxy with HTTPS enabled if you want to access the application over a network.

Everyone with access to the server can change the websites displayed on the wall and inject custom CSS and JavaScript.
The extension will also reduce the security of the displayed websites by changing security related headers.

## Copyright and License
Copyright 2024 Iwan Timmer.
Distributed under the GNU AGPL v3.
For full terms see the [COPYING](COPYING) file

Available under alternative licensing terms upon request.
