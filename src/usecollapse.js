import { useState, useCallback } from 'react';

const useCollapse = (initialState = false) => {
  const [isExpanded, setIsExpanded] = useState(initialState);

  const toggleCollapse = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const getCollapseProps = () => ({
    style: {
      display: isExpanded ? 'block' : 'none',
    },
  });

  const getToggleProps = () => ({
    onClick: toggleCollapse,
    'aria-expanded': isExpanded,
  });

  return {
    isExpanded,
    getCollapseProps,
    getToggleProps,
  };
};

export default useCollapse;
