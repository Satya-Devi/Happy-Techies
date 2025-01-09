"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Button, Container } from "@mantine/core"
import classes from "./SolutionAreaFilter.module.css";

const KeyAreas = {
    "Data & AI": "Data and AI",
    "Security": "Security",
    "Modern Workplace and Surface": "Modern Work",
    "Infrastructure": "Infrastructure",
    "Business Applications": "Business Applications",
    "Digital & Application Innovation": "Digital and App Innovation"
}
const SolutionAreaFilter: React.FC = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);
    const handleClick=(key: keyof typeof KeyAreas)=>{
        params.delete("query");
        if (key) {
            if(searchParams.get("filter")=== KeyAreas[key]){
                params.delete("filter");
                replace(`${pathname}?${params.toString()}`);
                return;
            }
            params.set("filter", KeyAreas[key]);
        } else {
            params.delete("filter");
        }
        params.delete("page");
        replace(`${pathname}?${params.toString()}`);
    }


    const getVariant=(key: keyof typeof KeyAreas)=>{
            if(searchParams.get("filter")=== KeyAreas[key]){
                return "filled"
            }
            return "outline"
        }

    return(
        <Container className={classes.container} fluid px={0} my="md">
            {Object.keys(KeyAreas).map((key) => {
                const typedKey = key as keyof typeof KeyAreas;
                return (
                    <Button 
                        radius="lg" 
                        mx="xs"  
                        key={key}
                        className={classes.button + " " +(getVariant(typedKey)=="filled"?classes.active:" ")}
                        variant={getVariant(typedKey)}
                        onClick={() => handleClick(typedKey)}
                        >
                        {key}
                    </Button>
                );
            })}
        </Container>
    )
}

export default SolutionAreaFilter