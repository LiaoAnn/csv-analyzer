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
import type { Filter } from "@/lib/features/filter";
import { useAppDispatch } from "@/lib/hooks";
import { addFilter, removeFilter, updateFilter } from "@/lib/features/filter";

type FilterProps = {
  filters: Filter[];
  headers: string[];
};

const Filter = ({ filters, headers }: FilterProps) => {
  const dispatch = useAppDispatch();

  const _addFilter = () => {
    dispatch(addFilter({ column: headers[0], condition: "equals", value: "" }));
  };

  const _updateFilter = (index: number, field: keyof Filter, value: string) => {
    const newFilter = { ...filters[index] };
    newFilter[field] = value;
    dispatch(updateFilter({ index, filter: newFilter }));
  };

  const _removeFilter = (index: number) => {
    dispatch(removeFilter(index));
  };
  return (
    <div className="space-y-2">
      {filters.map((filter, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Select
            value={filter.column}
            onValueChange={(value) => _updateFilter(index, "column", value)}
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
            onValueChange={(value) => _updateFilter(index, "condition", value)}
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
            onChange={(e) => _updateFilter(index, "value", e.target.value)}
            placeholder="Filter value"
            className="w-[180px]"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => _removeFilter(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button onClick={_addFilter} variant="outline" size="sm">
        <Plus className="h-4 w-4 mr-2" /> Add Filter
      </Button>
    </div>
  );
};

export default Filter;
