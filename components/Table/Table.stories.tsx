import type { Meta as MetaObj, StoryObj } from "@storybook/react";

import { Table as TableComponent } from "components";

export default {
  title: "Design System/Table",
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
  },
} as MetaObj;

export const SampleTable: StoryObj = {
  render: () => (
    <TableComponent>
      <caption>Sample Table</caption>
      <thead>
        <tr>
          <th scope="col">Header 1</th>
          <th scope="col">Header 2</th>
          <th scope="col">Header 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Row 1, Column 1</td>
          <td>Row 1, Column 2</td>
          <td>Row 1, Column 3</td>
        </tr>
        <tr>
          <td>Row 2, Column 1</td>
          <td>Row 2, Column 2</td>
          <td>Row 2, Column 3</td>
        </tr>
        <tr>
          <td>Row 3, Column 1</td>
          <td>Row 3, Column 2</td>
          <td>Row 3, Column 3</td>
        </tr>
      </tbody>
    </TableComponent>
  ),
};

export const CombinedTable: StoryObj = {
  render: () => (
    <TableComponent>
      <caption>Prices</caption>
      <colgroup>
        <col span={0} />
        <col span={1} />
        <col span={2} />
      </colgroup>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Tax</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Item 1</td>
          <td>100</td>
          <td>12</td>
        </tr>
        <tr>
          <td>Item 2</td>
          <td>200</td>
          <td>24</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>Total</td>
          <td colSpan={2}>$336</td>
        </tr>
      </tfoot>
    </TableComponent>
  ),
};
