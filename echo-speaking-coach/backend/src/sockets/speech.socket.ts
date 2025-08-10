// import { Server, Socket } from 'socket.io';

// export const setupSpeechSocket = (io: Server) => {
//   io.on('connection', (socket: Socket) => {
//     console.log(`Client connected: ${socket.id}`);
    
//     socket.on('start-session', () => {
//       socket.emit('session-started', { 
//         sessionId: socket.id,
//         timestamp: new Date().toISOString()
//       });
//     });
    
//     socket.on('disconnect', () => {
//       console.log(`Client disconnected: ${socket.id}`);
//     });
//   });
// };

import { Server, Socket } from 'socket.io';

export const setupSpeechSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('start-session', () => {
      socket.emit('session-started', {
        sessionId: socket.id,
        timestamp: new Date().toISOString()
      });
      console.log(`Session started for client: ${socket.id}`);
    });

    socket.on('end-session', () => {
      socket.emit('session-ended', {
        sessionId: socket.id,
        timestamp: new Date().toISOString()
      });
      console.log(`Session ended for client: ${socket.id}`);
    });

    socket.on('speech-data', (data) => {
      // Process speech data here
      console.log(`Received speech data from ${socket.id}`);
      
      // Send back processed metrics
      socket.emit('metrics-update', {
        timestamp: new Date().toISOString(),
        // Add processed metrics here
      });
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};