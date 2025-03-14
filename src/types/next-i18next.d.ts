import 'next-i18next';

declare module 'next-i18next' {
  interface Resources {
    items: {
      [key: string]: string;
    };
    stations: {
      [key: string]: string;
    };
  }
} 