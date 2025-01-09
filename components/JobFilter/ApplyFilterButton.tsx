"use client";

import { FilterData } from "@/utils/interface";
import { Button } from "@mantine/core";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ApplyFiltersButtonProps = {
  filterData: FilterData;
  setFilterData: (filterData: FilterData) => void;
  setAppliedFilters: (appliedFilters: FilterData) => void;
};

export default function ApplyFiltersButton({filterData,setFilterData,setAppliedFilters}:ApplyFiltersButtonProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [applied, setApplied] = useState(false);


    const disableApply=useMemo(()=>{
        let speciality=searchParams.get("speciality")||"";
        let company=searchParams.get("company")||"";
        let location=searchParams.get("location")||"";
        let query=searchParams.get("query")||"";
        let remote=searchParams.get("remote")=="true"?true:false;
        let includeContractor=searchParams.get("includeContractor")=="false"?false:true;
        let includeFulltime=searchParams.get("includeFulltime")==="false"?false:true;
        
        if(query !== filterData.query) return false;
        if(speciality !== filterData.speciality) return false;
        if(company !== filterData.company) return false;
        if(location !== filterData.location) return false;
        if(remote != filterData.remote)  return false;
        if(includeContractor != filterData.includeContractor) return false;
        if(includeFulltime != filterData.includeFulltime) return false;
        return true;
    
    },[filterData, searchParams]);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);
    if (filterData.speciality && filterData.speciality !== "") {
      params.set("speciality", filterData.speciality);
    } else {
      params.delete("speciality");
    }

    if (filterData.company && filterData.company !== "") {
      params.set("company", filterData.company);
    } else {
      params.delete("company");
    }

    if (filterData.query && filterData.query !== "") {
      params.set("query", filterData.query);
    } else {
      params.delete("query");
    }

    if (filterData.location && filterData.location !== "") {
      params.set("location", filterData.location);
    } else {
      params.delete("location");
    }

    if (filterData.includeContractor == false) {
      params.set("includeContractor", filterData.includeContractor.toString());
    } else {
      params.delete("includeContractor");
    }

    if (filterData.includeFulltime == false) {
      params.set("includeFulltime", filterData.includeFulltime.toString());
    } else {
      params.delete("includeFulltime");
    }

    if (filterData.remote) {
      params.set("remote", filterData.remote.toString());
    } else {
      params.delete("remote");
    }
    params.set("tab","all-jobs");
    replace(`${pathname}?${params.toString()}`);
    setAppliedFilters(filterData);
    setApplied(true);
  }


return (
  <Button color="#004a93" onClick={handleApply} disabled={disableApply} style={{ flexGrow: 1 }}>
    Apply Filters
  </Button>
  );
}
