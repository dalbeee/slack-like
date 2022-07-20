import { createServer } from "http";
import { Server, Socket as ServerSocket } from "socket.io";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

let ioServer: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
let ioServerSocket: ServerSocket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;
let ioClient: Socket<DefaultEventsMap, DefaultEventsMap>;

describe("without authenticate", () => {
  beforeEach((done) => {
    const httpServer = createServer();
    ioServer = new Server(httpServer);

    httpServer.listen();
    const port = (httpServer.address() as any).port;
    ioClient = io(`http://localhost:${port}`);
    ioServer.on("connection", (socket) => {
      ioServerSocket = socket;
    });
    ioClient.on("connect", done);
  });

  afterEach(() => {
    ioServer.close();
    ioClient.close();
  });

  it("c - s", (done) => {
    ioServerSocket.on("message", () => {
      console.log("server received messsage");
      done();
    });
    ioClient.emit("message", "world");
  });

  it("s - c", (done) => {
    ioClient.on("message", () => {
      console.log("client received message");
      done();
    });
    ioServer.emit("message", "data");
  });

  it("c - s - c", (done) => {
    ioServerSocket.on("init", () => {
      ioServer.emit("ack", "ack");
    });

    ioClient.on("ack", () => {
      console.log("client received ack");
      done();
    });

    ioClient.emit("init", "data");
  });
});

describe("with authenticate", () => {
  beforeEach((done) => {
    const httpServer = createServer();
    ioServer = new Server(httpServer);

    httpServer.listen();
    const port = (httpServer.address() as any).port;
    ioClient = io(`http://localhost:${port}`, { auth: { token: "hello" } });
    ioServer
      .on("connection", (socket) => {
        ioServerSocket = socket;
        ioServer.on("auth", (socket) => {
          console.log(socket);
        });
        console.log("socket header> ", socket.handshake.auth);
      })
      .on("authenticated", (socket) => {
        console.log("authenticated on server");
      });
    ioClient.on("connect", done);
  });

  afterEach(() => {
    ioServer.close();
    ioClient.close();
  });

  it("c - s - c with ttl data", (done) => {
    ioServerSocket.on("init", () => {
      ioServer.emit("ack", "ack");
    });

    ioClient.on("ack", () => {
      console.log("client received ack");
      done();
    });

    ioClient.emit("authicated", "data");
  });
});
