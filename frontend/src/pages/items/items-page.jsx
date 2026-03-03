import React, { useEffect, useMemo, useState } from 'react';
import { List } from 'react-window';
import { Link } from 'react-router-dom';
import { useItemsQuery } from '../../entities/items';
import Btn from '../../shared/components/btn';
import CardContent from '../../shared/components/card-content';

const ITEMS_QUERY_PARAMS = { limit: 10000 };
const ROW_HEIGHT = 56;
const LIST_HEIGHT = 560;
const SEARCH_DEBOUNCE_MS = 300;

const Row = ({ index, style, items }) => {
  const item = items[index];

  return (
    <div
      style={style}
      className="grid min-w-[560px] grid-cols-[2fr_1.5fr_1fr_1fr] items-center border-t border-white/8 px-5 text-sm text-slate-100/95"
    >
      <div className="pr-4">
        <Link
          className="font-medium text-slate-100 transition hover:text-cyan-200"
          to={`/items/${item.id}`}
        >
          {item.name}
        </Link>
      </div>
      <div className="pr-4">{item.category}</div>
      <div className="pr-4">
        $
        {item.price}
      </div>
      <div className="text-right">
        <Btn size="xs" to={`/items/${item.id}`} variant="primary">
          View details
        </Btn>
      </div>
    </div>
  );
};

const ItemsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const queryParams = useMemo(() => {
    if (!debouncedSearchTerm) {
      return ITEMS_QUERY_PARAMS;
    }

    return {
      ...ITEMS_QUERY_PARAMS,
      q: debouncedSearchTerm,
    };
  }, [debouncedSearchTerm]);

  const {
    data: items = [],
    isPending,
    isError,
  } = useItemsQuery(queryParams, {
    placeholderData: (previousData) => previousData,
  });

  if (isPending) {
    return <CardContent title="Items">Loading...</CardContent>;
  }

  if (isError) {
    return <CardContent title="Items">Unable to load items.</CardContent>;
  }

  return (
    <CardContent
      actions={(
        <div className="w-full max-w-xl">
          <input
            aria-label="Search items"
            id="items-search"
            className="w-full rounded-lg border border-white/20 bg-white/8 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-300/70 focus:border-cyan-300/55 focus:outline-none"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name or category"
            type="search"
            value={searchTerm}
          />
        </div>
      )}
      title="Items"
      subtitle="Select any item to view full details."
      contentClassName="overflow-hidden rounded-lg border border-white/12 bg-black/15"
    >
      <div className="overflow-auto [scrollbar-color:rgba(103,232,249,0.55)_rgba(255,255,255,0.08)] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-cyan-300/45 [&::-webkit-scrollbar-track]:bg-white/6 [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar]:w-2.5">
        <div className="grid min-w-[560px] grid-cols-[2fr_1.5fr_1fr_1fr] bg-white/6 px-5 py-3 text-sm text-slate-200/90">
          <div className="font-medium">Name</div>
          <div className="font-medium">Category</div>
          <div className="font-medium">Price</div>
          <div className="text-center font-medium">Action</div>
        </div>
        {items.length === 0 ? (
          <div className="min-w-[560px] px-5 py-8 text-center text-slate-300/80">
            {debouncedSearchTerm ? 'No items match your search.' : 'No items available.'}
          </div>
        ) : (
          <List
            className="min-w-[260px]"
            rowComponent={Row}
            rowCount={items.length}
            rowHeight={ROW_HEIGHT}
            rowProps={{ items }}
            style={{ height: LIST_HEIGHT, width: '100%' }}
          />
        )}
      </div>
    </CardContent>
  );
};

export default ItemsPage;
