import { searchSkills } from "@/supabase/functions/_shared/constants";
import { Badge, Group } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchSpeciality() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>(
    []
  );

  useEffect(() => {
    const specialityParam = searchParams.get("speciality");
    if (specialityParam) {
      const decodedSpecialities =
        decodeURIComponent(specialityParam).split(",");
      setSelectedSpecialities(decodedSpecialities);
    }
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    let newSpecialities: string[];
    if (selectedSpecialities.includes(term)) {
      newSpecialities = selectedSpecialities.filter((s) => s !== term);
    } else {
      newSpecialities = [term];
    }
    setSelectedSpecialities(newSpecialities);
    if (newSpecialities.length > 0) {
      params.set("speciality", newSpecialities.join(","));
    } else {
      params.delete("speciality");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Group gap="sm" pt="md">
      {searchSkills.map((skill) => (
        <Badge
          variant={selectedSpecialities.includes(skill) ? "filled" : "outline"}
          size="lg"
          key={skill}
          color="#004a93"
          style={{ cursor: "pointer" }}
          onClick={() => handleSearch(skill)}
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
  );
}
