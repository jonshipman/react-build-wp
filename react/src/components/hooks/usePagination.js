import { useCallback, useState } from "react";

export const getPageInfo = (
  pageInfo = {
    endCursor: "",
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: "",
  }
) => pageInfo;

export const useNavigation = ({ goNext, endCursor, goPrev, startCursor }) => {
  const next = useCallback(() => {
    goNext(endCursor);
  }, [goNext, endCursor]);

  const prev = useCallback(() => {
    goPrev(startCursor);
  }, [goPrev, startCursor]);

  return { prev, next };
};

const usePagination = (perPage = 10) => {
  const [cursor, setCursor] = useState();
  const [direction, setDirection] = useState();
  const variables = {};

  if (!direction) {
    variables.first = perPage;
  } else if (direction < 0) {
    variables.last = perPage;
    variables.before = cursor;
  } else if (direction > 0) {
    variables.first = perPage;
    variables.after = cursor;
  }

  const goNext = useCallback(
    (endCursor) => {
      setDirection(1);
      setCursor(endCursor);
      window.scrollTo(0, 0);
    },
    [setDirection, setCursor]
  );

  const goPrev = useCallback(
    (startCursor) => {
      setDirection(-1);
      setCursor(startCursor);
      window.scrollTo(0, 0);
    },
    [setDirection, setCursor]
  );

  return {
    variables,
    direction,
    cursor,
    goNext,
    goPrev,
  };
};

export default usePagination;
