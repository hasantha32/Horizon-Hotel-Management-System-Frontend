import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';

interface ConfirmRedirectIfDirtyProps {
  isDirty: boolean;
  message?: string;
}

export function useConfirmRedirectIfDirty({
  isDirty,
  message = 'You have unsaved changes - are you sure you wish to leave this page?',
}: ConfirmRedirectIfDirtyProps) {
  const router = useRouter();
  // use refs to store the values
  const isDirtyRef = useRef(isDirty);
  const messageRef = useRef(message);

  // update the refs only when the values change
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    messageRef.current = message;
  }, [message]);

  // use useCallback to memoize the functions
  const handleWindowClose = useCallback((e: BeforeUnloadEvent) => {
    if (!isDirtyRef.current) return;
    e.preventDefault();
    return (e.returnValue = messageRef.current);
  }, []);

  const handleBrowseAway = useCallback(() => {
    if (!isDirtyRef.current) return;
    if (window.confirm(messageRef.current)) return;
    router.events.emit('routeChangeError');
    throw 'routeChange aborted.';
  }, []);

  // use the memoized functions as dependencies
  useEffect(() => {
    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleBrowseAway);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, [handleWindowClose, handleBrowseAway]);
}
