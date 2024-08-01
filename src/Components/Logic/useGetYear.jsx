import { useState, useEffect } from 'react';

export default function useGetYear(data) {
    const [year, setYear] = useState("");
    console.log("Data in useGetYear:");
    console.log(data);

    useEffect(() => {
        if (data) {
            setYear(data.dt_txt.slice(0, 4));
        }
    }, [data]);

    return year;
}