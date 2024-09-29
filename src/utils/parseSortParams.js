export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) return sortOrder;
  return SORT_ORDER.ASC;
};

export const parseSortBy = (sortBy) => {
  const keyOfContacts = ['name'];
  if (keyOfContacts.includes(sortBy)) return sortBy;
  return 'name';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
