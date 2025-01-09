"use client";
import { Box, Button } from "@mantine/core";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import classes from "./JobTabs.module.css";
import { useEffect, useMemo, useState } from "react";
import { IconFlame } from "@tabler/icons-react";
import { FaClockRotateLeft } from "react-icons/fa6";

const JobTabs = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [clickedTab, setClickedTab] = useState("");

    const activeTab = useMemo(() => {
        const tab = searchParams.get("tab");
        if (tab === "all-jobs") {
            return "all-jobs";
        } else if (tab === "latest-jobs") {
            return "latest-jobs";
        }
        return "hot-jobs";
    }, [searchParams, pathname]);

    useEffect(() => {
        setClickedTab("");
    }, [activeTab]);

    const handleClick = (tab: string) => {
        const params = new URLSearchParams(searchParams);
        setClickedTab(tab);
        if (tab) {
            params.set("tab", tab);
        } else {
            params.delete("tab");
        }
        params.delete("page");
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <Box className={classes.container}>
            <Button variant="transparent"
                className={classes.tabs + " " + (activeTab=="hot-jobs" ? classes.active : '')}
                onClick={() => handleClick("hot-jobs")}>
              {clickedTab=='hot-jobs'?"Loading...":<><IconFlame size="1rem" color="#E46137" style={{marginRight:5}}/> Hottest Jobs</>}
            </Button>
            <Button variant="transparent" 
               className={classes.tabs + " " + (activeTab=="latest-jobs" ? classes.active : '')} 
               onClick={() => handleClick("latest-jobs")}>
                {clickedTab=="latest-jobs"?"Loading...":<><FaClockRotateLeft size="1rem" color="##004A93" style={{marginRight:8}}/> Latest Jobs</>}
            </Button>
            <Button variant="transparent" 
               className={classes.tabs+ " " + (activeTab=="all-jobs" ? classes.active : '')} 
               onClick={() => handleClick("all-jobs")}>
                {clickedTab=="all-jobs"?"Loading...":"All Jobs"}
            </Button>
        </Box>
    );
}

export default JobTabs;