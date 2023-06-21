import { Banner } from "@/components/banner";
import { ItemsSearch } from "@/components/items";
import { Filter } from "@/types";

interface Props {
  type: string[];
  filters: Filter[];
  children?: React.ReactNode;
}

const SearchPage: React.FC<Props> = ({ filters, type, children }) => {
  return (
    <main className="w-full">
      <Banner />

      <ItemsSearch apiFilters={filters} itemType={type[0]} itemId={type[1]} />

      {children}
    </main>
  );
};

export { SearchPage };
