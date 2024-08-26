import { useAppDispatch } from "@/lib/hooks";
import { Label } from "./ui/label";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { setGroupBy } from "@/lib/features/groupBy";

type GroupByProps = {
  headers: string[];
  groupBy: string[];
};

const GroupBy = ({ headers, groupBy }: GroupByProps) => {
  const dispatch = useAppDispatch();

  const _setGroupBy = (groupBy: string[]) => {
    dispatch(setGroupBy(groupBy));
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="group-by">Group By:</Label>
      <MultiSelector
        values={groupBy}
        onValuesChange={_setGroupBy}
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
