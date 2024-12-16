import axios from "axios";
import { Column } from "primereact/column";
import {
  DataTable,
  DataTableSelectionMultipleChangeEvent,
  DataTableValueArray,
} from "primereact/datatable";
import { useCallback, useEffect, useRef, useState } from "react";
import { IData, IPagination, IResponse } from "../interfaces/response";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";

import CustomHeader from "./CustomHeader";

const Tables = () => {
  const [artworks, setArtworks] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(12);
  const [allSelections, setAllSelections] = useState<Map<number, IData>>(
    new Map()
  );
  const visitedPage = useRef<number[]>([]);

  const [selectedProducts, setSelectedProducts] = useState<DataTableValueArray>(
    []
  );
  const [pagesHaveSelectedItems, setPagesHaveSelectedItems] =
    useState<number>(0);
  const [lastPageHaveSelectedItems, setLastPageHaveSelectedItems] =
    useState<number>(0);

  const [paginationData, setPaginationData] = useState<IPagination>({
    current_page: 1,
    limit: 12,
    total: 0,
    offset: 0,
    total_pages: 0,
    next_url: "",
  });
  const columns = [
    { field: "title", header: "Title" },
    { field: "place_of_origin", header: "Place of Origin" },
    { field: "artist_display", header: "Artist Display" },
    { field: "inscriptions", header: "Inscriptions" },
    { field: "date_start", header: "Start Date" },
    { field: "date_end", header: "End Date" },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<IResponse>(
        `https://api.artic.edu/api/v1/artworks?limit=${rows}&page=${page}`
      );
      const data = response.data;
      setArtworks(data.data);
      setPaginationData(data.pagination);

      // Copy the existing selections to preserve state
      const newSelections = new Map(allSelections);

      if (!visitedPage.current.includes(page)) {
        visitedPage.current.push(page);
        if (pagesHaveSelectedItems > page) {
          // Only add items that are not already deselected
          data.data.forEach((item: IData) => {
            if (!newSelections.has(item.id)) {
              newSelections.set(item.id, item);
            }
          });
        } else if (pagesHaveSelectedItems === page) {
          const artworksToSelect = data.data.slice(
            0,
            lastPageHaveSelectedItems
          );
          artworksToSelect.forEach((item: IData) => {
            if (!newSelections.has(item.id)) {
              newSelections.set(item.id, item);
            }
          });
        }
      }
      setAllSelections(newSelections);
      // Update selected products for the current page
      const currentPageSelections = data.data.filter((item: IData) =>
        newSelections.has(item.id)
      );
      setSelectedProducts(currentPageSelections);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Handle selection changes
  const handleSelectionChange = (
    e: DataTableSelectionMultipleChangeEvent<DataTableValueArray>
  ) => {
    const newSelections = new Map(allSelections);

    // Remove unselected items
    artworks.forEach((item) => {
      if (!e.value.find((selected) => selected.id === item.id)) {
        newSelections.delete(item.id);
      }
    });

    // Add newly selected items
    e.value.forEach((item) => {
      newSelections.set(item.id, item as IData);
    });

    // Update state
    setAllSelections(newSelections);

    // Update selected products for the current page
    setSelectedProducts(artworks.filter((item) => newSelections.has(item.id)));
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = useCallback(
    (value: string) => {
      visitedPage.current = [];
      const numToSelect = Number(value);
      const newSelections = new Map(allSelections);

      if (page === 1) {
        if (numToSelect <= artworks.length) {
          // Select only items on the current page up to the desired number
          artworks.slice(0, numToSelect).forEach((item) => {
            newSelections.set(item.id, item);
          });
        } else {
          // Select all items on the current page
          artworks.forEach((item) => {
            newSelections.set(item.id, item);
          });
          setPagesHaveSelectedItems(Math.ceil(numToSelect / rows));
          setLastPageHaveSelectedItems(numToSelect % rows);
        }
      }

      setAllSelections(newSelections);

      // Update selected products
      setSelectedProducts(
        artworks.filter((item) => newSelections.has(item.id))
      );
    },
    [artworks, page, rows, allSelections]
  );

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setPage(event.page + 1);
    setRows(event.rows);

    // Update selected products for the new page
    const currentPageSelections = artworks.filter((item) =>
      allSelections.has(item.id)
    );

    setSelectedProducts(currentPageSelections);
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <DataTable
        size="small"
        loading={loading}
        value={artworks}
        selection={selectedProducts}
        selectionMode={null}
        onSelectionChange={handleSelectionChange}
        dataKey="id"
      >
        <Column
          selectionMode="multiple"
          header={<CustomHeader handleSubmit={handleSubmit} />}
          headerClassName="custom-header"
          headerStyle={{ width: "3rem" }}
        />
        {columns.map((column, i) => (
          <Column key={i} field={column.field} header={column.header} />
        ))}
      </DataTable>
      <Paginator
        first={(page - 1) * paginationData.limit}
        rows={paginationData.limit}
        totalRecords={paginationData.total}
        onPageChange={onPageChange}
        pageLinkSize={7}
      />
    </div>
  );
};

export default Tables;
