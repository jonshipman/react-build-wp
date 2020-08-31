import React, { useRef } from "react";
import { FormGroup } from "react-boilerplate-leadform";

import { ArchiveRender } from "./Archive";
import { ErrorRouting } from "./Single";
import { ReactComponent as SearchIcon } from "../static/images/search.svg";
import PageWidth from "./elements/PageWidth";
import Seo from "./elements/Seo";
import Title from "./elements/Title";
import useSearch from "./hooks/useSearch";

const SearchForm = ({ filter = "", setFilter = () => {} }) => {
  const inputRef = useRef();
  const { current } = inputRef;

  return (
    <PageWidth className="search flex-l items-center-l mb4">
      <FormGroup
        ref={inputRef}
        type="search"
        value={filter}
        placeholder="Search by name and content"
        onChange={(v) => setFilter(v)}
        onEnter={(v) => setFilter(v)}
      />
      <SearchIcon
        width={24}
        className="ml3 mb2 db pointer"
        onClick={() => {
          setFilter(current.value);
        }}
      />
    </PageWidth>
  );
};

const SearchLayout = ({
  filter,
  error,
  loading,
  renderer: { edges, props },
}) => {
  if (loading || error) {
    return <ErrorRouting loading={loading} error={error} />;
  }

  if (filter.length < 3) {
    return (
      <PageWidth className="gray tc">
        <div className="f4 f3-l mv4">
          This is where the search results will be. Use the form above to
          search.
        </div>
      </PageWidth>
    );
  }

  return <ArchiveRender edges={edges} {...props} />;
};

const Search = () => {
  const { edges, loading, error, filter, setFilter, ...props } = useSearch();
  const layoutProps = {
    filter,
    loading,
    error,
    renderer: { edges, props },
  };

  return (
    <>
      <Seo title="Search" canonical="/search" />

      <Title>Search</Title>
      <SearchForm filter={filter} setFilter={setFilter} />
      <SearchLayout {...layoutProps} />
    </>
  );
};

export default Search;
