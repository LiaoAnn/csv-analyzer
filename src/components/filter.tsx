import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

type Filter = {
  column: string;
  condition: string;
  value: string;
};

type FilterProps = {
  filters: Filter[];
  headers: string[];
  setFilters: (filters: Filter[]) => void;
};

const Filter = ({ filters, headers, setFilters }: FilterProps) => {
  const addFilter = () => {
    setFilters([
      ...filters,
      { column: headers[0], condition: "equals", value: "" },
    ]);
  };

  const updateFilter = (index: number, field: keyof Filter, value: string) => {
    const newFilters = [...filters] as Filter[];
    newFilters[index][field] = value;
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };
  return (
    <div className="space-y-2">
      {filters.map((filter, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Select
            value={filter.column}
            onValueChange={(value) => updateFilter(index, "column", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              {headers.map((header) => (
                <SelectItem key={header} value={header}>
                  {header}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filter.condition}
            onValueChange={(value) => updateFilter(index, "condition", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equals">Equals</SelectItem>
              <SelectItem value="not equals">Not Equals</SelectItem>
              <SelectItem value="in">In</SelectItem>
              <SelectItem value="not in">Not In</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            value={filter.value}
            onChange={(e) => updateFilter(index, "value", e.target.value)}
            placeholder="Filter value"
            className="w-[180px]"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFilter(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button onClick={addFilter} variant="outline" size="sm">
        <Plus className="h-4 w-4 mr-2" /> Add Filter
      </Button>
    </div>
  );
};

export default Filter;
