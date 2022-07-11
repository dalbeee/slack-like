import { DefaultEventsMap } from "@socket.io/component-emitter";
import { createServer, Server as HttpServer } from "http";
import { Server } from "socket.io";
import { io } from "socket.io-client";

let ioServer: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
let httpServer: HttpServer;

beforeEach((done) => {
  httpServer = createServer();
  httpServer.listen();
  ioServer = new Server(httpServer);
  done();
});

afterEach(() => {
  ioServer.close();
  httpServer.close();
});

const createIoClient = () =>
  io(`http://localhost:${(httpServer.address() as any).port}`);

it("", (done) => {
  ioServer.on("connection", (socket) => {
    console.log(socket.id);
    socket.emit("hello", "value");
  });

  const port = ((httpServer as any).address() as any).port;
  const ioClient = createIoClient();

  ioClient.on("hello", (value) => {
    console.log("value>>", value);
  });

  ioClient.on("connect", done);
});

it("", (done) => {
  const port = ((httpServer as any).address() as any).port;
  const ioClient = createIoClient();
  const ioClient2 = createIoClient();
  ioServer.on("connection", (socket) => {
    console.log(socket.id);
    socket.emit("hello", "value");
  });

  ioClient.on("hello", (value) => {
    console.log("client-1");
  });

  ioClient2.on("hello", (value) => {
    console.log("client-2");
  });

  ioClient.on("connect", () => {});
  ioClient2.on("connect", done);
});

it("", (done) => {
  ioServer.on("connection", (socket) => {
    console.log("new connection", socket.id);
    socket.emit("message", { value: "world" });
  });

  const ioClient = createIoClient();
  ioClient.on("message", (res) => {
    console.log(res);
  });

  ioClient.on("connect", done);
});

it("", (done) => {
  ioServer.on("connection", (socket) => {
    console.log("new connection", socket.id);
    socket.emit("message", "wopr", { value: "world" }, (res: any) => {
      console.log(res);
    });
  });

  const ioClient = createIoClient();
  ioClient.on("message", (res, res2, cb) => {
    // console.log(res);

    cb("a");
  });

  ioClient.on("connect", done);
});
