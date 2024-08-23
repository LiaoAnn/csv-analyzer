import { Label } from "./ui/label";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";

type GroupByProps = {
  headers: string[];
  groupBy: string[];
  setGroupBy: (groupBy: string[]) => void;
};

const GroupBy = ({ headers, groupBy, setGroupBy }: GroupByProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="group-by">Group By:</Label>
      <MultiSelector
        values={groupBy}
        onValuesChange={setGroupBy}
        loop
        className="max-w-xs"
      >
        <MultiSelectorTrigger>
          <MultiSelectorInput placeholder="Group By" />
        </MultiSelectorTrigger>
        <MultiSelectorContent>
          <MultiSelectorList>
            {headers.map((header) => (
              <MultiSelectorItem key={header} value={header}>
                {header}
              </MultiSelectorItem>
            ))}
          </MultiSelectorList>
        </MultiSelectorContent>
      </MultiSelector>
    </div>
  );
};

export default GroupBy;
