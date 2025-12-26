import { useEffect, useCallback } from 'react';

export const useMessagePort = () => {
  const sendMessage = useCallback((message: any, callback?: (response: any) => void) => {
    chrome.runtime.sendMessage(message, callback);
  }, []);

  return { sendMessage };
};
