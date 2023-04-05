# Mouse-Server using iPhone Accelerometer

This project implements a mouse-server that uses the iPhone's accelerometer to compute the roll, pitch, and yaw and move the mouse to the position it is pointing to on the screen. It is built on websockets and can be run on any device that is running Windows or MacOS. It might also work on Linux (untested).


## Requirements
Websocket communication
```npm install websocket```

Better math library
```npm install mathjs```

Send keyboard events on Windows
```npm install robotjs```

Requires VS 2019 + Windows C++ development kit installed:
```npm install node-cursor```

Simple predictive noise filter
```npm install kalmanjs```

## Installation

To install the mouse-server, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies using `npm install`.
3. Install the app on your iphone using xCode.
4. Run the server using `npm start`.

## Usage

To use the mouse-server, follow these steps:

1. Connect your iPhone to the same network as the device running the server and open tha app. (set the correct IP address)
3. Calibrate the accelerometer by pressing the "Calibrate" button on app.
4. Enjoy. Pilot presentation was done using this as a laser pointer :)

## Contributing

Contributions to this project are welcome. To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch with your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request to this repository.
