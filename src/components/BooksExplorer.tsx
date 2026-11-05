'use client';

import React from 'react';
import Ebooks from '../views/Ebooks';

export interface BooksExplorerProps {
  initialBooks?: any[];
  hideHeader?: boolean;
}

export default function BooksExplorer({ hideHeader = true }: BooksExplorerProps = {}) {
  const EbooksView = Ebooks as React.ComponentType<{
    activeEbook?: any;
    setActiveEbook?: any;
    onSelectCategory?: any;
    hideHeader?: boolean;
  }>;

  return <EbooksView hideHeader={hideHeader} />;
}
