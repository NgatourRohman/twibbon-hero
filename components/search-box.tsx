import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBox({
  placeholder,
  defaultValue,
}: {
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <form
      action="/campaigns"
      className="group glass-panel flex w-full min-w-0 max-w-2xl items-center gap-1.5 rounded-[20px] p-1.5 transition-all duration-300 focus-within:border-primary/30 focus-within:bg-white/85 focus-within:shadow-glow sm:gap-2 sm:rounded-[22px] sm:p-2"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-100 to-white text-primary shadow-[inset_0_1px_0_white] sm:ml-1">
        <Search className="size-4.5 transition-transform duration-300 group-focus-within:scale-110" />
      </span>
      <Input
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 min-w-0 flex-1 border-0 bg-transparent px-2 shadow-none backdrop-blur-none hover:bg-transparent focus:bg-transparent focus:ring-0 sm:px-4"
      />
      <Button type="submit" size="sm" className="h-10 shrink-0 px-3 sm:px-5">
        <span className="sm:hidden">Go</span>
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  );
}
