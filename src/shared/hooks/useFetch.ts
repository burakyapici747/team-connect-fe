import { useState, useEffect } from 'react';
import {ApiResponse} from "@/shared/api/response/response";

export const useFetch = <T>(
    fetchFunction: (...args: any[]) => Promise<ApiResponse<T>>,
    ...params: any[]
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = fetchFunction(params);
        setData(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      console.log('Component unmounting');
    }

  }, []);

  return { data, loading };
};