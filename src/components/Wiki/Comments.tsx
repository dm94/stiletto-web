'use client';

import Giscus from '@giscus/react';
import { getStoredItem } from '@/lib/storage';
import { isDarkMode } from '@/lib/utils';

interface CommentsProps {
  name: string;
}

export const Comments = ({ name }: CommentsProps) => {
  if (!name || !getStoredItem('acceptscookies')) {
    return null;
  }

  const language = getStoredItem('i18nextLng');

  return (
    <div className="col-span-12">
      <div className="card border-secondary mb-3">
        <div className="card-body">
          <Giscus
            id="comments"
            repo="dm94/stiletto-web"
            repoId="MDEwOlJlcG9zaXRvcnkyOTk5OTE5OTk="
            category="Comments"
            categoryId="DIC_kwDOEeGDv84CSWZY"
            mapping="specific"
            term={name}
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme={isDarkMode() ? 'dark' : 'light'}
            lang={language || 'en'}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default Comments; 