'use client';

import { useState } from 'react';
import ClanName from './ClanName';

interface Clan {
  id?: string;
  name: string;
  symbol?: string;
  flagcolor?: string;
}

interface ClanSelectProps {
  leader?: boolean;
  clan?: Clan;
  onDelete?: (id?: string) => void;
}

export default function ClanSelect({ leader, clan, onDelete }: ClanSelectProps) {
  const [isHover, setIsHover] = useState(false);

  if (!clan) {
    return null;
  }

  return (
    <div
      className="row"
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onFocus={() => setIsHover(true)}
      onBlur={() => setIsHover(false)}
    >
      <div className={leader && isHover ? 'd-none' : 'col-12'}>
        <ClanName clan={clan} />
      </div>
      <div className={leader && isHover ? 'col-10' : 'd-none'}>
        <ClanName clan={clan} />
      </div>
      <div className={leader && isHover ? 'col-2' : 'd-none'}>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDelete?.(clan.id)}
        >
          <i className="fas fa-trash" />
        </button>
      </div>
    </div>
  );
} 