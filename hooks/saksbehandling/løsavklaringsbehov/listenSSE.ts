import {
  ServerSentEventData,
  ServerSentEventStatus,
} from 'app/saksbehandling/api/behandling/hent/[referanse]/[gruppe]/[steg]/nesteSteg/route';

interface ListenSSECallbacks {
  onPolling: (status: ServerSentEventStatus) => void;
  onError: () => void;
}

export const listenSSE = (url: string, callbacks: ListenSSECallbacks): Promise<ServerSentEventData | null> => {
  return new Promise((resolve) => {
    const eventSource = new EventSource(url, { withCredentials: true });

    eventSource.onmessage = (event: MessageEvent) => {
      const eventData: ServerSentEventData = JSON.parse(event.data);

      if (eventData.status === 'DONE') {
        eventSource.close();
        resolve(eventData);
      }
      if (eventData.status === 'ERROR') {
        eventSource.close();
        callbacks.onError();
        resolve(null);
      }
      if (eventData.status === 'POLLING') {
        callbacks.onPolling(eventData.status);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      resolve(null);
    };
  });
};
