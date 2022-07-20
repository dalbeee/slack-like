import { createServer } from "http";
import { Server } from "socket.io";
import { io } from "socket.io-client";

it("disconnect on server if retry failed", (done) => {
  let block = 1;
  const httpServer = createServer();
  httpServer.listen();
  const port = (httpServer.address() as any).port;

  const ioServer = new Server(httpServer);

  ioServer.on("connection", (socket) => {
    if (block) {
      block--;
      socket.disconnect();
    }
    socket.on("message", () => {
      console.log("get data");
      socket.emit("fin", "fin");
    });
  });

  const client = io(`http://localhost:${port}`);
  client.on("connect", () => {
    //   client.disconnect().connect();
    console.log(client.active);
    console.log(client.connected);
    done();
    client.emit("message", "data");
  });

  // const client2 = io(`http://localhost:${port}`);
  // client2
  //   .on("connect", () => {
  //     client2.emit("message", "data");
  //   })
  //   .on("fin", () => {
  //     console.log("close");
  //     done();
  //   });
});
