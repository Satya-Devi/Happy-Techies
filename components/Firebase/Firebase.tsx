"use client"

import  { useEffect } from "react"
import { analytics } from "@/utils/firebase"
import { logEvent } from 'firebase/analytics';
import { usePathname, useSearchParams } from "next/navigation";

const Firebase = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if(analytics){
            logEvent(analytics, 'page_view', {
                page_path: pathname,
                page_search: searchParams.toString(),
            });
        }
    },[pathname,searchParams])

    return(<></>)
}

export default Firebase;