import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { List } from 'react-window';
import { Link, useSearchParams } from 'react-router-dom';
import { useItemsQuery, useStatsQuery } from '../../entities/items';
import Btn from '../../shared/components/btn';
import CardContent from '../../shared/components/card-content';

const ROW_HEIGHT = 64;
const LIST_HEIGHT = 560;
const SEARCH_DEBOUNCE_MS = 300;
const PAGE_SIZE_OPTIONS = [25, 50, 100, 250];
const DEFAULT_PAGE_SIZE = 50;

const Row = ({
  index, style, items, returnTo, detailSearch,
}) => {
  const item = items[index];

  return (
    <div
      style={style}
      className="grid min-w-[560px] grid-cols-[2fr_1.5fr_1fr_1fr] items-center border-t border-white/8 px-5 py-1 text-sm text-slate-100/95"
    >
      <div className="pr-4">
        <Link
          className="font-medium text-slate-100 transition hover:text-cyan-200"
          state={{ from: returnTo }}
          to={`/items/${item.id}${detailSearch}`}
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
        <Btn size="xs" to={`/items/${item.id}${detailSearch}`} state={{ from: returnTo }} variant="primary">
          View details
        </Btn>
      </div>
    </div>
  );
};

const ItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialParams = useMemo(() => {
    if (typeof window === 'undefined') {
      return new URLSearchParams();
    }

    return new URLSearchParams(window.location.search);
  }, []);

  const initialSearch = initialParams.get('q') || '';
  const parsedInitialLimit = Number.parseInt(initialParams.get('limit'), 10);
  const parsedInitialPage = Number.parseInt(initialParams.get('page'), 10);

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch.trim());
  const [pageSize, setPageSize] = useState(
    PAGE_SIZE_OPTIONS.includes(parsedInitialLimit) ? parsedInitialLimit : DEFAULT_PAGE_SIZE,
  );
  const [currentPage, setCurrentPage] = useState(
    Number.isNaN(parsedInitialPage) || parsedInitialPage <= 0 ? 1 : parsedInitialPage,
  );
  const prevDebouncedSearchRef = useRef(debouncedSearchTerm);
  const prevPageSizeRef = useRef(pageSize);
  const prevPageRef = useRef(currentPage);

  const updateRouteParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    if (updates.q !== undefined) {
      if (updates.q) {
        nextParams.set('q', updates.q);
      } else {
        nextParams.delete('q');
      }
    }

    if (updates.limit !== undefined) {
      nextParams.set('limit', String(updates.limit));
    }

    if (updates.page !== undefined) {
      nextParams.set('page', String(Math.max(1, updates.page)));
    }

    setSearchParams(nextParams, { replace: true });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (prevDebouncedSearchRef.current === debouncedSearchTerm) {
      return;
    }

    prevDebouncedSearchRef.current = debouncedSearchTerm;

    setCurrentPage(1);
    updateRouteParams({ q: debouncedSearchTerm, page: 1 });
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (prevPageSizeRef.current === pageSize) {
      return;
    }

    prevPageSizeRef.current = pageSize;

    setCurrentPage(1);
    updateRouteParams({ limit: pageSize, page: 1 });
  }, [pageSize]);

  useEffect(() => {
    if (prevPageRef.current === currentPage) {
      return;
    }

    prevPageRef.current = currentPage;

    updateRouteParams({ page: currentPage });
  }, [currentPage]);

  const queryParams = useMemo(() => {
    const params = {
      limit: pageSize,
      page: currentPage,
    };

    if (debouncedSearchTerm) {
      params.q = debouncedSearchTerm;
    }

    return params;
  }, [currentPage, debouncedSearchTerm, pageSize]);

  const {
    data: itemsResponse,
    isPending,
    isError,
  } = useItemsQuery(queryParams, {
    placeholderData: (previousData) => previousData,
  });
  const hasItemsData = Array.isArray(itemsResponse?.items) && itemsResponse.items.length > 0;
  const { data: statsResponse, isError: isStatsError } = useStatsQuery({
    enabled: !isPending && !isError,
    placeholderData: (previousData) => previousData,
  });
  const items = itemsResponse?.items || [];
  const totalPages = itemsResponse?.pagination?.totalPages || 1;
  const totalItems = itemsResponse?.pagination?.total || 0;
  const statsSubtitle = !hasItemsData
    ? 'No stats available for empty results.'
    : isStatsError
    ? 'Unable to load stats.'
    : `Total items: ${statsResponse?.total ?? 0} | Avg price: $${Number(statsResponse?.averagePrice ?? 0).toFixed(2)}`;
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const startItemIndex = (currentPage - 1) * pageSize + (items.length > 0 ? 1 : 0);
  const endItemIndex = (currentPage - 1) * pageSize + items.length;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const returnTo = useMemo(() => {
    const params = new URLSearchParams();

    if (debouncedSearchTerm) {
      params.set('q', debouncedSearchTerm);
    }

    params.set('limit', String(pageSize));
    params.set('page', String(currentPage));

    const query = params.toString();
    return query ? `/?${query}` : '/';
  }, [currentPage, debouncedSearchTerm, pageSize]);

  const detailSearch = returnTo === '/' ? '' : returnTo.slice(1);

  if (isPending) {
    return <CardContent title="Items">Loading...</CardContent>;
  }

  if (isError) {
    return <CardContent title="Items">Unable to load items.</CardContent>;
  }

  return (
    <CardContent
      actions={(
        <div className="flex w-full flex-col gap-4 pt-1 sm:flex-row sm:items-end sm:justify-end">
          <div className="w-full sm:max-w-xl">
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
        </div>
      )}
      title="Items"
      subtitle={statsSubtitle}
      contentClassName="overflow-hidden rounded-lg border border-white/12 bg-black/15"
    >
      <div className="mt-4 overflow-auto [scrollbar-color:rgba(103,232,249,0.55)_rgba(255,255,255,0.08)] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-cyan-300/45 [&::-webkit-scrollbar-track]:bg-white/6 [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar]:w-2.5">
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
            rowProps={{ items, returnTo, detailSearch }}
            style={{
              height: Math.min(LIST_HEIGHT, Math.max(ROW_HEIGHT, items.length * ROW_HEIGHT)),
              width: '100%',
            }}
          />
        )}
      </div>
      <div className="p-6 flex flex-col gap-4 border-t border-white/10 text-sm text-slate-200/85 sm:flex-row sm:items-center sm:justify-between">
        <div>
          Showing
          {' '}
          {startItemIndex}
          -
          {endItemIndex}
          {' '}
          of
          {' '}
          {totalItems}
          {' '}
          (page
          {' '}
          {currentPage}
          /
          {totalPages}
          )
        </div>
        <div className="flex items-center gap-2">
          <label className="mr-2 flex shrink-0 items-center gap-2 text-sm text-slate-200/90" htmlFor="items-limit">
            <span>Rows</span>
            <select
              id="items-limit"
              className="rounded-lg border border-white/20 bg-slate-950/70 px-2.5 py-2 text-sm text-slate-100 focus:border-cyan-300/55 focus:outline-none"
              value={pageSize}
              onChange={(event) => setPageSize(Number.parseInt(event.target.value, 10))}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <Btn
            size="sm"
            variant="secondary"
            onClick={() => setCurrentPage((previousPage) => Math.max(1, previousPage - 1))}
            disabled={!hasPrevPage}
          >
            Prev
          </Btn>
          <span className="min-w-6 text-center">
            Page
            {' '}
            {currentPage}
            /
            {totalPages}
          </span>
          <Btn
            size="sm"
            variant="secondary"
            onClick={() => setCurrentPage((previousPage) => previousPage + 1)}
            disabled={!hasNextPage}
          >
            Next
          </Btn>
        </div>
      </div>
    </CardContent>
  );
};

export default ItemsPage;
