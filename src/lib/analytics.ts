interface EventProps {
  props: {
    action: string;
    label?: string;
  };
}

export function sendEvent(eventName: string, eventProps: EventProps): void {
  // Aquí se implementaría la lógica de analytics
  // Por ahora solo imprimimos en consola para desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', {
      name: eventName,
      ...eventProps
    });
  }
} 