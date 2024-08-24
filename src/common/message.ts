export enum MessageKey {
  GetFlashItems = 'GetFlashItems',
  GetFullItems = 'GetFullItems',
}

export async function sendMessage(key: MessageKey, payload?: any): Promise<any> {
  const res = await chrome.runtime.sendMessage({ key, payload });
  if (!res) {
    throw new Error('No response');
  }
  if (res.error) {
    throw objectToError(res.error);
  }
  return res.payload;
}

export async function handleMessage(task: Promise<any>, send: (response?: any) => void) {
  task.then((payload) => send({ payload })).catch((err) => send({ error: errorToObject(err) }));
}

function errorToObject(err: any): any {
  return {
    message: err?.message || String(err) || 'Unknown Error',
  };
}

function objectToError(obj: any): Error {
  return new Error(obj.message);
}
