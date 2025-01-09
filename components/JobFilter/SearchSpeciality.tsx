"use client";
import { searchSkills } from "@/supabase/functions/_shared/constants";
import { Badge, Button, Group } from "@mantine/core";
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react";
import { useState } from "react";

type SearchSpecialityProps = {
  speciality: string;
  setSpeciality: (company: string) => void;
};

export default function SearchSpeciality({speciality,setSpeciality}:SearchSpecialityProps) {

  const [showAll,setShowAll]=useState<boolean>(false);;
  
  const handleChange=(term:string)=>{
    setSpeciality(term);
  }

  const handleShowAll=()=>{
    setShowAll(prev=>!prev);
  }
  
  return (
    <>
    <Button p={0} onClick={handleShowAll} color="#2C3E50" h={20} variant="outline" w={20} style={{position:'absolute',borderRadius:'100%',right:'10px',top:20}} >
     {showAll?<IconChevronUp size={18}/>:<IconChevronDown size={18} />} 
    </Button>
    <Group gap="sm" pt="md">
      {(showAll?searchSkills:searchSkills.slice(0,5)).map((skill) => (
        <Badge
          variant={speciality==skill ? "filled" : "outline"}
          size="lg"
          key={skill}
          color="#004a93"
          style={{ cursor: "pointer" }}
          onClick={() => handleChange(skill)}
        >
          <span
            style={{
              letterSpacing: 1,
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {skill}
          </span>
        </Badge>
      ))}
    </Group>
    
    </>
  );
}
