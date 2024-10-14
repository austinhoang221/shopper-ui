import { useEffect, useState } from 'react';

const useMediaQuery = (query: A) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    
    const handleChange = (event: A) => {
      setMatches(event.matches);
    };

    // Đặt giá trị ban đầu
    setMatches(mediaQueryList.matches);
    
    // Lắng nghe sự thay đổi của media query
    mediaQueryList.addEventListener('change', handleChange);

    // Dọn dẹp khi component unmount
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
