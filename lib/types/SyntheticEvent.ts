import React from 'react';

/**
 * Creates a synthetic event that is compatible with React.SyntheticEvent.
 * This function is used to create synthetic events for components that don't provide them.
 */
export function createSyntheticEvent<T = any>(value: T): React.SyntheticEvent {
  const element = document.createElement('div');

  const event = {
    bubbles: false,
    cancelable: false,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: false,
    timeStamp: Date.now(),
    type: 'change',
    nativeEvent: new Event('change'),

    preventDefault: () => {},
    stopPropagation: () => {},
    isDefaultPrevented: () => false,
    isPropagationStopped: () => false,
    persist: () => {},

    target: Object.assign(element, { value }),
    currentTarget: Object.assign(element, { value }),
  } as React.SyntheticEvent;

  return event;
}
