"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = new Date();
  const localDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const currentDate = searchParams.get("date") || localDateStr;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      router.push(`/?date=${newDate}`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <div className="flex items-center gap-4 mb-8">
      <Label htmlFor="date" className="text-lg font-semibold">
        Filter by Date
      </Label>
      <Input
        id="date"
        type="date"
        value={currentDate}
        onChange={handleDateChange}
        className="w-48"
      />
    </div>
  );
}
