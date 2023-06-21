import Link from "next/link";
import { useRouter } from "next/navigation";

import { Filter } from "@/types";
import { Dropdown } from "@/components/input/dropdown";

interface NavbarEndpoint {
  title: string;
  href: string;

  onClick?: () => void;
}

interface NavbarProps {
  endpoints: NavbarEndpoint[];
}

interface TypeNavigationProps {
  apiFilters: Filter[];
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const className =
    "relative cursor-pointer hover:text-primary-100 after:border-b-2 after:absolute after:w-0 active:after:w-full after:mt-8 after:border-primary-100 after:transition-all after:duration-75";

  return (
    <div className="space-x-6 flex">
      {props.endpoints.map((page, index) => {
        if (page.href) {
          return (
            <Link key={`navigation_${index}`} href={page.href} className={className}>
              <h4>{page.title}</h4>
            </Link>
          );
        } else {
          return (
            <div
              key={`navigation_${index}`}
              className={className}
              onClick={() => page.onClick?.()}
            >
              <h4>{page.title}</h4>
            </div>
          );
        }
      })}
    </div>
  );
};

const TypeNavigation: React.FC<TypeNavigationProps> = ({ apiFilters }) => {
  const router = useRouter();
  const rootFilter = apiFilters.filter((f) => f.id === "type")[0];

  const getFilterItems = (filter: Filter): string[] => {
    const items: string[] = [];

    if (filter.plural) items.push(filter.plural);

    filter.items?.map((f) => {
      if (f) {
        items.push(f.id);
      }
    });

    return items;
  };

  function onTypeSelect(value: string, group: string) {
    const groupFilter = rootFilter.items?.find((f) => f.id === group);

    if (value === group) {
      router.push(`/${value}`);
    } else if (value !== groupFilter?.plural) {
      router.push(`${group}/${value}`);
    } else {
      router.push(`${group}`);
    }
  }

  return (
    <div className="w-full gap-x-3.5 gap-y-2 flex flex-wrap justify-center 2xl:justify-start">
      {rootFilter.items?.map((filter, index) => (
        <Dropdown
          key={`type_navigation_${index}`}
          title={filter.id}
          values={getFilterItems(filter)}
          onSelect={(value) => onTypeSelect(value, filter.id)}
        />
      ))}
    </div>
  );
};

export { Navbar, TypeNavigation };
