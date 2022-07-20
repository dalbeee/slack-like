import { DefaultEventsMap } from "@socket.io/component-emitter";
import { createServer } from "http";
import { Server, Socket as ServerSocket } from "socket.io";
import { io, Socket } from "socket.io-client";

describe("disconnect on client if retry failed", () => {
  let ioServer: Server<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  >;
  let ioServerSocket: ServerSocket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  >;
  let ioClient: Socket<DefaultEventsMap, DefaultEventsMap>;

  beforeEach((done) => {
    let retry = 3;
    const httpServer = createServer();
    httpServer.listen();
    const port = (httpServer.address() as any).port;

    ioServer = new Server(httpServer);
    ioServer.on("connection", (socket) => {
      ioServerSocket = socket;
      ioServerSocket.on("authenticate", () => {
        ioServerSocket.emit(
          "authenticate",
          ioServerSocket.handshake.auth.token
            ? { result: true }
            : { result: false }
        );
      });
    });

    ioClient = io(`http://localhost:${port}`);
    ioClient.on("authenticate", (data: { result: any }) => {
      if (!data.result) {
        retry--;
        if (retry > 0) {
          ioClient.auth = { token: null };
          ioClient.disconnect().connect();
          ioClient.emit("authenticate");
        } else {
          console.log("connection closed.");
          ioClient.disconnect();
          done();
        }
        return;
      }
      done();
    });
    ioClient.on("connect", () => {
      ioClient.emit("authenticate");
    });
  });

  afterEach(() => {
    ioServer.close();
    ioClient.close();
  });

  it("c - s - c with ttl data", (done) => {
    ioServerSocket.on("init", () => {
      console.log("get data ");
      done();
    });

    ioClient.emit("init", "data");
    if (!ioClient.active) done();
  });
});
