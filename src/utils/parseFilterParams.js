export const parseContactType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isGender = (type) => ['home', 'work', 'personal'].includes(type);

  if (isGender(type)) return type;
};

export const parseIsFavourite = (isFavourite) => {
  if (typeof isFavourite === 'string') {
    return isFavourite.toLowerCase() === 'true';
  }

  if (typeof isFavourite === 'boolean') {
    return isFavourite;
  }

  return false;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;
  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);
  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
