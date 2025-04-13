'use client';

import { useClientTranslation } from '../../../lib/client-i18n';
import type { Dictionary } from '../../../lib/i18n';

interface ClientTranslationExampleProps {
  dictionary: Dictionary;
}

export default function ClientTranslationExample({ dictionary }: ClientTranslationExampleProps) {
  const { t, locale, changeLocale } = useClientTranslation(dictionary);

  return (
    <div className="p-4 border rounded shadow my-4">
      <h2 className="text-xl font-semibold mb-2">{t('menu.about')}</h2>
      <p className="mb-4">
        {t('about.githubProject')} - {locale}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => changeLocale('en')}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          English
        </button>
        <button
          onClick={() => changeLocale('es')}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Español
        </button>
        <button
          onClick={() => changeLocale('fr')}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Français
        </button>
      </div>
    </div>
  );
}