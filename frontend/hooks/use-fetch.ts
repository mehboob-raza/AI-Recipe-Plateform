import { useState } from "react";
import { toast } from "sonner";

const useFetch = <T = any>(cb: (...args: any[]) => Promise<T>) => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fn = async (...args: Parameters<typeof cb>) => {
        setLoading(true);
        setError(null);

        try {
            const response = await cb(...args);
            setData(response);
            setError(null);
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            setError(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fn, setData };
};

export default useFetch;