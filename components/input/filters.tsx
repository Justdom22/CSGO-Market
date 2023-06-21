"use client";

import { Filter, ShortFilter } from "@/types";
import { Disclosure } from "./disclosure";
import { Checkbox } from "./checkbox";
import { SearchBox } from "./searchBox";

import Slider from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap_white.css";

interface FiltersPanelProps {
  apiFilters: Filter[];
  filters: ShortFilter[];

  onFiltersChanged?: (filters: ShortFilter[]) => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  apiFilters,
  filters,
  onFiltersChanged,
}) => {
  const allFilters = apiFilters
    .filter((f) => f.type === "CHECKBOX" || f.type === "RANGE" || f.type === "INPUT")
    .sort((a, b) => a.order - b.order);

  function changeFilterItems(type: string, filter: ShortFilter, add: boolean) {
    let rootFilter = filters.find((f) => f.id == type);

    if (rootFilter === undefined) {
      if (!add) return;

      rootFilter = {
        id: type,
        items: [filter],
      };

      const newFilters = [...filters, rootFilter];
      onFiltersChanged?.(newFilters);
    } else {
      if (add) {
        rootFilter.items = [...rootFilter.items!, filter];
      } else {
        rootFilter.items = rootFilter.items?.filter((f) => f.id !== filter.id);

        if (rootFilter.items?.length == 0) {
          onFiltersChanged?.([...filters.filter((f) => f.id !== rootFilter?.id)]);
          return;
        }
      }

      onFiltersChanged?.([...filters.filter((f) => f.id !== rootFilter?.id), rootFilter]);
    }
  }

  function onCheckboxChanged(valueId: string, type: string, isChecked: boolean) {
    const valueFilter = {
      id: valueId,
    };

    changeFilterItems(type, valueFilter, isChecked);
  }

  function onRangeChanged(values: number[], valueId: string, max: number) {
    if (values[0] === 0 && values[1] === max) {
      onFiltersChanged?.([...filters.filter((f) => f.id !== valueId)]);
      return;
    }

    const rootFilter: ShortFilter = {
      id: valueId,
    };

    if (values[0] !== 0) rootFilter.min = values[0];

    if (values[1] !== max) rootFilter.max = values[1];

    onFiltersChanged?.([...filters.filter((f) => f.id !== rootFilter?.id), rootFilter]);
  }

  function onInputChange(value: string, valueId: string) {
    if (!value || value === "") {
      onFiltersChanged?.([...filters.filter((f) => f.id !== valueId)]);
      return;
    }

    const rootFilter: ShortFilter = {
      id: valueId,
    };

    rootFilter.items = [{ id: value }];

    onFiltersChanged?.([...filters.filter((f) => f.id !== rootFilter?.id), rootFilter]);
  }

  return (
    <div className="w-80 bg-shade-200 rounded-r-[20px] flex flex-col pt-6">
      <h2 className="text-center">Filters</h2>

      <div className="pl-5 pr-4 divide-solid divide-y divide-shade-300">
        {allFilters.map((f, index) => {
          if (f.type === "RANGE") {
            return (
              <Disclosure
                key={`_filter_group_${index}`}
                title={f.name}
                style={{
                  paddingTop: "24px",
                  paddingBottom: "24px",
                }}
              >
                <>
                  <h3>{f.name}</h3>
                  <div className="w-full px-2">
                    <Slider
                      range
                      step={f.id === "float" ? 0.1 : 10}
                      min={0}
                      max={f.id === "float" ? 1 : 1500}
                      defaultValue={[0, f.id === "float" ? 1 : 1500]}
                      onAfterChange={(value) => {
                        if (Array.isArray(value)) {
                          onRangeChanged(value, f.id, f.id === "float" ? 1 : 1500);
                        }
                      }}
                      railStyle={{
                        backgroundColor: "#040626",
                      }}
                      trackStyle={{
                        backgroundColor: "#2AC8EB",
                      }}
                      handleStyle={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#2AC8EB",
                        borderWidth: "4px",
                      }}
                      handleRender={(node, handleProps) => {
                        return (
                          <Tooltip
                            overlayInnerStyle={{
                              minHeight: "auto",
                              padding: "0",
                              border: "none",
                              color: "#FFFFFF",
                              backgroundColor: "transparent",
                            }}
                            showArrow={false}
                            overlay={`${handleProps.value}`}
                            visible
                            placement="bottom"
                          >
                            {node}
                          </Tooltip>
                        );
                      }}
                      className="mt-4 mb-2"
                    />
                  </div>
                </>
              </Disclosure>
            );
          }

          if (f.type === "INPUT") {
            return (
              <Disclosure
                key={`_filter_group_${index}`}
                title={f.name!}
                style={{
                  paddingTop: "24px",
                  paddingBottom: "24px",
                }}
              >
                <SearchBox
                  style={{
                    height: "40px",
                    backgroundColor: "#141436",
                  }}
                  onSubmit={(v) => onInputChange(v, f.id)}
                />
              </Disclosure>
            );
          }

          if (f.type === "CHECKBOX") {
            return (
              <Disclosure
                key={`_filter_group_${index}`}
                title={f.name!}
                style={{
                  paddingTop: "24px",
                  paddingBottom: "24px",
                }}
              >
                {f.items?.map((checkboxFilter) => (
                  <Checkbox
                    onSubmit={(value, checked) => onCheckboxChanged(value, f.id, checked)}
                    key={`_filter_group_${index}_${checkboxFilter.id}`}
                    label={checkboxFilter.name!}
                    value={checkboxFilter.id}
                  ></Checkbox>
                ))}
              </Disclosure>
            );
          }
        })}
      </div>
    </div>
  );
};

export { FiltersPanel };
