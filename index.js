var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);
var io = require("socket.io")(server);
const { SerialPort, ReadlineParser } = require("serialport");


const serialport = new SerialPort({
    path: "/dev/cu.usbserial-1420",
    baudRate: 9600,
});


const parser = serialport.pipe(new ReadlineParser({ delimiter: "\n" }));

app.engine("ejs", require("ejs").__express);
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("index");
});

serialport.on("open", function () {
    console.log("serial port opened");
});

io.on("connection", function (socket) {
    console.log("socket.io connection");

    // Listen for data from the serial port and send it to the client
    parser.on("data", function (data) {
        data = data.trim(); // Clean up the data
        socket.emit("data", data); // Emit the data to the connected client
    });

    socket.on("disconnect", function () {
        console.log("disconnected");
    });
});

server.listen(3000, function () {
    console.log("listening on port 3000...");
});
