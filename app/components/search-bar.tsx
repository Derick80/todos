// app/components/search-bar.tsx

import {
  useNavigate,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";

export function SearchBar() {
  const navigate = useNavigate();

  let [searchParams] = useSearchParams();

  const clearFilters = () => {
    searchParams.delete("filter");

    navigate("/todos");
  };

  const submit = useSubmit();

  const handleCompletedChange = (e: { currentTarget: { form: URLSearchParams | HTMLInputElement | HTMLFormElement | HTMLButtonElement | FormData | { [name: string]: string } | null } }) => {
    submit(e.currentTarget.form);
    navigate("/todos");
  };

  return (
    <div className="flex items-center">
      <form
        method="post"
        action={`/todos?filter=${searchParams.get("filter")} `}
        className="flex h-20 w-full items-center gap-2 px-6"
      >
        <div className={`flex w-fit items-center gap-1`}>
          <input
            type="hidden"
            name="filter"
            className="w-full rounded-xl px-3 py-2"
            placeholder="completed or not completed"
            onChange={(e) => submit(e.currentTarget.form, { replace: true })}
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-300 px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
            onChange={handleCompletedChange}
          >
            Filter
          </button>
        </div>

        {searchParams.has("filter") && (
          <button
            onClick={clearFilters}
            className="rounded-xl bg-red-300 px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
          >
            Clear Filters
          </button>
        )}
        <div className="flex-1" />
      </form>
    </div>
  );
}
