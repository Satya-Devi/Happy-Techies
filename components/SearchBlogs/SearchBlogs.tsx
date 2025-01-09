"use client";

import { blogCategories } from "@/supabase/functions/_shared/constants";
import { Badge, ScrollArea } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import classes from "./SeachBlogs.module.css";

export default function SearchBlogs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleBadgeSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (selectedCategory === term) {
      params.delete("blogs");
      setSelectedCategory(null);
    } else {
      params.set("blogs", term);
      setSelectedCategory(term);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <>
      <ScrollArea 
         type="never"
         scrollbars="y"
         scrollbarSize={0}
         style={{ height: 'auto', whiteSpace: 'nowrap' }}  
       
       >
        <div   className={classes.container} style={{ 
          display: "flex", gap: "8px" , overflowX:"auto",maxWidth:" calc (100% - 48px)", marginLeft:"48px"}}> 
        {blogCategories.map((category) => (
          <Badge
            variant={selectedCategory === category ? "filled" : "outline"}
            className={selectedCategory === category ? classes.selected : ""}
            size="xl"
            fw={500}
            key={category}
            color={selectedCategory === category?"#1D96FF":"#AFB0B9"}
            py={12}
            px={20}
            style={{ cursor: "pointer", flexShrink:0}}
            onClick={() => handleBadgeSearch(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </ScrollArea>
    </>
  );
}