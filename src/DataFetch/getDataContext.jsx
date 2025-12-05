import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (url, token) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setData(response.data.data);
        }
      } catch (error) {
        // If server returns 404 (e.g., wishlist empty), treat as empty data instead of an error
        if (error.response && error.response.status === 404) {
          setData([]);
        } else {
          setError(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, token]);

  return { data, loading, error };
};

export default useFetch;