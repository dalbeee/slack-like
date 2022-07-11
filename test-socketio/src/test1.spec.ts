import { DefaultEventsMap } from "@socket.io/component-emitter";
import { createServer } from "http";
import { Server, Socket as ServerSocket } from "socket.io";
import { io, Socket } from "socket.io-client";

describe("my awesome project", () => {
  let client: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  let ioServer: ServerSocket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  >;
  let ioClient: Socket<DefaultEventsMap, DefaultEventsMap>;

  beforeEach((done) => {
    const httpServer = createServer();
    client = new Server(httpServer);

    httpServer.listen();
    const port = (httpServer.address() as any).port;
    ioClient = io(`http://localhost:${port}`);
    client.on("connection", (socket) => {
      console.log(socket.id);
      ioServer = socket;
    });
    ioClient.on("connect", done);
  });

  afterEach(() => {
    client.close();
    ioClient.close();
  });

  test("should work", (done) => {
    ioClient.on("hello", (arg) => {
      expect(arg).toBe("world");
      done();
    });
    ioServer.emit("hello", "world");
  });

  test("should work (with ack)", (done) => {
    ioServer.on("hi", (cb) => {
      cb("hola");
    });
    ioClient.emit("hi", (arg: any) => {
      expect(arg).toBe("hola");
      done();
    });
  });

  test("should work (with ack)", (done) => {
    ioServer.on("hi", (cb) => {
      cb("a");
    });
    ioClient.emit("hi", (arg: any) => {
      expect(arg).toBe("a");
      done();
    });
  });

  it("", (done) => {
    ioServer.on("aa", (socket) => {
      console.log(socket.id);
      socket("a");
    });
    ioClient.emit("aa", () => {
      done();
    });
  });
  // test("should emit message on room subscribed after connection", (done) => {
  //   const testMsg = "HelloWorld";

  //   ioClient.emit("subscribe", "room2", () => {
  //     ioServer.of("/test").to("room2").emit("customEvent", testMsg);
  //     ioClient.on("customEvent", function (msg) {
  //       expect(msg).toBe(testMsg);
  //       done();
  //     });
  //   });
  // });
  // test("should emit message on specific room sent on connection event.", function (done) {
  //   const testMsg = "HelloWorld";

  //   ioServer.of("/test").to("room1").emit("obd", testMsg);

  //   ioClient.on("obd", function (msg) {
  //     expect(msg).toBe(testMsg);
  //     done();
  //   });
  // });
});
